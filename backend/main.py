from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Tuple
from dotenv import load_dotenv
from openai import OpenAI
import os
import re
import math
from fastapi import UploadFile, File, HTTPException
from pypdf import PdfReader
from io import BytesIO

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise RuntimeError("OPENAI_API_KEY is missing. Put it in .env or environment variables.")

client = OpenAI(api_key=OPENAI_API_KEY)

app = FastAPI(title="Seamful MVP", version="0.3.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LogItem(BaseModel):
    level: str
    message: str


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1)
    max_sentences: int = Field(4, ge=1, le=10)


class AnalyzeResponse(BaseModel):
    summary: str
    confidence: float
    risk_type: str
    risk_level: str
    logs: List[LogItem]

    masked_text: str
    pii_count: int
    contact_info_count: int
    suggestions: List[str]
    can_apply_safe_version: bool
    review_reason: str

def classify_risk(text: str) -> Tuple[str, str, List[LogItem]]:
    """
    Simple rule-based domain risk classifier.
    Returns: (risk_type, risk_level, logs)
    """
    logs: List[LogItem] = []

    lower_text = text.lower()

    medical_keywords = [
        "diagnosis", "treatment", "prescription", "symptom", "patient",
        "medical", "drug", "medication", "hospital", "insurance claim",
        "mental health", "therapy", "blood pressure"
    ]

    finance_keywords = [
        "bank", "loan", "mortgage", "investment", "stock", "tax",
        "financial", "credit card", "debt", "salary", "payroll",
        "account number", "routing number", "transaction"
    ]

    medical_hits = sum(1 for kw in medical_keywords if kw in lower_text)
    finance_hits = sum(1 for kw in finance_keywords if kw in lower_text)

    if medical_hits > finance_hits and medical_hits > 0:
        risk_type = "medical"
        risk_level = "high"
        logs.append(LogItem(
            level="warning",
            message="Medical-related content detected. Extra human review is recommended."
        ))
    elif finance_hits > medical_hits and finance_hits > 0:
        risk_type = "finance"
        risk_level = "high"
        logs.append(LogItem(
            level="warning",
            message="Finance-related content detected. Extra human review is recommended."
        ))
    else:
        risk_type = "general"
        risk_level = "low"
        logs.append(LogItem(
            level="info",
            message="No high-risk medical or financial domain detected."
        ))

    return risk_type, risk_level, logs

def mask_pii(text: str) -> Tuple[str, int, int, List[LogItem]]:
    logs: List[LogItem] = []

    masked_text = text
    pii_count = 0           # count real sensitive infomation
    contact_info_count = 0  # email / phone
    detected_types: List[str] = []
    contact_types: List[str] = []

    # -------- soft signals: contact info only --------
    soft_patterns = [
        (
            r"\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b",
            "[EMAIL_MASKED]",
            "email",
        ),
        (
            r"\b(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b",
            "[PHONE_MASKED]",
            "phone",
        ),
    ]

    # -------- hard signals: actually risky --------
    hard_patterns = [
        (
            r"\b\d{3}-\d{2}-\d{4}\b",
            "[SSN_MASKED]",
            "ssn",
        ),
        (
            r"\b(?:\d[ -]*?){13,19}\b",
            "[CARD_MASKED]",
            "credit card",
        ),
        (
            r"(?i)\brouting number[:\s#-]*\d{9}\b",
            "[ROUTING_MASKED]",
            "routing number",
        ),
        (
            r"(?i)\b(account number|bank account)[:\s#-]*\d{6,17}\b",
            "[ACCOUNT_MASKED]",
            "bank account",
        ),
        (
            r"(?i)\b(driver'?s license|dl number|license number)[:\s#-]*[A-Z0-9-]{5,20}\b",
            "[DL_MASKED]",
            "driver license",
        ),
    ]

    # detect contact info but DO NOT force warning
    for pattern, replacement, label in soft_patterns:
        matches = re.findall(pattern, masked_text)
        if matches:
            contact_info_count += len(matches)
            contact_types.append(label)
            # generate revised input for demo
            masked_text = re.sub(pattern, replacement, masked_text)

    # detect truly sensitive info
    for pattern, replacement, label in hard_patterns:
        matches = re.findall(pattern, masked_text)
        if matches:
            pii_count += len(matches)
            detected_types.append(label)
            masked_text = re.sub(pattern, replacement, masked_text)

    # PIN / CVV / security code
    pin_pattern = r"(?i)\b(pin|cvv|security code|passcode)[:\s#-]*\d{3,6}\b"
    pin_matches = re.findall(pin_pattern, masked_text)
    if pin_matches:
        pii_count += len(pin_matches)
        detected_types.append("pin/cvv")
        masked_text = re.sub(pin_pattern, "[PIN_OR_CVV_MASKED]", masked_text)

    if pii_count > 0:
        unique_types = ", ".join(sorted(set(detected_types)))
        logs.append(
            LogItem(
                level="warning",
                message=f"High-risk sensitive data detected and masked ({pii_count} field(s): {unique_types})."
            )
        )

    if contact_info_count > 0:
        contact_labels = ", ".join(sorted(set(contact_types)))
        logs.append(
            LogItem(
                level="info",
                message=f"Contact information detected ({contact_info_count} field(s): {contact_labels}). Keeping or masking is optional."
            )
        )

    if pii_count == 0 and contact_info_count == 0:
        logs.append(LogItem(level="info", message="No sensitive data detected."))

    return masked_text, pii_count, contact_info_count, logs

def build_suggestions(
    original_text: str,
    masked_text: str,
    pii_count: int,
    contact_info_count: int,
    risk_type: str,
    risk_level: str,
    confidence: float,
) -> List[str]:
    suggestions: List[str] = []

    if pii_count > 0:
        suggestions.append(
            "Remove or replace high-risk sensitive information before using or sharing the result."
        )

    if contact_info_count > 0:
        suggestions.append(
            "Contact information was detected. Keep it if it is intentionally shared, or use a revised version before forwarding or publishing."
        )

    if risk_level == "high":
        suggestions.append(
            f"This content is in a {risk_type} domain, so human review is recommended before approval."
        )

    if confidence < 0.60:
        suggestions.append(
            "Clarify or simplify the input and rerun the analysis to improve confidence."
        )

    if masked_text != original_text:
        suggestions.append(
            "Use the revised input if you want placeholders instead of the original contact or sensitive details."
        )

    if not suggestions:
        suggestions.append("No immediate revision is required.")

    return suggestions


def build_rule_based_confidence(
    original_text: str,
    masked_text: str,
    summary: str,
    pii_count: int,
    risk_type: str,
    risk_level: str,
) -> Tuple[float, List[LogItem]]:
    """
    Interpretable adjustment layer for HCI/demo purposes.
    This is NOT accuracy; it's a heuristic support signal.
    """
    logs: List[LogItem] = []
    score = 1.0

    if risk_level == "high":
        score -= 0.10
        logs.append(
            LogItem(
                level="info",
                message=f"Confidence adjusted downward because the content was classified as {risk_type} risk."
            )
        )

    if pii_count > 0:
        score -= 0.15
        logs.append(
            LogItem(
                level="info",
                message="Confidence adjusted downward because sensitive content was detected."
            )
        )

    if len(summary.strip()) < 80:
        score -= 0.15
        logs.append(
            LogItem(
                level="info",
                message="Confidence adjusted downward because the summary is short."
            )
        )

    if len(original_text.strip()) > 2000:
        score -= 0.10
        logs.append(
            LogItem(
                level="info",
                message="Confidence adjusted downward because the input is relatively long."
            )
        )

    masked_token_count = sum(
        masked_text.count(token)
        for token in [
            "[SSN_MASKED]",
            "[CARD_MASKED]",
            "[ROUTING_MASKED]",
            "[ACCOUNT_MASKED]",
            "[DL_MASKED]",
            "[PIN_OR_CVV_MASKED]",
        ]
    )

    if masked_token_count >= 2:
        score -= 0.05
        logs.append(
            LogItem(
                level="info",
                message="Confidence adjusted slightly because multiple masked fields may reduce clarity."
            )
        )

    score = max(0.10, min(1.0, score))
    return round(score, 2), logs


def llm_summarize_with_confidence(text: str, max_sentences: int = 4) -> Tuple[str, float]:
    """
    Generates a summary with a model-based confidence proxy from token logprobs.
    Important: this is model certainty about generated tokens, not factual correctness.
    """
    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        temperature=0,
        logprobs=True,
        top_logprobs=3,
        messages=[
            {
                "role": "system",
                "content": (
                    "You are a concise summarization assistant. "
                    "Summarize clearly and preserve the core meaning. "
                    f"Limit the output to at most {max_sentences} sentences."
                ),
            },
            {
                "role": "user",
                "content": text,
            },
        ],
    )

    choice = response.choices[0]
    summary = (choice.message.content or "").strip()

    token_items = []
    if choice.logprobs and choice.logprobs.content:
        token_items = choice.logprobs.content

    # Filter out sentinel ultra-low values like -9999.0
    valid_logprobs = [
        t.logprob for t in token_items
        if t.logprob is not None and t.logprob > -100
    ]

    if not valid_logprobs:
        model_conf = 0.50
    else:
        avg_logprob = sum(valid_logprobs) / len(valid_logprobs)

        # Convert avg logprob into a bounded 0..1 proxy.
        # exp(logprob) gives per-token probability-like value, but can be harsh,
        # so clamp to keep the UI stable.
        model_conf = math.exp(avg_logprob)
        model_conf = max(0.0, min(1.0, model_conf))

    return summary, round(model_conf, 2)

def extract_text_from_pdf_bytes(file_bytes: bytes) -> str:
    try:
        reader = PdfReader(BytesIO(file_bytes))
        pages = []
        for page in reader.pages:
            page_text = page.extract_text() or ""
            if page_text.strip():
                # Normalize whitespace for readability
                cleaned = re.sub(r"\s+", " ", page_text).strip()
                pages.append(cleaned)

        return "\n".join(pages).strip()
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to read PDF: {str(e)}")

@app.get("/health")
def health():
    return {"status": "ok"}



@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    return run_analysis(req.text, req.max_sentences)


def run_analysis(text: str, max_sentences: int) -> AnalyzeResponse:
    logs: List[LogItem] = []
    logs.append(LogItem(level="info", message="Analysis started."))

    masked_text, pii_count, contact_info_count, pii_logs = mask_pii(text)
    logs.extend(pii_logs)

    risk_type, risk_level, risk_logs = classify_risk(text)
    logs.extend(risk_logs)

    try:
        summary, model_confidence = llm_summarize_with_confidence(
            masked_text, max_sentences
        )
        logs.append(LogItem(level="info", message="Summary generated by language model."))
        logs.append(
            LogItem(
                level="info",
                message=f"Model confidence estimated from token log probabilities: {model_confidence:.2f}"
            )
        )
    except Exception as e:
        logs.append(
            LogItem(
                level="warning",
                message=f"Model summarization failed ({str(e)}). Falling back to local summarization."
            )
        )
        summary = masked_text[:300].strip()
        model_confidence = 0.40

    rule_confidence, rule_logs = build_rule_based_confidence(
        original_text=text,
        masked_text=masked_text,
        summary=summary,
        pii_count=pii_count,
        risk_type=risk_type,
        risk_level=risk_level,
    )
    logs.extend(rule_logs)
    logs.append(
        LogItem(
            level="info",
            message=f"Rule-based confidence estimate: {rule_confidence:.2f}"
        )
    )

    confidence = round(0.7 * model_confidence + 0.3 * rule_confidence, 2)
    logs.append(
        LogItem(
            level="info",
            message=f"Final confidence score: {confidence:.2f}"
        )
    )

    if confidence < 0.60:
        logs.append(
            LogItem(
                level="warning",
                message="Low confidence detected. Human review is recommended before approval."
            )
        )
    else:
        logs.append(
            LogItem(
                level="info",
                message="Confidence is within the acceptable range."
            )
        )

    suggestions = build_suggestions(
        original_text=text,
        masked_text=masked_text,
        pii_count=pii_count,
        contact_info_count=contact_info_count,
        risk_type=risk_type,
        risk_level=risk_level,
        confidence=confidence,
    )

    can_apply_safe_version = masked_text != text

    if pii_count > 0:
        review_reason = "High-risk sensitive information was detected and masked."
    elif risk_level == "high":
        review_reason = f"This content falls into a higher-risk {risk_type} domain."
    elif confidence < 0.60:
        review_reason = "The confidence score is low, so review is recommended."
    elif contact_info_count > 0:
        review_reason = "Contact information was detected. Review is optional unless you plan to share this result."
    else:
        review_reason = "No major risk signal was detected."

    return AnalyzeResponse(
        summary=summary,
        confidence=confidence,
        risk_type=risk_type,
        risk_level=risk_level,
        logs=logs,
        masked_text=masked_text,
        pii_count=pii_count,
        suggestions=suggestions,
        can_apply_safe_version=can_apply_safe_version,
        review_reason=review_reason,
        contact_info_count=contact_info_count,
    )

@app.post("/analyze-pdf", response_model=AnalyzeResponse)
async def analyze_pdf(
    file: UploadFile = File(...),
    max_sentences: int = 4,
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_bytes = await file.read()
    extracted_text = extract_text_from_pdf_bytes(file_bytes)

    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="No readable text found in the PDF.")

    return run_analysis(extracted_text, max_sentences)

@app.post("/extract-pdf-text")
async def extract_pdf_text(file: UploadFile = File(...)):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    file_bytes = await file.read()
    extracted_text = extract_text_from_pdf_bytes(file_bytes)

    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="No readable text found in the PDF.")

    return {"text": extracted_text}