
Mini Real Estate Chatbot - Ready to run

Folders:
- backend/    -> Flask backend (app.py)
- frontend/   -> React frontend
- sample_data -> sample_realestate.xlsx included in backend/sample_data

Quick Start (Windows PowerShell)
1) Backend:
   cd C:\Users\comp\Downloads\sigmavalue_full_submission\backend
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   python app.py

2) Frontend (new terminal):
   cd C:\Users\comp\Downloads\sigmavalue_full_submission\frontend
   npm install
   # create .env file: REACT_APP_API_BASE=http://localhost:8000/api
   npm start

API Examples:
- GET /api/query?q=Analyze Wakad&use_sample=true
- POST /api/upload (multipart form, file field 'file')
- GET /api/download?area=Wakad&use_sample=true

