# APBOT — DIALOG FLOW & CONVERSATIONAL STATE MACHINE

---

## 🔁 DIALOG FLOW DIAGRAM

```mermaid
flowchart TD
    Start([User Types or Speaks Message]) --> InputCheck{Input Type?}
    
    InputCheck -->|Text / Speech| TextPipeline[Process Text Input]
    InputCheck -->|Image Upload| ImagePipeline[Scan Photo Metadata vs DB]
    
    TextPipeline --> IntentModel[TensorFlow Keras Intent Prediction - 5001]
    ImagePipeline --> IntentVisual[Set Intent: visual_search]

    IntentModel --> IntentBranch{Predicted Intent Tag}

    %% Branch 1: Greetings & Conversation
    IntentBranch -->|greeting / thanks / goodbye / confirmation| ConvHandler[Return Warm Luxury SABLE Response]
    ConvHandler --> RenderChat[Render Text in Chat UI + Speech TTS]

    %% Branch 2: Product Search & Recommendations
    IntentBranch -->|product_search / similar_products / category_search| SearchDB[Query MongoDB Products Collection]
    SearchDB --> SaveContext[Save Product Array to lastProducts Context]
    SaveContext --> RenderCards[Render Product Cards in Chat]

    %% Branch 3: Product References & Details
    IntentBranch -->|product_information / indexed_reference| IndexCheck{Check Index e.g. 'first one'}
    IndexCheck -->|Index 0 / 1 / 2| SelectProd[Extract product from lastProducts]
    SelectProd --> FetchDetails[Fetch Material, Sizes & Stock Details]
    FetchDetails --> RenderBreakdown[Render Product Breakdown Card]

    %% Branch 4: Cart & Wishlist Actions
    IntentBranch -->|add_to_cart / wishlist_add / remove_from_cart| ActionHandler[Format Action Payload]
    ActionHandler --> TriggerReact[Trigger onAddToCart / onToggleFav Action]
    TriggerReact --> UpdateBadge[Update UI Cart / Wishlist Badges]

    %% Branch 5: Checkout Flow
    IntentBranch -->|checkout / process_address / process_payment| CheckoutCheck{Active Cart Items?}
    CheckoutCheck -->|Cart Empty| PromptCart[Prompt: Add items before checking out]
    CheckoutCheck -->|Cart Has Items| OpenModal[Open Checkout Modal / In-Chat Form]
    OpenModal --> SaveOrderDB[Create Order in MongoDB & Clear Cart]

    %% Branch 6: Order Tracking
    IntentBranch -->|order_tracking / order_status| TrackCheck{Tracking ID or Latest Order?}
    TrackCheck -->|Order Found| CalcTimeline[Compute 10-Min Status: Placed->Shipped->Delivered]
    TrackCheck -->|Order Not Found| PromptID[Prompt: Check tracking ID and try again]
    CalcTimeline --> RenderTrackCard[Render Tracking Card in Chat]

    %% Branch 7: Auth Controls
    IntentBranch -->|login / logout / profile| AuthCheck{User Logged In?}
    AuthCheck -->|Logged Out & Protected Route| OpenAuth[Trigger Login Modal]
    AuthCheck -->|Logged In| ShowProfile[Render Profile Info / Logout Action]

    %% Branch 8: Unsupported / Out of Scope
    IntentBranch -->|unsupported_request / unknown| FallbackScope[Polite SABLE Refusal Response]
    FallbackScope --> OfferOptions[Offer SABLE Product Search & Tracking]

    RenderCards --> End([Wait for Next User Message])
    RenderBreakdown --> End
    UpdateBadge --> End
    SaveOrderDB --> End
    RenderTrackCard --> End
    OfferOptions --> End
    RenderChat --> End
```

---

## 🧠 CONVERSATIONAL STATE MACHINE SPECIFICATION

| State Name | Trigger Keywords | State Variables Retained | Next Possible Actions |
| :--- | :--- | :--- | :--- |
| **`IDLE / GREETING`** | `"Hi"`, `"Hello"`, `"Good morning"` | None | Product search, category browse, general FAQs |
| **`SEARCH_ACTIVE`** | `"Show me black jackets"` | `lastProducts`, `colorFilter`, `priceFilter` | Filter by price, pick item ("first one"), add to bag |
| **`PRODUCT_REFERENCED`** | `"Show me the first one"`, `"Tell me about it"` | `selectedProductIndex`, `lastProducts[0]` | Add to cart, save to wishlist, request similar items |
| **`CHECKOUT_AWAITING_ADDRESS`** | `"I want to checkout"` | `cartItems`, `checkoutState: 'awaiting_address'` | Enter shipping address, submit payment |
| **`CHECKOUT_AWAITING_PAYMENT`** | Address submitted | `cartItems`, `shippingAddress`, `checkoutState: 'awaiting_payment'` | Enter card details, finalize purchase |
| **`ORDER_TRACKING_ACTIVE`** | `"Track SBL-12345"` | `activeOrderId`, `createdAtTimestamp` | Refresh status, view order history, contact support |
| **`UNSUPPORTED_BOUNDARY`** | Out-of-scope question | Previous context preserved | Redirect to SABLE browsing |
