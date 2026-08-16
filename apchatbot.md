# SABLE + ApBot — FINAL AI AGENT INTELLIGENCE & PRODUCT EXPERIENCE UPGRADE

The current SABLE + ApBot implementation is already functional and uses the real TensorFlow/Keras/NLTK ML pipeline.

DO NOT rebuild the project.

DO NOT replace the existing SABLE architecture.

DO NOT break existing authentication, products, search, cart, wishlist, checkout, orders, tracking, or the current ApBot functionality.

This task is a major intelligence, product-data, navigation, and UX upgrade.

The goal is to make ApBot feel like a genuinely intelligent AI shopping agent deeply integrated into SABLE rather than a normal chatbot.

==================================================

1. # FIRST — INSPECT EVERYTHING

Before modifying anything, inspect the complete current implementation:

- React application
- Product listing
- Product cards
- Existing product data
- MongoDB Product schema
- Product seed data
- Product APIs
- Authentication/session/JWT implementation
- Cart
- Wishlist
- Checkout
- Orders
- Tracking
- Existing navigation
- ApBot frontend
- ApBot backend
- Python ML service
- intents.json
- conversation context/state machine
- existing ApBot actions

Do not assume how anything works.

Understand the actual implementation first.

Preserve all existing working functionality.

================================================== 2. CREATE A PROPER PRODUCT DETAIL PAGE
======================================

The current SABLE storefront does not have a sufficiently complete dedicated product-detail experience.

Create a premium, Awwwards-quality Product Details page that matches the existing SABLE visual identity.

Suggested route:

/product/:id

OR use the existing routing architecture if a different pattern is already established.

Do not create a generic e-commerce product page.

It must feel like a natural extension of SABLE.

================================================== 3. PRODUCT DETAIL PAGE CONTENT
==============================

The Product Details page should support real data from MongoDB.

Include where available:

- large product imagery
- image gallery
- product title
- category
- price
- availability
- description
- material
- available sizes
- colour
- quantity selector
- Add to Bag
- Add to Wishlist
- product reference/SKU if available
- shipping information
- returns information if actually defined
- related products
- similar products

Do not invent product information.

If a field does not exist in the database, add the field safely and populate legitimate seed data.

================================================== 4. AWWWARDS-LEVEL PRODUCT PAGE DESIGN
=====================================

The product page must match SABLE's existing luxury aesthetic.

Use the existing design system:

- SABLE black/ink
- bone/ivory
- refined typography
- generous whitespace
- hairline borders
- editorial layout
- premium imagery
- subtle GSAP transitions
- smooth scrolling where appropriate
- sophisticated hover states
- responsive layout

Possible layout:

LEFT:
Large editorial image gallery

RIGHT:
Product title
Price
Description
Material
Colour
Size selector
Quantity
Add to Bag
Wishlist

BELOW:
Product information
Shipping/returns
Related products
Similar products

Do not turn it into a cluttered marketplace page.

The page should feel like a luxury fashion editorial.

================================================== 5. PRODUCT DATABASE EXPANSION
=============================

Audit the existing MongoDB Product schema.

Ensure the database can represent all information required by the new Product Details page and ApBot.

Where appropriate support:

- title
- slug
- description
- price
- category
- collection
- images
- thumbnail
- colour
- material
- sizes
- availability
- inStock
- SKU/reference
- related products
- tags
- features
- shipping information where applicable

IMPORTANT:

DO NOT delete the existing database.

DO NOT blindly re-seed and destroy existing products.

Perform a SAFE migration/backfill.

Preserve existing product IDs and existing relationships.

================================================== 6. CREATE HIGH-QUALITY PRODUCT SEED DATA
========================================

The AI cannot provide useful product information if the database contains incomplete products.

Audit every existing product.

Make sure the products have meaningful:

- descriptions
- materials
- colours
- sizes
- categories
- availability
- pricing
- images
- tags

The seed data must be realistic and consistent with the existing SABLE luxury fashion catalogue.

Do not create random unrelated products.

Keep the existing SABLE collections such as:

- Outerwear
- Knitwear
- Tailoring
- Archive

where those collections already exist.

================================================== 7. PRODUCT DATA MUST BECOME APBOT KNOWLEDGE
===========================================

This is extremely important.

Do NOT hardcode product descriptions inside chatbot responses.

ApBot should retrieve product information from the REAL MongoDB product catalogue.

When the user asks:

"What is this jacket made of?"

"Tell me about this product."

"What sizes are available?"

"What is the price?"

"Is this available?"

ApBot should query the real product data.

The database is the source of truth.

================================================== 8. PRODUCT INFORMATION INTELLIGENCE
===================================

Support natural-language product questions:

"Tell me about this."

"What material is it?"

"What sizes does it come in?"

"How much is it?"

"Is it available?"

"Tell me everything about this jacket."

"Open this product."

"Show me the details."

The assistant should provide concise information and offer:

[View Product]

[Add to Bag]

[Add to Wishlist]

================================================== 9. SIMILAR PRODUCT INTELLIGENCE
===============================

Current "similar products" functionality must be significantly improved.

When the user says:

"Show me something similar."

"Give me alternatives."

"Show me more like this."

"Anything similar but cheaper?"

"Something like this in black."

"Show me similar jackets under £200."

ApBot should use the actual product attributes:

- category
- collection
- colour
- material
- price
- tags
- product type
- availability

Do not simply search the product title using basic keywords.

The recommendation engine should return genuinely related products.

================================================== 10. SIMILAR PRODUCT CONTEXT
===========================

If the user is currently viewing a Product Details page and opens ApBot:

ApBot should know which product is currently relevant when the frontend provides the safe product context.

Example:

User:
"Show me something similar to this."

ApBot:
Uses the currently viewed product.

If the user previously selected a product in chat:

User:
"Show me something similar."

ApBot:
Uses the last selected/displayed product.

Do not require the user to repeat the product name unnecessarily.

================================================== 11. PRODUCT → CHATBOT → PRODUCT PAGE
====================================

Create a seamless loop:

Product card in ApBot
→ View Product
→ Product Details page

Product Details page
→ Open ApBot
→ Ask about current product

ApBot
→ Similar products
→ Product cards
→ View Product

This should feel like one connected shopping experience.

================================================== 12. APBOT NAVIGATION AGENT
==========================

Upgrade ApBot so it can safely control SABLE navigation.

Users should be able to say:

"Open the shop."

"Take me to Outerwear."

"Show me Knitwear."

"Open Tailoring."

"Open Archive."

"Go home."

"Open my profile."

"Open my bag."

"Open my wishlist."

"Open checkout."

"Open order tracking."

"Open the tracking page."

"Take me to search."

"Open this product."

The assistant should return structured navigation actions.

Example:

{
"action": "navigate",
"target": "/shop"
}

or use the existing routing/state architecture.

Do not hardcode URLs if the application already has centralized routing.

================================================== 13. AUTHENTICATION-AWARE ACTIONS
================================

ApBot must understand the user's authentication state.

IMPORTANT:

Do NOT send an already-authenticated user back to login unnecessarily.

Example:

User is logged in.

User:
"Open login."

The assistant should understand that the user is already authenticated and respond appropriately, for example:

"You're already signed in to your SABLE account."

Then optionally offer:

[Open Profile]

[Sign Out]

If the user explicitly wants to sign out:

"Log me out."

→ safely execute the existing SABLE logout mechanism.

================================================== 14. LOGIN ACTION
================

If the user is NOT authenticated and asks for a protected action:

"Open my orders."

"Show my wishlist."

"Open my profile."

"Show my bag."

If the requested action requires authentication:

→ do NOT expose private information.

→ route the user to the existing Login/Register interface.

Example:

"Please sign in to access your orders."

[Sign In]

Do not create a second login system.

Use the existing SABLE authentication UI.

================================================== 15. LOGOUT ACTION
=================

Support:

"Logout."

"Sign me out."

"I want to log out."

Use the existing secure logout mechanism.

After logout:

- clear authentication state correctly
- clear sensitive client state where required
- update ApBot authentication awareness
- prevent protected actions
- do not leave stale private information visible

Do not simply navigate to another page without actually logging out.

================================================== 16. LOGIN AWARENESS
===================

ApBot must always understand:

- logged in
- logged out

The frontend should provide safe authentication state to the backend/action layer.

Never trust a user-provided userId.

Never expose another user's data.

================================================== 17. CART AGENT
==============

ApBot should control the existing SABLE cart.

Support:

"Open my bag."

"What's in my bag?"

"Add this."

"Add the first one."

"Add two."

"Remove this."

"Remove the jacket."

"Increase the quantity."

"Decrease the quantity."

"Clear my bag."

Only implement destructive actions such as clearing the bag when the existing UX/security model supports it appropriately.

Use the existing cart implementation.

================================================== 18. CHECKOUT AGENT
==================

Support:

"Take me to checkout."

"Checkout."

"I want to buy this."

"Proceed with my order."

If the user is unauthenticated and checkout requires authentication:

→ route to login.

If authenticated:

→ open the existing checkout flow.

Do not create duplicate checkout logic.

================================================== 19. ORDER & TRACKING AGENT
==========================

Support:

"Open tracking."

"Track my order."

"Where is my order?"

"Track SBL-12345."

"Open my latest order."

"When will my order arrive?"

Use the existing order/tracking backend.

If the user asks:

"Open the tracking page."

→ navigate to the public tracking page.

If the user asks:

"Track my order."

→ if the latest order is safely available, show the relevant status.

If the user explicitly gives a tracking code:

→ track that code.

Never fabricate tracking information.

================================================== 20. WISHLIST AGENT
==================

Support:

"Open my wishlist."

"Save this."

"Add this to my wishlist."

"Remove this from my wishlist."

"Show my saved products."

Use the existing SABLE wishlist/favs implementation.

Respect authentication.

================================================== 21. SEARCH AGENT
================

ApBot should understand:

"Search for black jackets."

"Find Gauge Cardigan."

"Search Outerwear."

"Find something under £150."

"Search black knitwear."

"Show me what you have."

Use the real product catalogue.

The user should not have to manually use the search UI when ApBot can safely perform the same operation.

================================================== 22. MULTI-TURN CONTEXT
======================

Preserve and improve the existing state machine.

The following MUST work:

User:
"Show me jackets."

Bot:
Returns products.

User:
"Only black."

Bot:
Filters previous result.

User:
"Under £200."

Bot:
Applies another filter.

User:
"Show me the first one."

Bot:
References the first product.

User:
"Tell me about it."

Bot:
Retrieves product details.

User:
"Show me something similar."

Bot:
Uses that product as recommendation context.

User:
"Add it to my bag."

Bot:
Adds the correct product.

This is the required quality level.

================================================== 23. APBOT INTENT SYSTEM
=======================

Audit and expand intents.json to cover:

GENERAL:

- greeting
- goodbye
- thanks
- help
- bot_identity

PRODUCT:

- product_search
- product_information
- product_price
- product_availability
- product_recommendation
- similar_products
- category_search
- offers

NAVIGATION:

- go_home
- open_shop
- open_category
- open_product
- open_search
- open_cart
- open_wishlist
- open_profile
- open_checkout
- open_tracking

AUTH:

- login
- logout
- account_status

CART:

- add_to_cart
- remove_from_cart
- update_cart
- view_cart

WISHLIST:

- wishlist_add
- wishlist_remove
- view_wishlist

ORDER:

- order_tracking
- order_status
- delivery_date
- previous_orders
- order_details

SUPPORT:

- faq
- complaint
- return_product
- contact_support

FALLBACK:

- unknown

Make sure the real TensorFlow/Keras model is retrained after dataset changes.

Do not use MockPredictor.

================================================== 24. STRUCTURED ACTION SYSTEM
============================

ApBot responses should distinguish between:

TEXT RESPONSE

PRODUCT RESULTS

PRODUCT DETAIL

NAVIGATION ACTION

CART ACTION

WISHLIST ACTION

AUTH ACTION

CHECKOUT ACTION

ORDER/TRACKING ACTION

Example:

{
"message": "Here are some black jackets under £200.",
"type": "products",
"products": [...]
}

Navigation:

{
"message": "Opening your bag.",
"type": "action",
"action": "open_cart"
}

Logout:

{
"message": "Signing you out.",
"type": "action",
"action": "logout"
}

Product:

{
"message": "Here are the details.",
"type": "product_detail",
"product": {...}
}

Use the existing frontend architecture wherever possible.

================================================== 25. DO NOT LET AI DIRECTLY CONTROL THE DATABASE
===============================================

The AI model should understand intent.

The Express backend should validate and execute actions.

Architecture:

React
↓
Express
↓
AI prediction
↓
validated action
↓
existing SABLE service
↓
MongoDB

Never allow unrestricted AI-generated database queries or mutations.

================================================== 26. PRODUCT DETAIL PAGE + APBOT DEMO
====================================

The final experience should support this:

Open Product Details.

User opens ApBot.

User:
"Tell me about this product."

ApBot:
Returns real description, material, sizes, price, availability.

User:
"Show me something similar."

ApBot:
Returns related products.

User:
"Show me something cheaper."

ApBot:
Returns cheaper alternatives.

User:
"Add the first one to my bag."

ApBot:
Adds the correct product.

This should work using real database information.

================================================== 27. AWWWARDS-LEVEL PRODUCT PAGE
===============================

Make the Product Details page visually exceptional.

Use subtle:

- image reveal
- image transitions
- hover zoom
- GSAP entrance animations
- smooth typography transitions
- elegant size selection
- refined CTA interactions
- responsive mobile layout

Do not over-animate.

The design should communicate:

Luxury
Fashion
Technology
Precision

It should feel like a premium editorial fashion website rather than a standard Shopify clone.

================================================== 28. RESPONSIVE PRODUCT EXPERIENCE
=================================

Verify:

Desktop
Tablet
Mobile

Product images must remain high quality.

Buttons must remain usable.

Chatbot must not cover important product controls.

ApBot should intelligently reposition or minimize when the product page requires more screen space.

================================================== 29. DATA CONSISTENCY
====================

Ensure the same product data is used everywhere:

Product Listing
Product Card
Product Detail
Search
ApBot
Recommendations
Cart
Wishlist
Checkout
Orders

Avoid duplicated product definitions.

MongoDB should remain the source of truth.

================================================== 30. DATABASE SAFETY
===================

DO NOT:

- drop database
- delete existing users
- delete existing orders
- replace existing products blindly
- change product IDs unnecessarily

If seed data must be updated:

Use safe upsert/migration/backfill logic.

Preserve existing data.

================================================== 31. TESTING
===========

Run the following exact conversation:

1.

"Show me jackets."

2.

"Only black."

3.

"Under £200."

4.

"Show me the first one."

5.

"Tell me about it."

6.

"Show me something similar."

7.

"Show me something cheaper."

8.

"Add the second one to my bag."

9.

"What's in my bag?"

10.

"Open checkout."

11.

"Go to the tracking page."

12.

"Open my wishlist."

13.

"Open my profile."

14.

"Log me out."

15.

"Open my profile."

Expected:
User is sent to login because they are logged out.

16.

"Login."

Expected:
Existing login UI/page opens.

17.

After login:
"Open my profile."

Expected:
Profile opens, NOT login.

18.

"Open my bag."

Expected:
Cart opens.

19.

"Open tracking."

Expected:
Tracking page opens.

20.

"Show me Outerwear."

Expected:
Outerwear products are shown.

================================================== 32. SECURITY TESTS
==================

Verify:

- logged-out users cannot access private account data
- logged-out users are redirected to login for protected actions
- logged-in users are not unnecessarily redirected to login
- logout actually invalidates the session
- users cannot access another user's orders
- users cannot modify another user's cart
- users cannot access another user's wishlist
- frontend userId manipulation cannot bypass backend authorization

================================================== 33. ML VERIFICATION
===================

After expanding intents:

1. retrain TensorFlow/Keras model
2. verify NLTK resources
3. run evaluation
4. verify model artifacts
5. test live Flask prediction
6. verify no MockPredictor exists in runtime
7. test all new navigation/action intents

Do not claim completion without retraining.

================================================== 34. DOCUMENTATION
=================

Update:

- README
- SRS_COMPLIANCE.md
- ApBot capability documentation

Document:

- Product Details
- Product Knowledge
- Recommendations
- Navigation actions
- Authentication awareness
- Login/logout
- Cart actions
- Wishlist actions
- Tracking
- Context
- Security
- Database architecture

Do not document capabilities that are not actually implemented.

================================================== 35. FINAL QUALITY STANDARD
==========================

The final system should feel like:

SABLE

- AI Shopping Assistant
- AI Navigation Agent
- AI Product Expert
- AI Cart Assistant
- AI Order Assistant

The user should be able to interact with the storefront naturally rather than manually navigating every page.

However:

Do NOT remove normal website navigation.

ApBot is an additional intelligent interface, not a replacement for the website.

================================================== 36. FINAL NON-NEGOTIABLE RULES
==============================

- Preserve SABLE.
- Preserve existing functionality.
- Use real MongoDB product data.
- Use real TensorFlow/Keras model.
- No MockPredictor.
- No fake product information.
- No fake tracking information.
- No fake offers.
- No duplicate authentication system.
- No duplicate cart system.
- No duplicate wishlist system.
- No duplicate checkout system.
- No database reset.
- No unnecessary admin panel.
- No dashboard.
- No generic chatbot UI.
- No security shortcuts.
- No trusting frontend userId.
- No unnecessary login redirects.
- No fabricated product details.

Inspect → Implement → Test → Fix → Retrain → Verify → Document.

Only declare completion after the entire experience has been tested end-to-end.
