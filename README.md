# 🏡 Mini Real Estate Chatbot – Excel-Based Analytics Assistant

A chat-driven, smart analytics demo for real-estate Excel datasets.  
Ask the app something like **“Analyze Wakad”**, **“Show price trends for Aundh”** or **“Which area has highest demand?”**, and it returns:

- 📌 A clean, human-readable **summary**
- 📈 A **time-series price chart**
- 🥧 A **demand distribution pie chart**
- 📊 A **filtered data table**
- ⬇️ **CSV download**
- 📁 Optional **Excel upload** to analyze custom datasets

This project contains:

- **Backend** (Python + Flask):  
  Reads Excel files, normalizes values, extracts numeric/area columns, detects price/demand fields, aggregates yearly trends, builds summaries, and generates JSON responses.

- **Frontend** (React):  
  Provides a chat UI, renders charts (Chart.js), displays tables, allows CSV download, and supports Excel upload.

---

# 📚 Table of Contents
1. Features  
2. Architecture & Data Flow  
3. File Structure  
4. Quick Start (Windows)  
5. Backend Setup & API Reference  
6. Frontend Setup & Usage  
7. Data Format & Normalization  
8. Testing & Diagnostics  
9. Production Notes  
10. Troubleshooting / FAQs  
11. Contributing  
12. License  
13. Contact  
14. Changelog  

---

# 🚀 Features

### 💬 Conversational Search  
Ask natural-language questions like:  
- “Analyze Wakad”  
- “Price trend in Aundh”  
- “Demand for Kharadi”  

### 🧠 Automatic Data Understanding  
Backend auto-detects:
- Price-like numeric columns  
- Demand-like columns  
- Area/locality columns  
- Date/year information  

### 📈 Analytics Components  
- **Line Chart:** Time-series avg price trend  
- **Pie Chart:** Demand distribution  
- **Table:** Filtered dataset preview  
- **CSV Download:** Export filtered dataset  

### 📁 Upload Your Own Excel File  
Supports `.xlsx` files:  
Upload → Backend parses → Frontend updates instantly

### 🌓 Dark Themed Responsive UI  
Optimized for desktop & mobile  
Smooth animations & clean layout

---

# 🏗 Architecture & Data Flow

```
React Frontend (Chat UI)
       |
       |  User query / file upload
       v
Flask Backend (/api/query, /api/upload)
       |
       |  Excel parsing + column detection + trend building
       v
JSON Response
(summary, price_chart, demand_chart, table)
       |
       v
React Frontend
(Charts + Table + Summary + CSV Download)
```

Backend performs:

1. Read Excel using **openpyxl**
2. Normalize cell values (currency, %, dates, numbers)
3. Detect:
   - Price column  
   - Demand column  
   - Area/locality column  
   - Date/year column
4. Aggregate year-wise price averages
5. Create distribution for pie chart
6. Generate summary sentence
7. Return JSON for UI rendering

---

# 📁 Project Structure

```
real-estate-chatbot/
|
├── backend/
│   ├── app.py                 # Flask server + endpoints
│   ├── read_excel.py          # Parsing, normalization, detection
│   ├── utils.py               # Helper functions
│   ├── requirements.txt
│   ├── sample_data/
│   │    └── sample_realestate.xlsx
│   └── test_api.py            # API tests
|
└── frontend/
    ├── public/
    ├── src/
    │   ├── App.js             # Main orchestration
    │   ├── components/
    │   │   ├── ChatInput.js
    │   │   ├── MessageList.js
    │   │   ├── ResultCard.js
    │   │   ├── PriceChart.js
    │   │   ├── PieChartComp.js
    │   │   └── DataTable.js
    │   ├── index.js
    │   └── styles.css
    ├── package.json
```

---

# ⚡ Quick Start (Windows PowerShell)

## 1️⃣ Clone the Repo
```
git clone https://github.com/Yashkolte1/real-estate-chatbot.git
cd real-estate-chatbot
```

---

# 🖥 Backend Setup (Flask)

## Install dependencies:
```
cd backend
pip install -r requirements.txt
```

## Start backend server:
```
python app.py
```

Your backend runs at:

```
http://localhost:8000
http://localhost:8000/api
```

---

# 🎨 Frontend Setup (React)

```
cd ../frontend
npm install
npm start
```

Frontend app runs at:

```
http://localhost:3000
```

---

# 🔗 API Reference

### GET `/api/query`
Analyze an area or query.

**Query params**
```
q          → user query (“Analyze Wakad”)
area       → override inferred area
use_sample → true/false
price_col  → override price column
demand_col → override demand column
```

**Response**
```json
{
  "summary": "...",
  "chart": [...],
  "demand_chart": [...],
  "table": [...],
  "area": "Wakad"
}
```

---

### GET `/api/areas`
Return detected localities.

```json
{ "areas": ["Wakad","Aundh","Baner",...] }
```

---

### GET `/api/columns`
Detected numeric candidates.

```json
{
  "price_cols": ["avg_rate", "total_sales"],
  "demand_cols": ["queries","interest"]
}
```

---

### POST `/api/upload`
Upload Excel file (`.xlsx`).

Response:
```json
{
  "message": "File uploaded and parsed successfully",
  "rows": 245
}
```

---

### GET `/api/download`
Returns CSV filtered by area.

---

# 📊 Data Normalization (How Backend Processes Excel)

### ✔ Price-like values  
`₹ 1,25,000` → `125000.0`  
`1.5L` → `150000`  
Commas & currency removed.

### ✔ Demand-like values  
`25%` → `0.25`  
`3.2K` → `3200`

### ✔ Dates  
Converted to ISO (`YYYY-MM-DD`)

### ✔ Blank cells  
Converted to `""` or `None`

### ✔ Area detection  
Finds columns with:
```
area, locality, zone, place, region, location
```
Returns highest-frequency values.

---



# 👤 Author / Contact

**Yash Kolte**  
Email: *yashkolte2994@gmail.com*  
GitHub: [Yashkolte1](https://github.com/Yashkolte1)

---
