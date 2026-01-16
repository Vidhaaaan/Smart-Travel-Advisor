# Smart-Travel-Advisor
An explainable AI-powered travel recommendation system that analyzes user preferences such as interest, budget, season, and travel type to suggest suitable destinations, generate day-wise itineraries with cost breakdowns, and provide transparent reasoning. Built using Python (Flask), rule-based inference, and a web-based frontend.
<br>
## 📌 Project Overview

The **Travel Expert System** is a rule-based intelligent web application designed to assist users in planning trips.  
It analyzes user preferences such as **interest, budget, season, travel type, and group size**, and recommends destinations using structured data and weighted inference logic.

The system focuses on **explainability**, ensuring users understand *why* a destination is recommended.

---

## 🎯 Key Features

- ✅ AI-powered destination recommendations  
- ✅ Explainable reasoning for each recommendation  
- ✅ Day-wise itinerary generation  
- ✅ Realistic budget estimation with cost breakup  
- ✅ Hotel and stay suggestions based on budget  
- ✅ Region-diverse recommendations  
- ✅ Web-based frontend with interactive UI  

---

## 🧠 System Architecture

Frontend (HTML / CSS / JavaScript)
↓
Flask Backend (app.py)
↓
Inference Engine (rule-based logic)
↓
Itinerary & Hotel Modules
↓
JSON Response → Frontend Display

yaml
Copy code

---

## ⚙️ Technologies Used

### Backend
- Python
- Flask
- Flask-CORS
- Pandas
- NumPy

### Frontend
- HTML
- CSS
- JavaScript

### Other
- Rule-Based Expert System
- Explainable AI (XAI)
- REST APIs

---

## 📂 Project Structure

travel-expert-system/
│
├── backend/
│ ├── app.py
│ ├── inference.py
│ ├── rules.py
│ ├── itinerary.py
│ ├── hotel_logic.py
│ ├── explanation.py
│ ├── csv_to_json.py
│ ├── places_enriched.csv
│ ├── places.json
│ ├── requirements.txt
│ └── Procfile
│
├── frontend/
│ ├── home.html
│ ├── home.css
│ ├── home.js
│ ├── index.html
│ ├── style.css
│ ├── script.js
│ └── assets/
│ └── mandala-bg.jpg
│
├── .venv/
└── README.md

yaml
Copy code

---

## 🚀 How to Run the Project Locally

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/travel-expert-system.git
cd travel-expert-system
2️⃣ Create & Activate Virtual Environment
bash
Copy code
python -m venv .venv
.venv\Scripts\activate   # Windows
3️⃣ Install Dependencies
bash
Copy code
cd backend
python -m pip install -r requirements.txt
4️⃣ Run Backend Server
bash
Copy code
python app.py
Backend will run at:

arduino
Copy code
http://localhost:5000
5️⃣ Open Frontend
Open the following file in your browser:

arduino
Copy code
frontend/home.html
🔁 Application Flow
User enters travel preferences on the frontend

Frontend sends request to Flask backend

Inference engine evaluates destinations using rules and scores

System generates recommendations with explanations

User can generate itinerary and hotel suggestions

Results are displayed on the website

🧪 Sample Output
json
Copy code
{
  "name": "Manali",
  "match_percentage": 92.4,
  "why_recommended": [
    "Matches your nature interest",
    "Family-friendly destination"
  ],
  "warnings": ["Cold temperatures expected"]
}
🧠 Key Concepts Used
Rule-Based Expert System

Explainable AI (XAI)

Weighted Scoring Logic

Decision Support System

Budget Modeling

📌 Future Enhancements
Machine Learning–based recommendations

User authentication and saved itineraries

Real-time weather and hotel APIs

Mobile-friendly UI

PDF itinerary export

🎓 Academic Relevance
This project is suitable for:

AI / Expert Systems coursework

Final year or mini project

Demonstration of Explainable AI concepts
