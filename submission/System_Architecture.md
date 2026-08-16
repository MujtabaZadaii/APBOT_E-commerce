# SABLE & APBOT — SYSTEM ARCHITECTURE DIAGRAM & DATA FLOW

---

## 🏛️ SYSTEM ARCHITECTURE DIAGRAM

```mermaid
graph TD
    User([👤 User / Customer])

    subgraph Frontend_Layer ["Frontend Layer (Vite React - Port 3000)"]
        ReactApp[App.jsx - Main Application State]
        ApBotUI[ApBot.jsx - Chat Interface Panel]
        VoiceModule[Web Speech API - Mic Dictation & TTS]
        ImageModule[Visual Image Upload Component]
    end

    subgraph Backend_Layer ["Backend Layer (Node.js Express - Port 5000)"]
        ExpressServer[server.js - Express Router]
        AuthMiddleware[authMiddleware.js - JWT Verification]
        ApBotRouter[apbotRoutes.js - Context & Intent Resolver]
        NodeNLPFallback[Node Regex Intent Fallback Engine]
    end

    subgraph AI_Layer ["AI / ML Intelligence Microservice (Python Flask - Port 5001)"]
        FlaskServer[app.py - Flask REST API]
        Predictor[ApBotPredictor Engine]
        NLTKPipeline[NLTK Tokenizer & Lemmatizer]
        BoWEncoder[Bag of Words Encoder]
        KerasModel[(chatbot_model.keras - 200 Epochs Deep Neural Network)]
    end

    subgraph Database_Layer ["Database Layer (MongoDB - Port 27017)"]
        MongoDB[(MongoDB Database)]
        ProductsColl[(Product Collection)]
        UsersColl[(User Collection)]
        OrdersColl[(Order Collection)]
    end

    %% User Interactions
    User -->|Voice / Text / Image Input| ApBotUI
    ApBotUI --> VoiceModule
    ApBotUI --> ImageModule
    ApBotUI -->|HTTP POST /api/apbot/message| ExpressServer

    %% Express Server Processing
    ExpressServer --> AuthMiddleware
    AuthMiddleware --> ApBotRouter
    ApBotRouter -->|HTTP POST /api/apbot/predict| FlaskServer

    %% Flask ML Processing
    FlaskServer --> Predictor
    Predictor --> NLTKPipeline
    NLTKPipeline --> BoWEncoder
    BoWEncoder --> KerasModel
    KerasModel -->|Return Intent Tag & Confidence| FlaskServer
    FlaskServer -->|JSON Response| ApBotRouter

    %% Fail-safe Fallback
    FlaskServer -.->|If Offline / Failed| NodeNLPFallback
    NodeNLPFallback -.->|Fallback Intent| ApBotRouter

    %% Database Operations
    ApBotRouter -->|Find Products by Category/Color/Price| ProductsColl
    ApBotRouter -->|Validate User JWT & Session| UsersColl
    ApBotRouter -->|Create & Track Orders| OrdersColl
    ProductsColl --> MongoDB
    UsersColl --> MongoDB
    OrdersColl --> MongoDB

    %% Response Path
    ApBotRouter -->|Format Payload & Action Array| ReactApp
    ReactApp -->|UI Render Cards, TTS Audio & Badges| User
```

---

## 🔄 DATA FLOW SEQUENCE

1. **Input Stage**: The user enters a natural text message, dictates via speech microphone, or uploads an image.
2. **Client Dispatch**: `ApBot.jsx` sends a `POST /api/apbot/message` request to the Node.js backend (Port 5000) containing the `message`, `JWT Authorization Header`, and current `conversationContext` (e.g. `lastProducts`, `cartItems`).
3. **Intent Classification**: Express forwards the message text to the Python Flask AI service (Port 5001) via `POST /api/apbot/predict`.
4. **Deep Learning Inference**: Python executes `nltk.word_tokenize`, lemmatization, and Bag of Words encoding. The input vector is passed through `chatbot_model.keras` to output predicted intent tag and confidence score.
5. **Contextual Resolution & DB Querying**: Node.js receives the predicted intent. If the query references specific products (*"the first one"*), previous context filters are applied. Node queries MongoDB collections (`Product`, `User`, `Order`) for real data.
6. **Action Dispatch**: Node packages the response message and an array of front-end action triggers (`add_to_cart`, `wishlist_add`, `open_checkout`, `navigate`, `login`).
7. **UI Mutation & Speech Output**: React receives the payload, executes local state updates (cart, wishlist, modals), and if TTS is toggled on, speaks the assistant response.
