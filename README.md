# 🛍️ SABLE & APBOT — FINAL SUBMISSION README

---

## 📌 PROJECT OVERVIEW
**SABLE** is a premier luxury fashion e-commerce web application featuring **ApBot** — a state-of-the-art multimodal AI shopping assistant. ApBot is powered by a custom **TensorFlow / Keras Deep Neural Network** (trained over 200 epochs), real-time **MongoDB** integration, **Voice Speech Dictation & Audio Read-Aloud (TTS)**, **Visual AI Photo Search**, and an interactive **AI Outfit Ensemble Builder**.

---

## 🏛️ SYSTEM ARCHITECTURE
```
[React Frontend (Port 3000)]
         │
         ▼ (HTTP POST /api/apbot/message)
[Node.js Express Server (Port 5000)]
         │
         ├──────────────────────────┐
         ▼ (HTTP POST /predict)     ▼
[Python Flask AI Service (Port 5001)] [MongoDB Database (Port 27017)]
  ├── NLTK Tokenizer & Lemmatizer      ├── Products
  ├── Bag of Words Encoder             ├── Users
  └── Keras Model (chatbot_model.keras)└── Orders
```

---

## 🌟 CORE FEATURES
- **🧠 200 Epochs Deep Learning NLP Model**: Intent classification across 40+ intent tags with >95% accuracy.
- **🛍️ Live MongoDB Integration**: Zero hallucinated data — retrieves actual product specs, materials (280gsm cotton), sizes, prices, and stock.
- **🎨 AI Outfit Builder ("Complete The Look")**: 3-piece curated ensemble generator with single-click bag addition.
- **📏 AI Size & Fit Recommendation**: Height/weight calculator & interactive in-chat size form.
- **📸 Visual AI Photo Search**: Plus (`+`) button photo scanner against inventory.
- **🎙️ Real-Time Voice Mic & Audio TTS**: Speech-to-text live stream dictation + text-to-speech voice read-aloud toggle.
- **📦 10-Minute Dynamic Order Tracking**: Live tracking timeline (`Order Placed ➔ Processing ➔ Shipped ➔ Delivered`).
- **💎 VIP Discount Concierge**: Single-click promo code unlock (`SABLE-VIP15`).
- **🛡️ Bulletproof Fallback**: Graceful boundary handling for unsupported queries and Python service fail-safe proxy.

---

## 🎓 ACADEMIC SCOPE & DEMONSTRATION DISCLOSURE
This project is primarily an academic AI/ML research demonstration focused on NLP intent classification, dialogue management, and custom TensorFlow/Keras + NLTK model architecture:
- **Payment & Checkout**: Mock/demo checkout flow (no real payment gateway or card processing). No raw card numbers or sensitive financial data are collected.
- **Visual Search**: Filename & keyword-assisted catalog matching demonstration.
- **Order Tracking**: Local time-based status simulation (no live courier integration).
- **Size Recommendation**: Heuristic body-measurement mapping calculator.
- **Outfit Selection**: Rule-based ensemble recommendation engine.
- **Enterprise Integrations**: Full payment gateways, real-time inventory management, courier APIs, and production e-commerce infrastructure are outside the core AI/ML SRS scope.

---

## ⚙️ SYSTEM REQUIREMENTS & PREREQUISITES
- **Node.js**: `v18.0.0` or `v20.0.0+`
- **Python**: `3.10+`
- **MongoDB**: Installed locally on `mongodb://localhost:27017` or Atlas URI
- **Git**: Installed

---

## 🚀 INSTALLATION & SETUP INSTRUCTIONS

### 1. Clone Repository
```bash
git clone https://github.com/MujtabaZadaii/APBOT_E-commerce.git
cd APBOT_E-commerce
```

### 2. Node.js Backend & Frontend Setup
```bash
# Install root & server dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Python Virtual Environment & ML Setup
```bash
# Navigate to apbot directory
cd apbot

# Create and activate virtual environment
python -m venv venv

# Windows Activation:
.\venv\Scripts\activate

# macOS/Linux Activation:
source venv/bin/activate

# Install Python ML requirements
pip install -r requirements.txt
cd ..
```

### 4. Train TensorFlow Model
```bash
python apbot/train.py
```
*Output: Model saved to `apbot/model/chatbot_model.keras` over 200 epochs.*

### 5. Seed MongoDB Database
```bash
node server/seed.js
```
*Output: Products seeded into local MongoDB database `sable`.*

---

## 🏃 RUNNING THE APPLICATION

Start the 3 microservices in 3 separate terminal windows:

#### Terminal 1: Python Flask AI Service (Port 5001)
```bash
python apbot/app.py
```

#### Terminal 2: Node.js Express Backend (Port 5000)
```bash
node server/server.js
```

#### Terminal 3: Vite React Frontend (Port 3000)
```bash
npm --prefix client run dev
```

Open browser at `http://localhost:3000` to interact with SABLE & ApBot!

---

## 🧪 TESTING & VERIFICATION
Run the automated conversational test suite against the live services:
```bash
node scratch/test_conversations.js
```

---

## 📂 PROJECT STRUCTURE
```text
.
├── apbot/                      # Python Flask AI & ML Microservice
│   ├── app.py                  # Flask REST API (Port 5001)
│   ├── train.py                # TensorFlow/Keras Model Trainer (200 Epochs)
│   ├── chatbot/                # NLTK Tokenizer & Predictor
│   ├── data/intents.json       # Dataset with 40+ intent classes
│   └── model/                  # chatbot_model.keras & pickled vocabulary
├── client/                     # Vite React Frontend App
│   ├── src/components/ApBot.jsx# ApBot Interface & Voice/Visual UI
│   └── src/App.jsx             # Main Application Routing & State
├── server/                     # Node.js Express Backend
│   ├── server.js               # Express Server Port 5000
│   ├── routes/apbotRoutes.js   # Intent Resolver & MongoDB Query Engine
│   └── models/                 # Mongoose Product, User, Order Schemas
├── submission/                 # Academic Submission Documentation Folder
│   ├── Project_Report.md
│   ├── Test_Cases.md
│   ├── System_Architecture.md
│   ├── ApBot_Dialog_Flow.md
│   ├── README.md
│   └── Assumptions.md
├── LICENSE                     # MIT Open Source License
└── README.md                   # Root Project README
```

---

## 🔗 GITHUB INFORMATION
- **Repository URL**: [https://github.com/MujtabaZadaii/APBOT_E-commerce](https://github.com/MujtabaZadaii/APBOT_E-commerce)
- **Author**: Mujtaba Zadaii
- **License**: MIT License
