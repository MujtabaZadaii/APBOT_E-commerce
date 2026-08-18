<p align="center">
  <img src="assets/readme/hero.svg" alt="SABLE ApBot Hero Banner" width="100%">
</p>

<p align="center">
  <a href="https://github.com/MujtabaZadaii/APBOT_E-commerce"><img src="https://img.shields.io/badge/GitHub-APBOT__E--commerce-101010?style=for-the-badge&logo=github&logoColor=white" alt="GitHub Repo"></a>
  <a href="https://colab.research.google.com/github/MujtabaZadaii/APBOT_E-commerce/blob/main/apbot/notebooks/ApBot_Training.ipynb"><img src="https://img.shields.io/badge/Google_Colab-Open_Notebook-F97316?style=for-the-badge&logo=googlecolab&logoColor=white" alt="Google Colab"></a>
  <a href="https://tensorflow.org"><img src="https://img.shields.io/badge/TensorFlow-2.15-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow"></a>
  <a href="https://nodejs.org"><img src="https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"></a>
  <a href="https://react.dev"><img src="https://img.shields.io/badge/React-v18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"></a>
</p>

---

## 📌 EXECUTIVE SUMMARY & PROJECT PROOF

**SABLE Haute Couture** is an academic luxury e-commerce web application featuring **ApBot** — a 24/24 multimodal AI shopping concierge powered by a custom **TensorFlow/Keras Deep Learning Neural Network** (trained over 200 epochs).

ApBot combines **Natural Language Processing (NLP)**, **Domain-Aware Typo Correction**, **NLTK Tokenization & Lemmatization**, and **Bag-of-Words Vectorization** with real-time **MongoDB** product queries.

---

## 🏛️ SYSTEM ARCHITECTURE & DATA FLOW

```text
[ React 18 Frontend (Port 3000) ]
            │
            ▼ (HTTP POST /api/apbot/message)
[ Node.js / Express Server (Port 5000) ] ── (JWT Verification / Auth / Admin Check)
            │
            ├───────────────────────────────────────────┐
            ▼ (HTTP POST /api/apbot/predict)            ▼
[ Python Flask AI Microservice (Port 5001) ]   [ MongoDB Database (Port 27017) ]
  ├── DomainSpellCorrector (Typo Normalization)  ├── Products Collection
  ├── NLTK Tokenizer & Lemmatizer                ├── Users Collection (JWT Roles)
  ├── Bag-of-Words Vectorizer                    └── Orders Collection
  └── Keras Model (chatbot_model.keras - 200 Epochs)
```

---

## 🌟 KEY TECHNICAL HIGHLIGHTS

- **🧠 200-Epoch Deep Learning Model**: Custom TensorFlow/Keras neural network classifying across 40+ intent tags with >91% validation accuracy.
- **🔤 Domain-Aware NLP Typo Correction**: `DomainSpellCorrector` normalizes user typos (`blak` ➔ `black`, `shrit` ➔ `shirt`, `whre` ➔ `where`) while preserving prices (`£200`), order IDs (`SBL-12345`), and brand terminology (`SABLE`).
- **🛍️ Live MongoDB Catalog Queries**: Zero hallucinated products — retrieves real items with actual materials (e.g., 280gsm combed cotton), sizes, stock, and prices.
- **✨ New Arrivals Engine**: Queries latest luxury releases sorted by `createdAt: -1` with `NEW ARRIVAL` badges.
- **🛡️ Hardened Security**: `verifyToken` enforces JWT ownership for wishlist queries (`req.user.email`), and admin role verification protects order status mutations (`PUT /update-status`).
- **💳 Sanitized Demo Checkout**: Complete demo checkout workflow with zero collection or storage of raw card numbers, CVV, or expiry dates.

---

## 🎓 ACADEMIC SCOPE & DEMONSTRATION DISCLOSURE

This repository is designed as an **Academic AI/ML SRS Demonstration**:
- **Payment & Checkout**: Mock/demo checkout flow (no real payment gateway processing).
- **Visual Search**: Catalog filename & keyword-assisted matching demonstration.
- **Order Tracking**: Local time-based status simulation (`Order Placed ➔ Processing ➔ Shipped ➔ Delivered`).
- **Size Recommendation**: Heuristic body-measurement mapping calculator.
- **Outfit Selection**: Rule-based ensemble recommendation engine.

---

## 🧪 COMPREHENSIVE EVALUATION & TESTING SUITE

The repository includes a multi-tiered evaluation and testing suite:

### 1. NLP Typo Correction Unit Test Suite (`python apbot/test_spelling.py`)
- **Executable Scenarios**: 16
- **Test Result**: **`16 / 16 PASSED`**
- **Command**: `python apbot/test_spelling.py`

### 2. Automated TC-13 Python Service Fallback Test (`node server/test_tc13_fallback.js`)
- **Executable Scenarios**: 1 (Python AI Microservice Fallback Recovery)
- **Test Result**: **`PASS`** (HTTP `200 OK` fallback response verified when Flask API is offline)
- **Command**: `npm run test:tc13` / `node server/test_tc13_fallback.js`

### 3. Documented Conversational Matrix (`submission/Test_Cases.md`)
- **Documented Scenarios**: 24 Functional & Conversational Scenarios (Greetings, product filtering, context indexing, wishlist JWT ownership, order status, and boundary fallbacks).

---

## ⚡ QUICK START & RUNNING LOCALLY

### 1. Clone Repository
```bash
git clone https://github.com/MujtabaZadaii/APBOT_E-commerce.git
cd APBOT_E-commerce
```

### 2. Python Flask AI Microservice (Port 5001)
```bash
cd apbot
python -m venv venv

# Windows Activation:
.\venv\Scripts\activate

# macOS/Linux Activation:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```

### 3. Node.js Express Backend Server (Port 5000)
```bash
# Open a new terminal tab
cd server
npm install
node server.js
```

### 4. Vite React Frontend Client (Port 3000)
```bash
# Open a new terminal tab
cd client
npm install
npm run dev
```

---

## ☁️ GOOGLE COLAB NOTEBOOK ACCESS

Run and retrain the model directly in Google Colab with single-click GitHub synchronization:
- **Jupyter Notebook File**: [`apbot/notebooks/ApBot_Training.ipynb`](apbot/notebooks/ApBot_Training.ipynb)
- **Direct Colab Link**: [Open in Google Colab](https://colab.research.google.com/github/MujtabaZadaii/APBOT_E-commerce/blob/main/apbot/notebooks/ApBot_Training.ipynb)

---

## 📄 SUBMISSION DOCUMENTATION PACK

- **Implementation Audit**: [`submission/doc/final_documentation/IMPLEMENTATION_AUDIT.md`](submission/doc/final_documentation/IMPLEMENTATION_AUDIT.md)
- **SRS Traceability Matrix**: [`submission/doc/final_documentation/SRS_TRACEABILITY_MATRIX.md`](submission/doc/final_documentation/SRS_TRACEABILITY_MATRIX.md)
- **Complete Master Report**: [`submission/doc/final_documentation/APBOT_COMPLETE_PROJECT_DOCUMENTATION.md`](submission/doc/final_documentation/APBOT_COMPLETE_PROJECT_DOCUMENTATION.md)
- **Dialog Flow Specification**: [`submission/ApBot_Dialog_Flow.md`](submission/ApBot_Dialog_Flow.md)
