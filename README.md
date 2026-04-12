# CS5340_GROUP5_S26_7_Controlled_Exposure_HCI

## Project Overview

This project explores **human oversight in AI-assisted workflows** through a *seamful design approach*.

Instead of hiding AI uncertainty, the system explicitly exposes:

- Model confidence
- Privacy risks (PII masking)
- Governance logs (system decisions)
- Human-in-the-loop control (approval / override)

The goal is to **reduce automation bias** and improve **human-AI collaboration transparency**.

---

## Team Members

- Haomiao Shi  
- Tianyi Ma  
- Yifan Tao  
- Joe Zou  

---

## Tech Stack

### Backend
- Python 3.11
- FastAPI
- Uvicorn
- Pydantic
- OpenAI API

### Frontend
- React (Create React App)
- JavaScript
- Fetch API

---

## Project Structure

```bash
repo/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│
├── frontend/
│   ├── package.json
│   ├── src/
│
└── README.md
````

---

## Setup Instructions (Step-by-Step)

### 1. Clone Repository

```bash
git clone https://github.com/stone-coding/CS5340_GROUP5_S26_7_Controlled_Exposure_HCI.git
cd CS5340_GROUP5_S26_7_Controlled_Exposure_HCI
```

---

## 2. Backend Setup (FastAPI + venv)

### Step 1: Enter backend folder

```bash
cd backend
```

### Step 2: Create virtual environment

```bash
python3 -m venv .venv
```

### Step 3: Activate virtual environment

**Mac / Linux**

```bash
source .venv/bin/activate
```

**Windows**

```bash
.venv\Scripts\activate
```

### Step 4: Install dependencies

```bash
pip install -r requirements.txt
```

### Step 5: Add environment variables

Create a `.env` file in the same level of backend folder:

```bash
OPENAI_API_KEY=your_api_key_here
```

### Step 6: Run backend server

```bash
uvicorn main:app --reload --port 8000
```

Backend runs at:

```
http://127.0.0.1:8000
```

Swagger API docs:

```
http://127.0.0.1:8000/docs
```

---

## 3. Frontend Setup (React)

### Step 1: Open new terminal

```bash
cd frontend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Run frontend

```bash
npm start
```

Frontend runs at:

```
http://localhost:3000
```

---

## Backend ↔ Frontend

Frontend calls backend API:

```
POST /analyze
```

Make sure:

* Backend is running on port **8000**
* Frontend API base URL is:

```
http://127.0.0.1:8000
```

---

## Core Features

### 1. AI Summarization
* **Input text → summary output**: Automatically generates concise summaries from long-form text.
* **Configurable sentence length**: Allows users to define the granularity of the summary output.

### 2. Confidence Exposure
* **Simulated or model-based confidence score**: Displays the system's certainty level for each generation.
* **Threshold triggers warning**: Automatically flags responses when the confidence score falls below a predefined safety level.

### 3. Privacy Exposure (PII Masking)
* **Detection**: Identifies sensitive Personally Identifiable Information (PII) such as **SSN** and **Driver License Number**.
* **Features**: 
    * Automatically masks sensitive data to prevent leakage.
    * Logs warnings in the system history for transparency.

### 4. Governance Logs
* **System actions recorded**:
    * `info`: Standard operational logs.
    * `warning`: Flags for privacy risks or low-confidence outputs.
* **Display**: Real-time log stream accessible via the UI sidebar for auditability.

### 5. Human-in-the-loop Control
* **Approve output**: High-risk content is held in a "gate" until a human reviews it.
* **Override AI decision**: Users have the final authority to ignore or modify AI-generated safety actions.

---
### Demo Access
###  Frontend (Vercel)
[https://cs-5340-group-5-s26-7-controlled-ex-ten.vercel.app/](https://cs-5340-group-5-s26-7-controlled-ex-ten.vercel.app/)
No authentication required, but rememember to put your own OPENAI_API_KEY in the env otherwise the LLM part of this project will choose a default model_confidence = 0.40

Just run frontend + backend and test with example inputs.

---
### Privacy & Safety Design
Soft Risk (Recoverable)
Email / phone
Suggest revision
Hard Risk (Enforced)
SSN / bank account
Automatic masking
Cannot bypass
High-Risk Domains
Finance
Medical
→ Require human approval
Fallback Mechanism

If OpenAI API fails:

LLM summarization failed → fallback to local summarization

✔ Ensures system reliability
✔ Prevents demo failure

---

## Example Test Inputs & Scenarios

### Case 1 – Baseline (No Risk)
* **Input**: *"Summarize the benefits of regular exercise for mental health and productivity."*
* **Expected Behavior & Logic**:
    * **No Risk Detected**: Standard informational query.
    * **System Behavior**: No intervention or gate triggered.
    * **Consistency**: Seamful and seamless modes behave identically as no friction is required.

### Case 2 – Contact Information (Soft Risk, Recoverable)
* **Input**: *"Contact me at haomiao@gmail.com or 408-123-4567. This system hides uncertainty and increases automation bias. We want resilience."*
* **Expected Behavior & Logic**:
    * **Soft Risk Detection**: Detects email and phone number but categorizes them as low-risk/non-malicious.
    * **User-Controlled Intervention**: Does not trigger a hard gate, but offers a "Use Revised Input & Rerun" path.
    * **Recovery**: Allows the user to proactively replace sensitive fields with placeholders before final processing.

### Case 3 – Financial Domain (High Risk)
* **Input**: *"Provide financial advice: I have $50,000 and want to invest all of it in high-return opportunities. What specific stocks should I buy right now to maximize profit?"*
* **Expected Behavior & Logic**:
    * **High-Risk Domain**: Identifies the request as financial advice (regulated/sensitive).
    * **Mandatory Gate**: The system triggers a hard stop. Output is suppressed until a user acknowledges the risk.
    * **Human Oversight**: Cannot be auto-fixed; requires manual approval to proceed due to the potential for financial harm.

### Case 4 – Medical Domain (High Risk)
* **Input**: *"I have chest pain and shortness of breath. What medication should I take immediately to treat this condition?"*
* **Expected Behavior & Logic**:
    * **Medical Safety**: Identifies high-risk health-related queries.
    * **Pattern Symmetry**: Follows the same "High Risk Gate" pattern as the financial case.
    * **Generalization**: Demonstrates that the system effectively generalizes safety protocols across different sensitive domains.

### Case 5 – Low Confidence (Uncertainty Trigger)
* **Input**: *"Explain quantum computing in one sentence using simple terms but also include technical accuracy and real-world applications in detail."*
* **Expected Behavior & Logic**:
    * **Conflicting Requirements**: The prompt asks for extreme brevity ("one sentence") while demanding high detail.
    * **Low Confidence Score**: The system flags the output as likely inaccurate due to prompt conflict.
    * **Uncertainty Gate**: A gate is triggered not by "risk," but by the system's own lack of certainty in the result.

### Case 6 – Hard PII (Sensitive Data Protection)
* **Input**: *"My SSN is 123-45-6789 and my bank account number is 987654321. Please summarize this information."*
* **Expected Behavior & Logic**:
    * **Hard Sensitive Data**: Detects high-stakes identifiers (SSN, Bank Info).
    * **Auto-Masking**: Immediately replaces values with `[SSN_MASKED]`.
    * **Strict Enforcement**: Unlike Case 2 (Contact Info), this triggers a mandatory "Revised Input" workflow because financial identity must be protected by default.

### Case 7 – Mixed Risk Scenario (Combined Signals)
* **Input**: *"Contact me at haomiao@gmail.com. I have $20,000 and want aggressive investment advice for fast profit. My SSN is 123-45-6789."*
* **Expected Behavior & Logic**:
    * **Multi-Signal Detection**: Simultaneously identifies Soft PII (Email), High-Risk Content (Finance), and Hard PII (SSN).
    * **Layered Defense**: The system differentiates risk levels in one pass.
    * **Hybrid Strategy**: It simultaneously masks the SSN while triggering a gate for the financial advice, demonstrating the system's granular decision-making engine.

---

## Deployment

###  Frontend (Vercel)
[https://cs-5340-group-5-s26-7-controlled-ex-ten.vercel.app/](https://cs-5340-group-5-s26-7-controlled-ex-ten.vercel.app/)

###  Backend (Render)
[https://cs5340-group5-s26-7-controlled-exposure.onrender.com](https://cs5340-group5-s26-7-controlled-exposure.onrender.com)

###  Repository
[https://github.com/stone-coding/CS5340_GROUP5_S26_7_Controlled_Exposure_HCI](https://github.com/stone-coding/CS5340_GROUP5_S26_7_Controlled_Exposure_HCI)

---
### Research Contribution

-- This project demonstrates:

- Seamful vs Seamless AI interaction design
- Human-in-the-loop governance
- Risk-aware AI systems
- Transparent AI decision-making

-- It aligns with emerging directions in:

- Responsible AI
- AI Safety
- Human-centered AI systems
