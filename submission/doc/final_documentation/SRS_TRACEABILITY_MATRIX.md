# ApBot SRS Traceability Matrix

**Repository:** https://github.com/MujtabaZadaii/APBOT_E-commerce  
**Audited commit:** `6a490eefafd2c64f11d37ceea0aa23bbaaf0217f`  
**Source SRS:** User-provided `AI&MachineLearningManiaSRS.pdf`

## Functional traceability

| ID | SRS requirement | Evidence in repository | Status | Notes |
|---|---|---|---:|---|
| FR-01 | Pattern matching with intents, patterns, and responses | `apbot/data/intents.json`, `apbot/chatbot/nlp.py` | Implemented | Dataset and preprocessing are committed. |
| FR-02 | NLU identifies intent, entities/context, and expected response | `apbot/chatbot/predictor.py`, `server/routes/apbotRoutes.js` | Partial | Intent is model-based; entities and context are mainly deterministic rules. |
| FR-03 | NLP tokenization and word vectorization | NLTK tokenizer/lemmatizer and binary Bag-of-Words | Implemented | Training and runtime artifacts exist. |
| FR-04 | TensorFlow/Keras model | `apbot/train.py`, `apbot/model/chatbot_model.keras` | Implemented | Dense/Dropout/Softmax model trained for 200 epochs. |
| FR-05 | Website chatbot interface | `client/src/components/ApBot.jsx` | Implemented | Text, product cards, forms, mic, TTS, and image-picker UI exist. |
| FR-06 | REST API integration | Flask `/api/apbot/predict`; Express `/api/apbot/message` | Implemented | Express orchestrates AI and MongoDB. |
| FR-07 | Product information and similar alternatives | Product queries in `apbotRoutes.js` | Implemented | MongoDB-backed filtering and category-based similarity. |
| FR-08 | Order tracking | Order lookup and elapsed-time status calculation | Partial | Local simulation; no carrier integration. |
| FR-09 | FAQ/common issue assistance | Intent dataset and hardcoded support responses | Implemented | Suitable for stated academic scope. |
| FR-10 | Checkout redirection | Checkout action, address/payment forms, Order creation | Partial | Payment is simulated; no payment gateway is called. |
| FR-11 | Jupyter/Colab source deliverable | `apbot/notebooks/ApBot_Training.ipynb` | Implemented | Notebook is present. |
| FR-12 | Public GitHub access | Public repository | Implemented | Repository is accessible. |

## Non-functional traceability

| ID | SRS requirement | Evidence | Status | Notes |
|---|---|---|---:|---|
| NFR-01 | Browser compatibility | React/Vite client; Web Speech feature detection | Partial | Voice support remains browser-dependent. |
| NFR-02 | Security | JWT, bcrypt, protected route middleware | Partial | Default secret, broad CORS, missing admin guards, and validation gaps remain. |
| NFR-03 | User experience | Responsive UI, animations, loading/fallback states | Implemented at prototype level | Production UX testing is still required. |
| NFR-04 | Performance | Trained local model and lightweight API flow | Not independently verified | The repository’s `<150ms` claim lacks a reproducible benchmark. |
| NFR-05 | Reliability | Python fetch fallback in ApBot route | Partial | DB connection failure exits the process; no backup or monitoring is documented. |
| NFR-06 | Concurrent users | Decoupled services | Not verified | Load testing and capacity measurements are absent. |

## Blocking implementation gaps

1. Add `onOpenOrders` and `onClearCart` to the `ApBot` props destructuring.
2. Replace the undefined `setActiveCartItems` reference in `App.jsx` with a real active-cart clearing handler.
3. Add a genuine test runner and fixtures; the README references `scratch/test_conversations.js`, but that file is absent from the audited repository.
4. Label checkout as a simulation or integrate a payment provider in test mode. Never treat a browser card form as secure payment processing.
5. Rename or rebuild visual search. The current flow sends the selected filename as text and performs keyword matching, not image analysis.
6. Persist issue reports through a backend API and database collection.
7. Require production secrets through environment configuration, add role-based admin authorization, and harden validation/rate limits.
