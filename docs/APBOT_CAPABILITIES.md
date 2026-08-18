# ApBot AI Assistant Capabilities

ApBot is SABLE's award-winning, premium AI shopping assistant designed to elevate the e-commerce experience. Through Natural Language Processing (NLP) and deep integration with the SABLE storefront, users can perform a wide variety of actions effortlessly.

Here is a comprehensive list of everything a user can do using ApBot:

## 1. 🛍️ Smart Product Discovery & Search
Users can ask ApBot to find specific clothing items, styles, or categories using natural language.
- **Example Prompts:** 
  - *"Show me some outerwear."*
  - *"Do you have any black jackets under £200?"*
  - *"I'm looking for a Gauge Cardigan."*
- **Action:** ApBot searches the SABLE database and displays the results in a sleek, horizontally scrolling product carousel directly inside the chat window.

## 2. 🧠 Context-Aware Recommendations
ApBot remembers the conversation. If a user asks for something similar to what they just saw, ApBot uses context to find related items.
- **Example Prompts:**
  - *"Show me something similar."*
  - *"What else do you have like this?"*
- **Action:** ApBot analyzes the category of the most recently displayed products and recommends alternative pieces from the same collection.

## 3. 🛒 Direct Add-to-Bag Functionality
Users don't need to navigate to a separate product page to shop. 
- **Action:** Every product card inside the ApBot chat features an integrated **"Add to Bag"** button, allowing users to instantly add items to their shopping cart without leaving the conversation.

## 4. 👜 Cart & Checkout Navigation
ApBot can control the website's user interface programmatically based on the user's commands.
- **Example Prompts:**
  - *"What's in my bag?"* → Automatically opens the side Cart Drawer.
  - *"I want to checkout."* or *"Let's buy this."* → Automatically opens the Checkout Modal.

## 5. 📦 Real-Time Order Tracking
Users can check the status of their purchases seamlessly through the chat.
- **Example Prompts:**
  - *"Track my order"* 
  - *"Where is my package?"*
- **Action:** ApBot renders a dedicated, visually appealing **Order Status Card** right in the chat bubble (or triggers the Order Tracking page), showing the tracking ID and the real-time shipping status.

## 6. 💬 Conversational Small Talk
ApBot is designed with a luxury, polite persona.

## 7. 🔤 Domain-Aware Lightweight NLP Text & Typo Correction
ApBot features a dedicated, high-speed Domain-Aware Text Correction layer prior to vectorization & classification:
- **Why Added**: Enables natural fault-tolerant dialogue when users make spelling typos (e.g. `blak`, `jaket`, `shrit`, `whre`).
- **Pipeline Position**: `User Raw Message ➔ Domain Typo Normalization ➔ Tokenization ➔ Lemmatization ➔ Bag of Words ➔ Keras Classifier`.
- **Protection**: Numbers, prices (`£200`), order IDs (`SBL-12345`), emails, and valid brand terms (`SABLE`, `ApBot`) are strictly protected from modification.
- **Confidence Threshold**: High confidence (0.80 cutoff) matching against fashion domain vocabulary ensures zero unintended word alterations.
- **Example Inputs & Outputs**:
  - `show me blak jacket` ➔ `show me black jacket`
  - `i want a red shrit` ➔ `i want a red shirt`
  - `show me men jackt under 200` ➔ `show me men jacket under 200` (preserves `200`)
  - `whre is my order SBL-12345` ➔ `where is my order SBL-12345` (preserves `SBL-12345`)
- **Example Prompts:**
  - *"Hi / Hello"* → Greeted with a personalized welcome message.
  - *"Thank you"* → Responds gracefully.
- **Action:** Maintains the premium brand voice of SABLE throughout all interactions.

## 7. 🔒 Secure & Contextual Sessions
- **Action:** ApBot securely passes a JWT authentication token with every message (if the user is logged in). This ensures that actions like adding to cart or tracking orders are perfectly synced with the user's specific SABLE account.
