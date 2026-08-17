I want you to improve and finalize my EXISTING SABLE + ApBot project.

IMPORTANT:
This is my existing project.
DO NOT rebuild it.
DO NOT create a new project.
DO NOT replace the architecture.
DO NOT remove working features.
DO NOT redesign unrelated parts.

First inspect the ENTIRE CURRENT PROJECT and understand how everything is connected.

The goal is:

MAKE THE EXISTING PROJECT SRS-COMPLIANT, SECURE, CONSISTENT, AND COMPETITION-READY.

You must work with the files and code that already exist in this workspace.

==================================================
PHASE 1 — DEEP INSPECTION FIRST
==================================================

Before changing anything, inspect:

- client/
- server/
- apbot/
- MongoDB models
- routes
- React components
- ApBot component
- intents.json
- NLP files
- TensorFlow/Keras model
- training script
- notebook
- Product Detail page
- authentication
- cart
- wishlist
- checkout
- orders
- tracking
- navigation
- README
- documentation
- submission files

Also inspect the provided SRS.

IMPORTANT:

SRS = requirements source of truth.
SOURCE CODE = implementation source of truth.

Do not assume that documentation claims are correct.

Compare actual code against the SRS.

==================================================
PHASE 2 — CREATE INTERNAL GAP ANALYSIS
==================================================

Before modifying code, identify:

1. SRS requirements already implemented
2. Partially implemented requirements
3. Missing requirements
4. Security vulnerabilities
5. Functional bugs
6. Navigation issues
7. Data inconsistencies
8. Documentation claims that don't match code

Do NOT immediately start changing random files.

Understand the architecture first.

==================================================
PHASE 3 — SECURITY FIXES
==================================================

Fix security issues without breaking the existing authentication flow.

### PASSWORDS

If passwords are currently stored or compared as plaintext:

Implement bcrypt/bcryptjs securely.

Registration:

password
→ bcrypt hash
→ database

Login:

password
→ bcrypt.compare()
→ JWT

Never store plaintext passwords.

Do not expose passwords anywhere.

### JWT

Remove insecure hardcoded fallback JWT secrets.

JWT_SECRET must come from environment variables.

Never expose secrets in frontend code.

### USER OWNERSHIP

This is extremely important.

Never trust:

- req.body.userId
- req.body.email
- req.query.email
- frontend context.userId

for authenticated ownership.

The authenticated user's identity must come from the verified JWT.

Use the JWT identity for:

- profile
- wishlist
- cart
- orders
- order history
- protected ApBot actions

### ORDER SECURITY

User A must NEVER be able to access User B's orders by changing:

userId
email
order ID
request parameters

Verify ownership on the backend.

### WISHLIST SECURITY

User A must not be able to retrieve or modify User B's wishlist.

### CART SECURITY

Authenticated cart operations must belong to the authenticated user.

### APBOT SECURITY

ApBot must use verified authentication for protected operations.

Conversation context may be used for conversational memory.

BUT:

conversation context must NEVER be treated as authentication.

==================================================
PHASE 4 — NAVIGATION
==================================================

Test and fix ALL ApBot navigation actions.

These must work:

"Go home"

"Open shop"

"Open Outerwear"

"Open Knitwear"

"Open Tailoring"

"Open Archive"

"Open my profile"

"Open my orders"

"Open my wishlist"

"Open my bag"

"Open checkout"

"Open tracking"

"Open this product"

"Open product details"

If the backend sends a navigation action that React does not understand, fix the integration.

Do not create duplicate navigation systems.

Use the existing SABLE navigation architecture.

==================================================
PHASE 5 — PRODUCT KNOWLEDGE
==================================================

ApBot must answer product questions using REAL MongoDB product data.

Verify:

- name
- description
- price
- material
- colour
- sizes
- availability
- stock
- tags
- category

Never invent product information.

Test:

"What material is this?"

"What sizes are available?"

"How much is it?"

"Is it in stock?"

"Tell me about this product."

==================================================
PHASE 6 — PRODUCT DETAIL PAGE
==================================================

Inspect the existing Product Detail page.

Improve it without changing the SABLE visual identity.

It must display real database information.

Do NOT create fake information when a database field is missing.

If only one product image exists:

show one real image.

Do NOT duplicate the same image five times pretending they are different gallery images.

Keep the page premium, editorial and Awwwards-quality.

==================================================
PHASE 7 — SIMILAR PRODUCTS
==================================================

Improve the existing similar-product functionality.

Do not replace the existing database.

Use actual product attributes.

Recommendations should consider:

- category
- tags
- colour
- material
- price
- availability

The result must be relevant.

Examples:

"Show me something similar."

"Show me something cheaper."

"Show me something similar in black."

"Show me similar products under £200."

Never invent products.

==================================================
PHASE 8 — CONTEXTUAL AI
==================================================

DO NOT BREAK THE EXISTING CONTEXT SYSTEM.

This exact conversation must continue working:

User:
"Show me jackets."

Bot:
shows real products.

User:
"Only black."

Bot:
filters previous products.

User:
"Under £200."

Bot:
filters again.

User:
"Show me the first one."

Bot:
understands the previous product list.

User:
"Tell me about it."

Bot:
returns actual product information.

User:
"Show me something similar."

Bot:
returns relevant products.

User:
"Add it to my bag."

Bot:
adds the correct product.

Also support:

"the first one"
"the second one"
"this"
"that"
"it"
"another one"

when context is clear.

If context is unclear, ask a short clarification question.

==================================================
PHASE 9 — CHECKOUT / TRACKING
==================================================

Do not create duplicate checkout logic.

Use the existing checkout system.

Verify:

Cart
→ Checkout
→ Order creation
→ Tracking ID
→ Order tracking

Authentication and ownership must be validated server-side.

Do not fabricate order information.

Do not allow users to access other users' orders.

==================================================
PHASE 10 — BUSINESS INFORMATION CONSISTENCY
==================================================

Audit the entire project for conflicting information.

Check:

- shipping threshold
- return policy
- delivery time
- payment information
- product availability
- product pricing
- FAQ answers

If the same business information appears in multiple places:

make it consistent.

ApBot's answers must match the website.

Do not invent new policies.

Use the project's actual intended policy.

==================================================
PHASE 11 — AI / ML
==================================================

DO NOT replace the existing TensorFlow/Keras architecture with an LLM.

Keep:

- TensorFlow
- Keras
- NLTK
- tokenization
- lemmatization
- Bag of Words
- intents.json
- trained model
- Flask API

Verify the REAL trained model is being used.

MockPredictor must NOT be reintroduced.

If training data needs improvement, improve intents.json and retrain the existing model.

Do not fabricate accuracy numbers.

==================================================
PHASE 12 — VISUAL SEARCH
==================================================

Inspect the existing image-search feature.

Be technically honest.

If it is metadata/keyword-based search rather than actual computer vision:

keep it functional but do NOT call it CNN/image-embedding AI.

Do not claim functionality that does not exist.

==================================================
PHASE 13 — DOCUMENTATION
==================================================

Update documentation ONLY where it does not match the actual implementation.

Especially verify claims about:

- bcrypt
- ML accuracy
- confidence scores
- response time
- uptime
- visual AI
- security
- testing

Never invent metrics.

If something has not been formally measured, say:

"Not formally benchmarked."

If something is not implemented, clearly say:

"Not implemented."

Documentation must match the source code.

==================================================
PHASE 14 — TEST EVERYTHING
==================================================

After fixes, actually test the application.

Test:

### CONVERSATION

Hi
Hello
Thanks
Okay
Bye
How are you?

### PRODUCT

Show me jackets
Show me black jackets
Show me jackets under £200
Tell me about this
What material is it?
What sizes are available?
Show me something similar

### CONTEXT

Show me jackets
Only black
Under £200
Show me the first one
Tell me about it
Add it to my bag

### CART

What's in my bag?
Add another one
Remove it
Increase quantity
Decrease quantity

### WISHLIST

Save this for later
Show my wishlist
Remove this from wishlist

### CHECKOUT

Take me to checkout

### TRACKING

Track my order
Open tracking

### NAVIGATION

Go home
Open shop
Open Outerwear
Open Knitwear
Open Tailoring
Open Archive
Open profile
Open orders
Open wishlist
Open bag

### AUTH

Login
Logout
Open profile while logged out
Open orders while logged out
Open profile while logged in

### FALLBACK

Ask something completely unrelated.

The bot should politely refuse instead of hallucinating.

==================================================
PHASE 15 — SECURITY TESTING
==================================================

Actually verify:

- invalid JWT rejected
- missing authentication rejected for protected actions
- User A cannot access User B orders
- User A cannot access User B wishlist
- User A cannot access User B cart
- frontend cannot spoof userId
- frontend cannot spoof email
- protected ApBot actions respect authentication

==================================================
PHASE 16 — BUILD VERIFICATION
==================================================

Run the actual project.

Verify:

Frontend build succeeds.
Backend starts.
Python service starts.
TensorFlow model loads.
NLTK resources load.
MongoDB connects.
ApBot works.

Fix all errors discovered during testing.

Then run the tests again.

==================================================
PHASE 17 — DO NOT BREAK EXISTING PROJECT
==================================================

Before finishing, verify that these existing features still work:

- homepage
- product listing
- search
- cart
- wishlist
- authentication
- checkout
- order creation
- tracking
- profile
- Product Detail page
- ApBot
- GSAP animations
- Lenis scrolling
- responsive design

Do not remove existing functionality.

==================================================
FINAL RESPONSE
==================================================

When everything is finished, give me a concise report with:

1. SECURITY FIXES
2. FUNCTIONAL FIXES
3. AI/ML FIXES
4. NAVIGATION FIXES
5. DATABASE FIXES
6. DOCUMENTATION FIXES
7. TESTS ACTUALLY RUN
8. BUILD RESULT
9. REMAINING LIMITATIONS

For every item use:

✅ FIXED
⚠️ PARTIAL
❌ NOT FIXED

IMPORTANT:

Do not say "PASS" just because code was modified.

Only say PASS after actually verifying the behavior.

Do not fabricate test results.

Do not claim 100% completion unless every relevant SRS requirement has actually been verified.

The final goal is:

SABLE + ApBot
= Secure
= SRS-compliant
= technically accurate
= natural conversational AI
= fully integrated e-commerce assistant
= competition-ready

Preserve the existing SABLE identity and architecture throughout.
