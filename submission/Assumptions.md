# SABLE & APBOT — SYSTEM ASSUMPTIONS & DESIGN BOUNDARIES

---

## 📌 EMPIRICAL ASSUMPTIONS & TECHNICAL CONSTRAINTS

This document details the exact technical assumptions and operational boundaries of the **SABLE E-Commerce & ApBot AI Assistant** system based strictly on the actual implementation.

---

### 1. ENVIRONMENT & INFRASTRUCTURE ASSUMPTIONS
- **Local Development Ports**:
  - Frontend (Vite React): Runs on `http://localhost:3000`
  - Backend API (Node.js Express): Runs on `http://localhost:5000`
  - AI Microservice (Python Flask): Runs on `http://localhost:5001`
  - Database (MongoDB): Running locally on `mongodb://localhost:27017/sable` or connected via `MONGO_URI`.
- **Operating System**: Cross-platform compatible (Windows 10/11, macOS, Linux).
- **Node Environment**: Node.js `v18.0.0` or `v20.0.0+`.
- **Python Environment**: Python `3.10+` with Virtual Environment (`venv`) activated.

---

### 2. DATABASE & DATA INTEGRITY ASSUMPTIONS
- **Source of Truth**: All product data (names, prices, categories, images, materials, sizes, craftsmanship details) are retrieved live from the MongoDB `Product` collection.
- **No Hallucination**: ApBot never fabricates non-existent products, prices, or orders. If a queried item is not in stock or unavailable in MongoDB, ApBot explicitly informs the user.
- **Default Seed Data**: 8 premier SABLE products (Outerwear, Knitwear, Tailoring, Archive) exist in MongoDB upon running database seed scripts (`node server/seed.js`).

---

### 3. AI / ML MODEL ASSUMPTIONS
- **Model Storage**: Trained model artifact resides at `apbot/model/chatbot_model.keras` alongside pickled vocabulary (`words.pkl`) and class labels (`classes.pkl`).
- **Confidence Threshold**: Intent predictions with confidence score `< 0.50` or tag `'unknown'` trigger the SABLE conversational fallback handler.
- **Fail-Safe Mechanism**: If the Python Flask AI service (Port 5001) is offline or unavailable, the Express backend falls back to its embedded Node NLP regex pattern matcher without crashing the user interface.

---

### 4. MULTIMODAL & BROWSER ASSUMPTIONS
- **Voice Speech Recognition**: Speech-to-text dictation utilizes the Web Speech API (`window.webkitSpeechRecognition` or `window.SpeechRecognition`). If unsupported by the browser (e.g. legacy browsers), the mic button falls back to text typing.
- **Text-to-Speech (TTS)**: Voice read-aloud uses standard `window.speechSynthesis`.
- **Visual Photo Search**: Uploading an image via the `+` button scans image metadata against MongoDB product names and categories.

---

### 5. SECURITY & USER AUTHENTICATION ASSUMPTIONS
- **JWT Authentication**: User sessions are authenticated using JSON Web Tokens passed via `Authorization: Bearer <token>` HTTP headers.
- **Protected Routes**: Profile viewing, order history access, and order placement require valid user authentication. Guest users attempting protected routes are prompted with the Auth Sign-In Modal.
- **Password Hashing**: User passwords are stored using `bcryptjs` salted hashes (10 rounds).
- **Environment Secrets**: Sensitive keys (`JWT_SECRET`, database URIs) are loaded from `.env` files and strictly excluded from git tracking via `.gitignore`.
