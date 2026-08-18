# APBOT_E-commerce — Implementation Audit Memo

**Audit date:** 18 August 2026  
**Repository commit:** `6a490eefafd2c64f11d37ceea0aa23bbaaf0217f`  
**Repository:** https://github.com/MujtabaZadaii/APBOT_E-commerce

## Executive verdict

The repository is a **substantial academic prototype**, not a fully production-ready commerce platform. The core SRS chatbot objective is implemented: the project contains a React website, Node/Express orchestration API, Python/Flask TensorFlow service, NLTK/Bag-of-Words processing, a trained Keras model, MongoDB schemas, seed scripts, a Jupyter notebook, and submission documentation.

The repository’s frontend production build passed, and Node/Python syntax checks passed. The current implementation should be presented accurately as a **TensorFlow/Keras intent-classification assistant with deterministic commerce workflows**.

## Verified checks

| Check | Result |
|---|---:|
| Public GitHub repository accessible | PASS |
| Tracked project files inspected | PASS; 116 tracked files at audited commit |
| Keras model artifacts present | PASS; `.keras`, `words.pkl`, and `classes.pkl` |
| Jupyter notebook present | PASS |
| Frontend `npm run build` | PASS |
| Backend JavaScript syntax checks | PASS |
| Python compilation checks | PASS |
| Existing 24-case test matrix | Documented, but not independently reproducible because referenced `scratch/test_conversations.js` is absent |

## Major findings

| Severity | Finding | Consequence |
|---|---|---|
| High | `ApBot.jsx` references `onOpenOrders` and `onClearCart` without destructuring them in the component props | Relevant chatbot actions can fail at runtime |
| High | `App.jsx` passes an undefined `setActiveCartItems` callback | Clear-cart action is broken in the current wiring |
| High | Payment UI sends only a “card ending” string and creates an order | No actual payment gateway or authorization exists |
| High | Image upload is converted to a filename text query | Visual search is not image understanding or embedding search |
| High | Issue report generates a client-only random reference number | No persistent ticket or support notification is created |
| High | Default JWT secret exists in source and DB helper exits on Mongo failure | Production security and availability are insufficient |
| Medium | Size recommendation is mainly weight-based; height is parsed but not used | Recommendation is heuristic, not a validated fit model |
| Medium | Outfit builder selects the first three products | It is deterministic selection, not personalized AI styling |
| Medium | Order tracking uses elapsed time from `createdAt` | It is simulated tracking, not live carrier tracking |
| Medium | Admin authorization is not explicit on product creation/status update routes | Unauthorized mutations may be possible |
| Medium | API URLs are hardcoded to localhost | Deployment requires configuration refactor |

## Recommended claim language

Use the following wording in the academic report:

> “ApBot is a TensorFlow/Keras intent-classification e-commerce assistant. It uses NLTK preprocessing and Bag-of-Words vectors for intent prediction, while deterministic Node.js business rules resolve product search, conversational context, cart actions, checkout simulation, and local order tracking.”

Avoid claiming real visual AI search, real payment processing, live DHL tracking, persistent issue tickets, or production-grade security until the corresponding integrations are implemented and tested.
