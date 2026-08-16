# SABLE — AWWWARDS-LEVEL MOTION & ANIMATION MASTER UPGRADE

You are working on the existing SABLE luxury fashion e-commerce website.

The website already has its own visual identity, colors, typography, product imagery, GSAP, ScrollTrigger and Lenis.

Your task is to create a COMPLETE, PREMIUM, AWWWARDS-LEVEL MOTION SYSTEM across the website.

IMPORTANT:
DO NOT redesign the website.
DO NOT change the existing SABLE brand identity.
DO NOT introduce random colors.
DO NOT introduce random fonts.
DO NOT replace existing components unnecessarily.
DO NOT break any existing functionality.

First INSPECT the actual SABLE codebase and existing design system.

==================================================

1. # USE THE EXISTING SABLE DESIGN SYSTEM

Before writing animation code, inspect:

- CSS variables
- colors
- typography
- font imports
- spacing
- buttons
- product cards
- navbar
- hero
- modals
- drawers
- ApBot
- Product Details page
- Tracking page
- Checkout
- Login
- Profile
- Orders
- Wishlist

Reuse the EXACT existing SABLE colors and fonts.

The current visual language is:

- bone / ivory
- ink black
- subtle neutral tones
- editorial typography
- thin hairline borders
- luxury fashion spacing
- monochrome imagery

DO NOT introduce:

- neon
- purple AI gradients
- blue SaaS colors
- excessive glassmorphism
- colorful animated backgrounds
- cartoon animations

================================================== 2. MOTION PHILOSOPHY
==================================================

SABLE should feel like a premium fashion editorial.

Animation should be:

- cinematic
- restrained
- elegant
- smooth
- intentional
- fast enough to remain usable
- visually memorable

Golden rule:

THE ANIMATION SHOULD BE FELT, NOT SCREAM.

Avoid excessive motion.

Do not animate every element.

================================================== 3. PAGE LOADER
==================================================

Create a premium SABLE editorial loader.

Use the existing SABLE colors/fonts.

Concept:

Full viewport:

SABLE

thin horizontal progress line

The SABLE wordmark should reveal elegantly.

Animation sequence:

1. Bone background appears.
2. SABLE wordmark fades/reveals.
3. Letterforms subtly move into position.
4. Thin progress line draws from 0 → 100%.
5. Main page content begins revealing underneath.
6. Loader exits using a sophisticated vertical/clip-path transition.

Total duration should normally remain around 1–1.5 seconds.

Do NOT create a traditional spinner.

Do NOT make the user wait unnecessarily.

Only show the loader when genuinely useful.

================================================== 4. HERO ANIMATION
==================================================

Create a cinematic first-load sequence.

Sequence:

Announcement bar
↓
Navbar
↓
Editorial text
↓
Huge SABLE typography
↓
Hero image/model
↓
CTA buttons

Use staggered timing.

Hero image should use a subtle:

- clip-path reveal
- scale 1.05 → 1
- opacity reveal

Typography should have a subtle upward reveal.

Do NOT use dramatic bouncing.

================================================== 5. SCROLL-BASED MOTION
==================================================

Use GSAP ScrollTrigger.

Implement subtle editorial scroll interactions:

- hero image parallax
- large typography movement
- product image reveal
- section heading reveal
- horizontal collection movement where appropriate
- image clip-path reveals
- staggered product cards

Keep movement subtle.

Never make content difficult to read.

Respect reduced-motion preferences.

================================================== 6. PRODUCT GRID
==================================================

Product cards should enter the viewport elegantly.

Use:

opacity: 0 → 1
translateY: 24px → 0

with subtle stagger.

On hover:

image:
scale 1 → 1.035

Wishlist:
very subtle scale/stroke transition

Product information:
small vertical movement

Do NOT use aggressive zoom.

Do NOT make cards jump.

================================================== 7. PRODUCT IMAGE HOVER
==================================================

Use premium fashion-editorial image interaction.

On hover:

- image scale ~1.03
- subtle crop movement
- smooth easing

If the product has multiple images:

allow a subtle secondary-image reveal where appropriate.

Keep transitions smooth.

================================================== 8. PRODUCT DETAIL PAGE
==================================================

Create a cinematic Product Details experience.

On page entry:

- gallery reveals first
- product information follows
- price appears
- size selector appears
- CTA appears

Use staggered motion.

When changing product images:

Use elegant crossfade / directional transition.

Size selection:

subtle border transition.

Add to Bag:

button should provide premium feedback.

After adding:

- button state changes smoothly
- bag counter animates
- optionally trigger a subtle confirmation animation

Do NOT use confetti.

================================================== 9. NAVBAR
==================================================

Navbar should have subtle scroll intelligence.

When scrolling down:

- compress slightly
- reduce vertical spacing subtly

When scrolling up:

- restore gracefully

Category hover:

thin underline should animate from left → right.

Active category:

minimal animated indicator.

Logo:

remain stable and premium.

Do not make navbar constantly move.

================================================== 10. SEARCH EXPERIENCE
==================================================

Search should feel like a fashion editorial overlay.

Opening:

- overlay fades
- search field reveals
- cursor/focus appears
- featured products stagger in

Typing:

results update smoothly.

Product results:

subtle reveal instead of abrupt DOM changes.

Closing:

reverse the animation.

================================================== 11. CART DRAWER
==================================================

Create a premium right-side drawer transition.

Opening:

drawer:
translateX(100%) → 0

overlay:
opacity 0 → subtle dark overlay

Closing:
reverse.

Cart products should stagger slightly.

Quantity changes should animate smoothly.

Bag count:

small scale feedback.

Empty bag state:

subtle icon/text reveal.

DO NOT use huge bouncing animations.

================================================== 12. WISHLIST
==================================================

Heart interaction:

scale:
1 → 1.15 → 1

plus subtle stroke transition.

Wishlist drawer should use the same motion language as the cart.

================================================== 13. AUTHENTICATION
==================================================

Login/Register modal should have premium editorial transitions.

Switching:

LOGIN ↔ CREATE ACCOUNT

should use:

- crossfade
- slight horizontal movement
- smooth form transition

Do not make the entire modal jump.

================================================== 14. CHECKOUT
==================================================

Checkout steps should transition smoothly:

DELIVERY
↓
PAYMENT
↓
CONFIRMATION

Use subtle horizontal/vertical transitions.

Progress indicator should animate naturally.

Order confirmation should feel premium.

No confetti.

No excessive celebration effects.

================================================== 15. TRACKING PAGE
==================================================

Order tracking timeline should animate progressively.

Timeline:

ORDER PLACED
↓
PROCESSING
↓
SHIPPED
↓
OUT FOR DELIVERY
↓
DELIVERED

Reveal each stage elegantly.

The active status should have a very subtle pulse.

Do NOT create flashy glowing effects.

================================================== 16. PROFILE / ORDERS / WISHLIST PAGES
==================================================

Use the same SABLE editorial motion language.

Page entrance:

heading → content → cards

Subtle stagger.

Order rows:

slight hover movement.

Buttons:

small arrow/icon movement on hover.

No dashboard-style animated charts.

================================================== 17. APBOT — MOST IMPORTANT
==================================================

ApBot must feel like an integrated part of SABLE.

Do NOT make it look like a generic AI SaaS chatbot.

Use the SAME:

- SABLE colors
- SABLE typography
- border language
- spacing
- icon language

ApBot opening animation:

floating button
↓
morph / expand
↓
chat panel reveal

Use:

opacity
scale
translate
clip-path

with premium easing.

The transition should feel like the assistant is emerging from the SABLE interface.

================================================== 18. APBOT MESSAGE ANIMATIONS
==================================================

Messages should appear with:

opacity: 0 → 1
translateY: 12px → 0

Very subtle.

Typing indicator:

3 minimal dots or elegant animated indicator.

Do not use childish bouncing dots.

================================================== 19. APBOT PRODUCT CARDS
==================================================

When ApBot returns products:

cards should reveal sequentially.

Example:

Product 1
↓
Product 2
↓
Product 3

Use subtle stagger.

Images can have a tiny reveal/scale effect.

Add to Bag:

premium micro-interaction.

View Product:

arrow moves slightly on hover.

================================================== 20. APBOT ACTIONS
==================================================

When ApBot performs an action:

"Opening your bag."

"Taking you to checkout."

"Opening tracking."

"Signing you out."

Use subtle action feedback.

Never use large toast notifications unless necessary.

================================================== 21. PAGE TRANSITIONS
==================================================

Create a consistent page transition system.

When navigating:

Current page:
subtle fade/clip

New page:
reveals elegantly

Do NOT create long blank transition screens.

Target:
~400–700ms depending on transition.

Navigation must still feel instant.

================================================== 22. BUTTON MICRO-INTERACTIONS
==================================================

Buttons should feel tactile.

Hover:

- subtle background transition
- text movement
- arrow movement

Click:

tiny scale response.

Do not overdo it.

================================================== 23. IMAGE REVEALS
==================================================

Across the website use a consistent editorial image reveal:

- clip-path
- opacity
- subtle scale

Avoid applying the exact same animation everywhere.

Create a small motion vocabulary so the website feels designed rather than repetitive.

================================================== 24. GSAP ARCHITECTURE
==================================================

Use the existing GSAP installation.

Prefer:

GSAP timelines
ScrollTrigger
context-safe cleanup
proper React lifecycle integration

Avoid:

- memory leaks
- duplicate ScrollTriggers
- animations running after component unmount
- unnecessary requestAnimationFrame loops

Clean up all animations properly.

================================================== 25. LENIS
==================================================

Preserve the existing Lenis implementation.

Do not create a second smooth-scroll system.

Ensure:

- modals stop Lenis when necessary
- drawers behave correctly
- page transitions do not conflict with Lenis
- scrolling remains responsive

================================================== 26. PERFORMANCE
==================================================

Animations must remain smooth.

Target:

60fps where practical.

Avoid:

- huge blur effects
- excessive filters
- expensive continuous animations
- unnecessary layout thrashing
- animating width/height when transform can be used
- massive DOM animation chains

Prefer:

transform
opacity
clip-path

where appropriate.

================================================== 27. ACCESSIBILITY
==================================================

Respect:

prefers-reduced-motion

If reduced motion is enabled:

- disable parallax
- minimize page transitions
- remove continuous animations
- retain usability

Never make animation required to understand content.

================================================== 28. MOBILE
==================================================

Every animation must work beautifully on:

Desktop
Tablet
Mobile

Reduce motion complexity on smaller screens.

Do not allow:

- overflow
- horizontal scrolling caused by animation
- elements leaving the viewport
- chatbot covering important CTAs

================================================== 29. CONSISTENCY
==================================================

Create reusable motion utilities/components where appropriate.

For example:

- fadeReveal
- editorialReveal
- imageReveal
- staggerReveal
- drawerTransition
- modalTransition
- pageTransition

But do not over-engineer.

Reuse the existing code architecture.

================================================== 30. FINAL QUALITY CHECK
==================================================

Open and manually inspect:

Homepage
Shop
Product Details
Search
Cart
Wishlist
Login
Profile
Orders
Checkout
Tracking
ApBot

Check:

- no animation glitches
- no flickering
- no layout shift
- no stuck overlays
- no broken scrolling
- no duplicate animations
- no console errors
- no performance regression
- no broken existing functionality

Run the production build.

==================================================
FINAL RULE
==================================================

DO NOT make SABLE look like an animation showcase.

Make it look like a REAL luxury fashion brand that happens to have exceptionally polished motion design.

Use the existing SABLE colors.
Use the existing SABLE fonts.
Use the existing SABLE spacing.
Use the existing SABLE components.

The result should feel:

QUIET.
LUXURIOUS.
EDITORIAL.
CINEMATIC.
PRECISE.
AWWWARDS-LEVEL.

Inspect → Design → Implement → Test → Refine.

Do not stop at technically working animations.
Polish the timing, easing, spacing and sequencing until the entire website feels like ONE cohesive premium experience.
