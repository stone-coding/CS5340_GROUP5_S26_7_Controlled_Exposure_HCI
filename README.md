# CS5340_GROUP5_S26_7_Controlled_Exposure_HCI

## Project Overview

This project explores **human oversight in AI-assisted workflows** through a *seamful design approach*.

Instead of hiding AI uncertainty, the system explicitly exposes:

- Model confidence
- Privacy risks (PII masking)
- Governance logs (system decisions)
- Human-in-the-loop control (approval / override)

The goal is to **reduce automation bias** and improve **human-AI collaboration transparency**.

This project was developed as part of a Human-Computer Interaction (HCI) research workflow. :contentReference[oaicite:0]{index=0}

---

## Team Members

- Haomiao Shi  
- Tianyi Ma  
- Yifan Tao  
- Joe Zou  

---

## Tech Stack

### Backend
- Python 3.10+
- FastAPI
- Uvicorn
- Pydantic
- (Optional) OpenAI API

### Frontend
- React (Create React App)
- JavaScript
- Fetch API

---

## Project Structure
repo/
│
├── backend/
│ ├── main.py
│ ├── requirements.txt
│
├── frontend/
│ ├── package.json
│ ├── src/
│
└── README.md


---

## Setup Instructions (Step-by-Step)

## 1. Clone Repository

```bash
git clone https://github.com/stone-coding/CS5340_GROUP5_S26_7_Controlled_Exposure_HCI.git
cd CS5340_GROUP5_S26_7_Controlled_Exposure_HCI


## 2. Backend Setup (FastAPI + venv)
Step 1: Enter backend folder
cd backend
Step 2: Create virtual environment
python3 -m venv .venv
Step 3: Activate virtual environment

Mac / Linux

source .venv/bin/activate

Windows

.venv\Scripts\activate
Step 4: Install dependencies
pip install -r requirements.txt
Step 5: (Optional) Add environment variables

Create a .env file:

OPENAI_API_KEY=your_api_key_here
Step 6: Run backend server
uvicorn main:app --reload --port 8000

Backend runs at:

http://127.0.0.1:8000

Swagger API docs:

http://127.0.0.1:8000/docs
## 3. Frontend Setup (React)
Step 1: Open new terminal
cd frontend
Step 2: Install dependencies
npm install

Step 3: Run frontend
npm start

Frontend runs at:

http://localhost:3000
 Backend ↔ Frontend

Frontend calls backend API:

POST /analyze

Make sure:

Backend is running on port 8000
Frontend API base URL is:
http://127.0.0.1:8000
 Core Features
1. AI Summarization
Input text → summary output
Configurable sentence length
2. Confidence Exposure
Simulated or model-based confidence score
Threshold triggers warning
3. Privacy Exposure (PII Masking)
Detects:
Emails
Phone numbers
Masks sensitive data
Logs warnings
## 4. Governance Logs
System actions are recorded:
info
warning
Displayed in UI sidebar
## 5. Human-in-the-loop Control
User can:
Approve output
Override AI decision
Example Test Inputs
Case 1 – Privacy Detection
Contact me at test@gmail.com or 408-123-4567

Expected:

PII masked
Warning log generated
Case 2 – Low Confidence
Short unclear input

Expected:

Low confidence
Warning triggered
Case 3 – Normal Text
AI systems should expose uncertainty to improve trust.

Expected:

Clean summary
No warning
 Deployment (Optional)

Frontend (Vercel):https://cs-5340-group-5-s26-7-controlled-ex-ten.vercel.app/
Backend (Render / Railway):https://cs5340-group5-s26-7-controlled-exposure.onrender.com


