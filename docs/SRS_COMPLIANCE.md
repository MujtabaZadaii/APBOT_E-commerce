# SRS Compliance Matrix

This document maps the Software Requirements Specification (SRS) for the ApBot integration to the implemented features in the SABLE e-commerce platform.

## Core Machine Learning Requirements

| Requirement | Implementation Details | File / Component |
| :--- | :--- | :--- |
| **Pattern Matching** | Implemented via Bag of Words array matching | `apbot/chatbot/nlp.py` |
| **`intents.json`** | Comprehensive JSON dataset covering greetings, cart, checkout, tracking, and fallback | `apbot/data/intents.json` |
| **Natural Language Understanding / Intent Detection** | Uses TensorFlow model predictions to categorize intent with confidence scoring | `apbot/chatbot/predictor.py` |
| **Natural Language Processing / Tokenization** | Uses NLTK `word_tokenize` and `WordNetLemmatizer` | `apbot/chatbot/nlp.py` |
| **Word vectorization / Bag of Words** | Implemented as a binary presence vector matching vocabulary size | `apbot/chatbot/nlp.py` |
| **TensorFlow & Keras** | Model built using Keras Sequential API (Dense & Dropout layers) | `apbot/train.py` |
| **Training Notebook** | Jupyter notebook created for demonstration and iterative training | `apbot/notebooks/ApBot_Training.ipynb` |

## Integration Requirements

| Requirement | Implementation Details | File / Component |
| :--- | :--- | :--- |
| **REST API integration** | Flask app running on port 5001 exposing `/api/apbot/predict` | `apbot/app.py` |
| **Website integration** | Express backend orchestrates the request; React frontend renders the floating UI | `server/routes/apbotRoutes.js`, `client/src/components/ApBot.jsx` |
| **Conversation context** | Frontend state tracks `conversationContext` across queries, backend uses this to store `lastProducts` to maintain conversation deterministically. | `client/src/components/ApBot.jsx`, `server/routes/apbotRoutes.js` |
| **Error handling & Fallbacks** | Confidence thresholds (<0.5) and API error catching returning friendly messages | `server/routes/apbotRoutes.js`, `apbot/app.py` |
| **Security Audit / Authentication** | Express API issues JSON Web Tokens (JWT) on login. ApBot route decodes token to authorize order retrieval, view profile, and check login status. | `server/routes/authRoutes.js`, `server/routes/apbotRoutes.js` |
| **Site Navigation Integration** | ApBot triggers frontend callbacks (`onNavigate`, `onOpenCart`, etc.) to directly manipulate site state (e.g. routing to Product Detail page or opening Auth Modals) | `client/src/components/ApBot.jsx`, `client/src/App.jsx` |
| **Database Expansion** | Safe backfill of products in MongoDB using `$set` to add `colour`, `features`, `relatedProducts` without overwriting existing object IDs. | `server/migrateProducts.js`, `server/models/Product.js` |

## Functional Use Cases

| Requirement | Implementation Details | File / Component |
| :--- | :--- | :--- |
| **Product search & assistance** | Queries MongoDB `Product` model via Regex on keywords | `server/routes/apbotRoutes.js` |
| **Similar product suggestions** | Handled seamlessly through keyword extraction | `server/routes/apbotRoutes.js` |
| **Order tracking** | Regex extraction of `SBL-\d+` and lookup in MongoDB `Order` model | `server/routes/apbotRoutes.js` |
| **FAQs & Support** | Hardcoded responses in the model training data | `apbot/data/intents.json` |
| **Site Navigation** | Detects intent to open shop, wishlist, cart, or profile, routing the user directly. | `server/routes/apbotRoutes.js`, `client/src/components/ApBot.jsx` |
| **Checkout assistance** | Guides user through checkout steps if requested via chat or opens existing modal. | `server/routes/apbotRoutes.js`, `client/src/components/ApBot.jsx` |

## User Experience & Performance

| Requirement | Implementation Details | File / Component |
| :--- | :--- | :--- |
| **Good user experience (Awwwards grade)** | Dark mode luxury aesthetics (`--bone`, `--ink`), micro-animations, loading indicators, product cards inside chat. New Product Detail Page with GSAP animations. | `client/src/index.css`, `client/src/components/ApBot.jsx`, `client/src/components/ProductDetail.jsx` |
| **Performance** | Debounced interactions and minimal bundle overhead | React state management |
| **Security** | Python API is isolated. Frontend talks to Express API which handles DB lookups | `server/routes/apbotRoutes.js` |
