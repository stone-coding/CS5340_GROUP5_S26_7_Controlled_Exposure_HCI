from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Any, Dict, Optional, List
import re
import random

app = FastAPI(title="Seamful MVP", version="0.2.0")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://cs-5340-group-5-s26-7-controlled-ex-ten.vercel.app",
        "https://cs5340-group-5-s26-7-controlled-exposure-hci-azyu-fx8w8nlmt.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class LogItem(BaseModel):
    level: str
    message: str


class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=1)
    max_sentences: int = 4


class AnalyzeResponse(BaseModel):
    summary: str
    confidence: float
    logs: List[LogItem]


def naive_summarize(text: str, max_sentences: int = 4) -> str:
    cleaned = re.sub(r"\s+", " ", text).strip()
    sentences = re.split(r"(?<=[.!?。！？])\s+", cleaned)
    sentences = [s.strip() for s in sentences if s.strip()]
    if not sentences:
        return cleaned[:300]
    return " ".join(sentences[:max_sentences])


def simulate_confidence(summary: str) -> float:
    # Imitation of Confidence score
    base = 0.5 + random.random() * 0.5
    if len(summary) < 80:
        base -= 0.2
    return round(max(min(base, 1.0), 0.1), 2)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/analyze", response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    logs = []

    logs.append(LogItem(level="info", message="Summarization started"))

    # 🔒 PII Mask First
    masked_text, pii_count, pii_logs = mask_pii(req.text)
    logs.extend(pii_logs)

    summary = naive_summarize(masked_text, req.max_sentences)

    confidence = simulate_confidence(summary)

    logs.append(LogItem(level="info", message=f"Confidence score: {confidence}"))

    if confidence < 0.6:
        logs.append(LogItem(level="warning", message="Low confidence detected"))
    else:
        logs.append(LogItem(level="info", message="Confidence acceptable"))

    return AnalyzeResponse(
        summary=summary,
        confidence=confidence,
        logs=logs
    )


def mask_pii(text: str):
    logs = []
    pii_count = 0

    # email
    email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b'
    matches = re.findall(email_pattern, text)
    pii_count += len(matches)
    text = re.sub(email_pattern, "[EMAIL_MASKED]", text)

    # phone
    phone_pattern = r'\b\d{3}[-.]?\d{3}[-.]?\d{4}\b'
    matches = re.findall(phone_pattern, text)
    pii_count += len(matches)
    text = re.sub(phone_pattern, "[PHONE_MASKED]", text)

    if pii_count > 0:
        logs.append(LogItem(level="warning", message=f"{pii_count} sensitive fields masked"))
    else:
        logs.append(LogItem(level="info", message="No PII detected"))

    return text, pii_count, logs
