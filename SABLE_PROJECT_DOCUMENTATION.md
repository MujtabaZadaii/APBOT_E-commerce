# ApBot Text Correction & NLP Improvement — Local Project Task

You are working directly on my **local ApBot E-Commerce project**.

I am the **project owner and authorized developer**. You have permission to inspect, modify, create, and test files inside this local project.

## Project Goal

Improve the existing ApBot NLP pipeline so that when a user makes spelling mistakes, typos, or minor grammatical mistakes, the system can understand the intended meaning and produce the correct response.

### Examples

```text
User: show me blak jacket
Corrected: show me black jacket

User: i want a red shrit
Corrected: i want a red shirt

User: show me men jackt under 200
Corrected: show me men jacket under 200

User: whre is my order
Corrected: where is my order
```

The corrected text should then continue through the existing ApBot intent-classification pipeline.

---

# IMPORTANT: First Inspect Everything

Before changing anything:

1. Inspect the complete project structure.
2. Inspect the existing ApBot implementation.
3. Inspect:
   - `apbot/`
   - `apbot/data/intents.json`
   - `apbot/train.py`
   - `apbot/chatbot/`
   - Flask API
   - Express ApBot routes
   - React `ApBot.jsx`
   - relevant package/requirements files
   - existing model files
   - existing documentation

4. Understand the current NLP flow.
5. Do NOT replace the existing TensorFlow/Keras intent-classification model.
6. Do NOT remove existing functionality.
7. Do NOT redesign the application.
8. Do NOT add unnecessary large LLMs.

---

# Recommended Approach

Use a **lightweight spelling/text-correction layer** before the existing intent classifier.

Prefer:

### Option 1 — SymSpell

Use SymSpell or another lightweight spell-correction library if it can reliably work with the existing project.

The architecture should become:

```text
User Message
      ↓
Text Normalization
      ↓
Spelling / Typo Correction
      ↓
Existing NLTK Processing
      ↓
Bag-of-Words
      ↓
Existing TensorFlow/Keras Model
      ↓
Intent Classification
      ↓
Existing Express Business Logic
      ↓
MongoDB
      ↓
ApBot Response
```

Do NOT replace the current TensorFlow/Keras model.

---

# Critical Requirement

The correction layer must **NOT blindly change valid product names, fashion terms, colors, categories, or user-specific words**.

For example:

```text
black
jacket
shirt
dress
sable
apbot
gucci
nike
men
women
luxury
checkout
order
tracking
```

should not be incorrectly modified.

If possible, maintain a domain vocabulary containing:

- product names
- categories
- colors
- materials
- sizes
- fashion terminology
- ApBot intents
- important application terminology

The correction system should prioritize this vocabulary.

---

# Confidence-Based Correction

Do not modify every word automatically.

Use confidence/distance thresholds.

Example:

```text
blak → black
```

High confidence → correct.

But:

```text
SABLE → sable
```

Do not modify if `SABLE` is a valid project/product/domain term.

If correction confidence is low, keep the original user text.

---

# Preserve Meaning

The correction system must preserve:

- numbers
- prices
- currency
- product IDs
- order IDs
- tracking IDs
- email addresses
- URLs
- usernames
- important proper nouns

Example:

```text
show me blak jacket under £200
```

should become approximately:

```text
show me black jacket under £200
```

NOT:

```text
show me black jacket under £2
```

---

# Integration

Integrate the correction layer at the correct point in the existing backend/AI pipeline.

Prefer correcting the message before intent classification:

```text
raw_message
    ↓
correct_text()
    ↓
predict_intent(corrected_message)
```

Keep both values available:

```text
original_message
corrected_message
```

This will make debugging easier.

---

# API Response

If appropriate, expose the corrected text internally or in the API response for debugging.

Example:

```json
{
  "message": "show me blak jacket",
  "correctedMessage": "show me black jacket",
  "intent": "product_search"
}
```

Do not unnecessarily expose implementation details to normal users.

---

# Do Not Break Existing Features

After implementation verify that these still work:

- product search
- product recommendations
- FAQs
- order tracking
- checkout flow
- cart actions
- wishlist
- authentication
- ApBot context
- existing TensorFlow/Keras intent classification
- MongoDB product queries
- Flask API
- Express API
- React chatbot

---

# Testing

Create or update tests for at least these cases:

### Spelling

```text
blak → black
jaket → jacket
shrit → shirt
dres → dress
```

### Sentence correction

```text
show me blak jacket
i want a red shrit
show me men jaket
```

### Existing valid words

Verify that valid product/domain terms are NOT changed.

### Numbers and prices

```text
show me blak jacket under £200
```

must preserve `£200`.

### Order IDs

Verify order/tracking identifiers remain unchanged.

### Correct sentences

```text
show me black jackets
```

should remain effectively unchanged.

### Unknown/low-confidence words

Do not force an incorrect correction.

---

# Performance

Keep this lightweight.

Do NOT install or introduce:

- GPT
- large LLMs
- huge transformer models
- external paid APIs

unless absolutely necessary.

The purpose is simply to improve the existing academic AI/ML chatbot.

---

# Documentation

After implementation, update the project documentation to explain:

1. Why spelling correction was added.
2. Which library/model is being used.
3. Where it sits in the NLP pipeline.
4. How typo correction works.
5. Confidence threshold.
6. Domain vocabulary.
7. Example inputs and corrected outputs.
8. Testing results.

Describe it accurately as a **lightweight NLP preprocessing/correction layer**, not as a generative AI model.

---

# Final Verification

After making changes:

1. Run all relevant tests.
2. Run Python syntax checks.
3. Run backend checks.
4. Run frontend build.
5. Test the Flask AI service.
6. Test the Express ApBot endpoint.
7. Test the React chatbot.
8. Verify existing functionality was not broken.
9. Report every changed file.
10. Report every dependency added.
11. Report the exact correction pipeline.
12. Clearly report any remaining issues.

Do not stop after editing files.

**Actually test the implementation and fix any errors you encounter.**

The final result should be production-quality for an academic AI/ML project while remaining lightweight and compatible with the existing ApBot architecture.
