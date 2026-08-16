# FINAL IMPLEMENTATION — SABLE + ApBot

You have already created the implementation plan, architecture, README, and SRS compliance matrix for SABLE + ApBot.

Now STOP planning and **perform the actual implementation and verification**.

Your objective is to finish the project completely without breaking any existing SABLE e-commerce functionality.

---

## 1. FIRST — AUDIT THE CURRENT IMPLEMENTATION

Before changing anything, inspect the actual repository.

Verify:

- `client/`
- `server/`
- `apbot/`
- MongoDB models
- authentication
- sessions
- product APIs
- cart APIs
- wishlist
- checkout
- orders
- tracking
- existing UI
- ApBot files
- current environment configuration
- current API routes

Do NOT trust the README or SRS compliance matrix blindly.

The actual source code and runtime behavior are the source of truth.

Create an internal checklist of:

- Already working
- Partially working
- Missing
- Broken
- Security issues
- SRS gaps

Then implement only what is necessary.

---

# 2. DO NOT BREAK SABLE

This is NON-NEGOTIABLE.

Do not:

- rebuild the existing e-commerce system
- replace working components unnecessarily
- remove existing features
- change the existing luxury design without reason
- break authentication
- break cart
- break checkout
- break orders
- break tracking
- break wishlist
- break search

ApBot must be an ADDITION to SABLE.

After every major change, verify that existing functionality still works.

---

# 3. VERIFY THE PYTHON AI SERVICE

Make sure:

```text
apbot/
├── app.py
├── train.py
├── requirements.txt
├── data/
│   └── intents.json
├── chatbot/
│   ├── nlp.py
│   └── predictor.py
├── model/
└── notebooks/
    └── ApBot_Training.ipynb
```

actually works.

Verify:

- Python environment
- dependencies
- NLTK resources
- TensorFlow
- Keras
- model loading
- vocabulary loading
- class loading
- prediction
- confidence score
- Flask API

Test:

```text
POST /api/apbot/predict
```

with real messages.

---

# 4. VERIFY THE ML PIPELINE

The SRS requirements MUST actually be implemented.

Verify:

### NLP

- tokenization
- lemmatization
- text preprocessing

### Vectorization

- Bag of Words

### Machine Learning

- TensorFlow
- Keras
- neural-network classifier

### Dataset

- `intents.json`

### Training

- training script
- Jupyter notebook
- evaluation
- saved model

Do not replace the required SRS ML pipeline with an unrelated LLM.

---

# 5. AUDIT INTENTS.JSON

Make sure the dataset is genuinely comprehensive.

At minimum verify:

### General

- greeting
- goodbye
- thanks
- bot_identity
- help

### Products

- product_search
- product_information
- product_price
- product_availability
- product_recommendation
- similar_products
- category_search
- offers

### Cart

- add_to_cart
- remove_from_cart
- update_cart
- view_cart

### Wishlist

- wishlist_add
- wishlist_remove
- view_wishlist

### Checkout

- checkout
- checkout_help
- payment_help
- delivery_address

### Orders

- order_tracking
- order_status
- delivery_date
- previous_orders
- order_details

### Support

- faq
- complaint
- return_product
- contact_support

### Fallback

- unknown

Each intent must contain enough realistic language variations for useful classification.

Avoid duplicate or meaningless training examples.

---

# 6. FIX CONVERSATION CONTEXT

This is a HIGH PRIORITY requirement.

The bot must understand previous conversation.

Test this exact flow:

```text
User:
Show me black jackets.

Bot:
returns black jackets.

User:
Only under £200.

Bot:
filters the previous search.

User:
Show me the first one.

Bot:
understands the first previous product.

User:
Add it to my bag.

Bot:
adds that exact product to the authenticated user's cart.
```

The bot must maintain a lightweight conversation context.

Do NOT rely only on `userId`.

Context should include relevant information such as:

- previous intent
- previous products
- selected product
- active category
- price constraint
- colour constraint
- tracking context where appropriate

Keep this deterministic and lightweight.

---

# 7. SECURITY AUDIT

This is CRITICAL.

Never trust:

```text
userId
```

sent directly from the frontend.

The backend must determine the authenticated user from the actual authentication/session mechanism already used by SABLE.

Verify authorization for:

- cart
- wishlist
- profile
- order history
- order tracking
- checkout

A user must NEVER be able to use ApBot to retrieve another user's private information.

Test unauthorized requests.

---

# 8. PRODUCT SEARCH

ApBot must use the REAL SABLE MongoDB product catalogue.

Test:

```text
Show me black jackets.
```

```text
Show me jackets under £200.
```

```text
Show me black outerwear under £200.
```

```text
Do you have this in stock?
```

Return real products.

Do NOT hardcode fake products.

Render product cards in the chat containing:

- image
- name
- price
- availability
- View Product
- Add to Bag

---

# 9. PRODUCT RECOMMENDATION

Improve recommendation logic beyond simple keyword matching where practical.

Use available product information such as:

- category
- price
- colour
- availability
- related products
- previous selection/context

Test:

```text
Show me something similar.
```

```text
Something cheaper.
```

```text
Something like this but black.
```

```text
I want something under £150.
```

---

# 10. CART ACTIONS

ApBot must work with the EXISTING SABLE cart system.

Test:

```text
Add this to my bag.
```

```text
Add two of these.
```

```text
Remove this from my bag.
```

```text
What's in my bag?
```

```text
How much is my bag?
```

The backend must use the authenticated user's existing cart.

Do not create a second independent chatbot cart.

---

# 11. WISHLIST

If the existing wishlist is functional, integrate ApBot with it.

Test:

```text
Add this to my wishlist.
```

```text
Remove this from my wishlist.
```

```text
Show my wishlist.
```

Reuse the existing wishlist system.

---

# 12. CHECKOUT

Reuse the existing `CheckoutModal.jsx` and existing checkout logic.

ApBot should support:

```text
Take me to checkout.
```

```text
I want to buy this.
```

```text
Proceed to checkout.
```

The chatbot should trigger the existing checkout flow instead of implementing a duplicate checkout system.

Do NOT expose sensitive payment information to the AI service.

---

# 13. ORDER TRACKING

Reuse the existing order/tracking system.

Test:

```text
Track SBL-12345.
```

```text
Where is my order?
```

```text
When will my order arrive?
```

```text
What is my latest order?
```

The assistant must retrieve real MongoDB-backed information.

Never fabricate:

- tracking IDs
- delivery dates
- order status
- products
- courier information

---

# 14. PUBLIC TRACKING PAGE

Keep the existing tracking page as a simple public tracking experience.

Do NOT create a dashboard.

The user should be able to:

```text
Enter Tracking ID
        ↓
Track
        ↓
Order details
        ↓
Delivery timeline
        ↓
Expected delivery
```

Verify it works independently of ApBot.

---

# 15. APBOT UI

Inspect the existing SABLE visual system and make ApBot look native to SABLE.

It must feel:

- luxury
- editorial
- minimal
- premium
- responsive
- modern

Avoid generic chatbot styling.

The floating assistant should support:

- open/close
- message history
- typing indicator
- loading state
- error state
- retry
- clear conversation
- product cards
- order cards
- cart summaries
- CTA buttons
- mobile layout
- keyboard accessibility

Use existing SABLE typography, spacing, colors, borders, GSAP conventions, and design language.

---

# 16. STRUCTURED CHAT RESPONSES

Do not return only text.

Where appropriate, return structured UI data.

Examples:

Product search:

```text
message
+
products[]
```

Cart:

```text
message
+
cart[]
+
subtotal
+
actions[]
```

Order:

```text
message
+
order
+
tracking
+
status
```

Checkout:

```text
message
+
action: open_checkout
```

The frontend should render the correct UI based on the response type.

---

# 17. UNKNOWN / LOW CONFIDENCE

Implement a safe confidence threshold.

If confidence is too low:

Do NOT guess.

Return something such as:

> I'm here to help with SABLE products, shopping, orders, and support. Could you rephrase that?

Also handle:

- product not found
- order not found
- invalid tracking ID
- out of stock
- unauthenticated action
- backend failure
- AI service unavailable

Never expose stack traces or database errors.

---

# 18. API ARCHITECTURE

Maintain:

```text
React
 ↓
Express
 ↓
Python AI Service
 ↓
Intent
 ↓
Express Action Layer
 ↓
Existing SABLE Services
 ↓
MongoDB
```

Do NOT allow Python AI service to directly mutate MongoDB.

Business actions should be controlled by the Express backend.

---

# 19. TESTING

Create real tests.

At minimum test:

### ML

- greeting
- product search
- recommendation
- cart intent
- order tracking
- checkout
- unknown intent

### Product

- keyword search
- price filtering
- category filtering
- availability

### Cart

- add
- remove
- quantity
- view

### Orders

- valid tracking
- invalid tracking
- authenticated order history
- unauthorized access

### Context

```text
black jackets
→ under £200
→ first one
→ add it
```

### UI

- desktop
- tablet
- mobile
- keyboard
- error states
- loading states

---

# 20. RUN THE COMPLETE STACK

Verify all three services together:

### Express

```bash
cd server
npm start
```

### React

```bash
cd client
npm run dev
```

### ApBot

```bash
cd apbot
venv\Scripts\activate
python app.py
```

Verify there are no:

- console errors
- failed API requests
- CORS problems
- model loading errors
- missing NLTK resources
- broken imports
- broken routes

---

# 21. PRODUCTION BUILD

Run:

```bash
cd client
npm run build
```

The production build must succeed.

Also verify the backend and Python service start cleanly.

---

# 22. SRS COMPLIANCE AUDIT

After implementation, compare the actual project against every SRS requirement.

Update:

```text
docs/SRS_COMPLIANCE.md
```

Do NOT mark something as implemented unless it has been verified.

For every requirement provide:

- Requirement
- Implementation
- File/component
- Verification/test

---

# 23. README

Update README with accurate instructions.

Include:

- architecture
- prerequisites
- installation
- Node server
- React server
- Python service
- model training
- notebook
- environment variables
- API
- testing
- demo flow
- limitations
- SRS compliance

Do not document commands that do not actually work.

---

# 24. DEMO FLOW

The final demo MUST support:

```text
Open SABLE
↓
Login
↓
Open ApBot
↓
"Show me black jackets under £200."
↓
Real product cards
↓
"Show me something similar."
↓
Recommendation
↓
"Add the first one to my bag."
↓
Real cart update
↓
"What's in my bag?"
↓
Cart summary
↓
"Take me to checkout."
↓
Existing checkout
↓
Place order
↓
Tracking ID generated
↓
Open public tracking page
↓
Track order
↓
Return to ApBot
↓
"Where is my order?"
↓
Real order status
```

This entire flow must work without manual developer intervention.

---

# 25. FINAL QUALITY CHECK

Before saying "complete", verify:

- Existing SABLE works.
- Authentication works.
- Products work.
- Search works.
- Cart works.
- Wishlist works.
- Checkout works.
- Orders work.
- Tracking works.
- ApBot works.
- ML model works.
- NLTK works.
- TensorFlow/Keras works.
- REST API works.
- Product search works.
- Recommendations work.
- Cart actions work.
- Checkout action works.
- Order tracking works.
- Conversation context works.
- Security works.
- Mobile UI works.
- Production build works.
- Notebook works.
- Tests work.
- Documentation is accurate.
- SRS compliance matrix is accurate.

---

# FINAL INSTRUCTION

Do not stop after creating files.

Do not stop after compiling.

Do not stop after the chatbot opens.

**Actually test the complete user journey.**

If something is broken, diagnose it and fix it.

If an existing SABLE feature breaks, restore it before continuing.

If an SRS requirement is missing, implement it.

If a requirement cannot be implemented without changing an existing architecture, choose the smallest safe architectural change.

Do not ask unnecessary questions when the repository already contains the answer.

Inspect first.

Implement second.

Test third.

Fix fourth.

Document last.

Only report completion after the complete system has been verified.
