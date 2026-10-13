# 🥗 NutriBot AI — Nutrition Agentic AI Application

<div align="center">

![Python](https://img.shields.io/badge/Python-3.11%2B-blue?logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.0-lightgrey?logo=flask&logoColor=white)
![IBM Granite](https://img.shields.io/badge/IBM%20Granite-LLM-0f62fe?logo=ibm&logoColor=white)
![watsonx.ai](https://img.shields.io/badge/IBM-watsonx.ai-purple?logo=ibm&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)
![Agentic AI](https://img.shields.io/badge/Agentic%20AI-SDLC-orange)

**A fully agentic, web-based AI application that generates personalised 7-day nutrition plans using IBM Granite LLM.**

[Features](#-features) · [Demo](#-demo-mode) · [Quick Start](#-quick-start) · [API](#-api-reference) · [Architecture](#-architecture) · [Ethics](#-ai-ethics--guardrails) · [Deployment](#-deployment)

</div>

---

## 📌 Overview

**NutriBot AI** is an **Agentic AI application** that autonomously collects user health profiles, reasons about individual nutritional requirements, and produces structured, personalised 7-day meal plans. Built on **IBM Granite LLM** (`ibm/granite-13b-instruct-v2`) via **IBM watsonx.ai**, it follows responsible AI principles at every step.

### What makes it "Agentic"?
Unlike simple chatbots, NutriBot AI:
- **Plans** — decomposes the user's health goal into a structured 7-day meal strategy
- **Reasons** — considers medical conditions, location, diet type, and activity level simultaneously
- **Acts** — generates, formats, and exports a complete nutrition document
- **Safeguards** — applies ethics guardrails before every response
- **Communicates** — answers follow-up questions in context

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🤖 IBM Granite LLM | `granite-13b-instruct-v2` via watsonx.ai |
| 📋 7-Day Meal Plan | Breakfast, snacks, lunch, dinner with calorie targets |
| 🩺 Medical-Aware | Adapts for diabetes, hypertension, heart disease, PCOS, thyroid |
| 🌍 Location-Aware | Recommends locally available foods per country |
| 💬 Chat Agent | Conversational Q&A for nutrition queries |
| 📥 .md Export | Download plan as a formatted Markdown file |
| 🛡️ Guardrails | Harmful content detection + AI ethics enforcement |
| ⚕️ Disclaimer | Medical disclaimer appended to every plan |
| 📱 Responsive UI | Works on desktop, tablet, and mobile |
| 🟢 Demo Mode | Fully functional without an IBM API key |

---

## 🏗️ Agentic AI SDLC

This project follows all 7 phases of the **Agentic AI Software Development Lifecycle**:

```
Phase 1 → Problem Scoping      Personalised nutrition for diverse health profiles
Phase 2 → Data & Context       Structured form: name, age, diet, medical, location, goal
Phase 3 → Agent Design         IBM Granite LLM with system prompt + planning logic
Phase 4 → Guardrail Integration Harmful keyword filter, content policy, medical disclaimer
Phase 5 → Tool Use             Plan generation · Q&A chat · .md file export
Phase 6 → Evaluation           Output validation + disclaimer enforcement
Phase 7 → Deployment           Flask API + HTML/CSS/JS + .bat launcher
```

---

## 🚀 Quick Start

### Option A — Windows (Double-Click)
```
Double-click  run.bat
```
The script will:
1. Check for Python 3.11+
2. Create a virtual environment
3. Install all dependencies
4. Launch the Flask server
5. Auto-open `http://localhost:5000` in your browser

### Option B — Manual (Any OS)

```bash
# 1. Clone the repository
git clone https://github.com/jigarnakarani/Nutrition-Agentic-AI-.git
cd Nutrition-Agentic-AI-

# 2. Create & activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Configure API key (optional — app works in Demo Mode without it)
cp .env.example .env
# Edit .env and add your IBM watsonx.ai credentials

# 5. Run the application
python app.py

# 6. Open in browser
# http://localhost:5000
```

---

## ⚙️ Configuration

### IBM watsonx.ai Setup (Full AI Mode)

1. Create a free IBM Cloud account: https://cloud.ibm.com/registration
2. Provision **IBM watsonx.ai**: https://dataplatform.cloud.ibm.com
3. Generate an API key: https://cloud.ibm.com/iam/apikeys
4. Copy your **Project ID** from watsonx.ai dashboard
5. Update your `.env` file:

```env
WATSONX_API_KEY=your_api_key_here
WATSONX_PROJECT_ID=your_project_id_here
WATSONX_URL=https://us-south.ml.cloud.ibm.com
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `WATSONX_API_KEY` | IBM Cloud API key | *(Demo mode if unset)* |
| `WATSONX_PROJECT_ID` | watsonx.ai project ID | *(Demo mode if unset)* |
| `WATSONX_URL` | watsonx.ai endpoint URL | `https://us-south.ml.cloud.ibm.com` |

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore`.

---

## 🟢 Demo Mode

No IBM account? No problem. The app runs fully in **Demo Mode** with built-in nutrition intelligence — same UI, same plan structure, no API key required. A banner in the UI indicates the active mode.

---

## 📁 Project Structure

```
Nutrition-Agentic-AI-/
├── app.py                          # Flask backend + IBM Granite integration
├── requirements.txt                # Python dependencies
├── run.bat                         # Windows one-click launcher
├── .env.example                    # API key template (safe to commit)
├── .gitignore                      # Git ignore rules
├── README.md                       # This file
├── templates/
│   └── index.html                  # Main web interface (3 tabs)
├── static/
│   ├── style.css                   # UI styles (IBM design language)
│   └── app.js                      # Frontend logic (fetch, markdown, chat)
└── plans/                          # Generated .md nutrition plans
    └── sample_nutrition_plan_Priya_Patel.md
```

---

## 🌐 API Reference

| Endpoint | Method | Body | Description |
|----------|--------|------|-------------|
| `/` | GET | — | Serves the web application |
| `/api/generate-plan` | POST | JSON user profile | Generate personalised nutrition plan |
| `/api/chat` | POST | `{ question, user_context }` | Chat with NutriBot AI |
| `/api/download/<filename>` | GET | — | Download saved `.md` plan |
| `/api/health` | GET | — | Server health + model status |

### Example: Generate Plan

```bash
curl -X POST http://localhost:5000/api/generate-plan \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Arjun Sharma",
    "age": "32",
    "diet": "Vegetarian",
    "city": "Mumbai",
    "country": "India",
    "medical_history": "Diabetes",
    "goal": "diabetes management",
    "activity": "moderate"
  }'
```

### Example: Chat

```bash
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "What foods help manage blood sugar?"}'
```

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    NutriBot AI — Architecture                │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Browser (HTML + CSS + JS)                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │ Plan Tab │  │ Chat Tab │  │ About Tab│                   │
│  └────┬─────┘  └────┬─────┘  └──────────┘                  │
│       │              │                                      │
│       └──────┬───────┘  Fetch API calls                     │
│              ▼                                              │
│  ┌─────────────────────────────────────┐                    │
│  │        Flask Backend (app.py)        │                   │
│  │  ┌─────────────┐ ┌───────────────┐  │                   │
│  │  │  Guardrails │ │ Ethics Layer  │  │                   │
│  │  └──────┬──────┘ └───────────────┘  │                   │
│  │         │                           │                   │
│  │  ┌──────▼──────────────────────┐    │                   │
│  │  │   IBM Granite LLM Agent     │    │                   │
│  │  │   (granite-13b-instruct-v2) │    │                   │
│  │  │   via IBM watsonx.ai        │    │                   │
│  │  └──────────────────────────── ┘    │                   │
│  │                                     │                   │
│  │  ┌──────────────────────────────┐   │                   │
│  │  │  .md File Export  │  Plans/  │   │                   │
│  │  └──────────────────────────────┘   │                   │
│  └─────────────────────────────────────┘                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🛡️ AI Ethics & Guardrails

NutriBot AI implements **IBM's five AI Ethics Principles**:

| Principle | Implementation |
|-----------|---------------|
| **Transparency** | Model name & mode displayed on every response |
| **Fairness** | Inclusive language, supports all diet types, no body-shaming |
| **Robustness** | Input validation + harmful keyword filter (12 categories) |
| **Privacy** | No user data stored beyond the session; `.env` excluded from git |
| **Accountability** | Medical disclaimer on every plan, AI limitations stated |

### HAM Framework
- **H**elpful — Evidence-based, actionable guidance
- **A**ccountable — Defers medical decisions to professionals
- **M**indful — Respects cultural, religious, and personal preferences

### Harmful Content Guardrails
The following content categories are automatically blocked:
`suicide · self-harm · overdose · dangerous diet · extreme fasting · starvation diet · illegal supplements` and more.

---

## ⚠️ Medical Disclaimer

> This application generates AI-powered nutrition information for **educational and informational purposes only**. It does **NOT** constitute medical advice and should **not** replace consultation with a qualified healthcare professional, registered dietitian, or licensed nutritionist.
>
> Always consult a doctor before making significant dietary changes — especially if you have a diagnosed medical condition, are on medication, or are pregnant/breastfeeding.

---

## 🔧 Tech Stack

| Layer | Technology |
|-------|-----------|
| AI Model | IBM Granite 13B Instruct v2 |
| AI Platform | IBM watsonx.ai |
| Backend | Python 3.11+ / Flask 3.0 |
| CORS | Flask-CORS |
| Config | python-dotenv |
| Frontend | HTML5 / CSS3 / Vanilla JS |
| Markdown | Marked.js (CDN) |
| Icons | Font Awesome 6 (CDN) |
| Fonts | Inter via Google Fonts |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m "Add your feature"`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see [LICENSE](LICENSE) for details.

---

<div align="center">

🥗 **NutriBot AI** — Built with ❤️ using IBM Granite LLM & IBM watsonx.ai

*Powered by IBM AI Ethics Principles | Agentic AI SDLC*

</div>
