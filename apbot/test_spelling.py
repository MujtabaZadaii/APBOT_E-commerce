import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from chatbot.spell_corrector import spell_corrector

def run_spelling_tests():
    print("=" * 60)
    print("APBOT DOMAIN SPELL CORRECTOR TEST SUITE")
    print("=" * 60)

    test_cases = [
        # Single word typo corrections
        ("blak", "black"),
        ("jaket", "jacket"),
        ("jackt", "jacket"),
        ("shrit", "shirt"),
        ("dres", "dress"),

        # Sentence corrections
        ("show me blak jacket", "show me black jacket"),
        ("i want a red shrit", "i want a red shirt"),
        ("show me men jackt", "show me men jacket"),
        ("whre is my order", "where is my order"),

        # Valid domain words protection
        ("show me black jackets", "show me black jackets"),
        ("welcome to sable apbot couture", "welcome to sable apbot couture"),

        # Numbers, currency, and prices preservation
        ("show me blak jacket under £200", "show me black jacket under £200"),
        ("show me jacket under 150", "show me jacket under 150"),

        # Tracking IDs & Order IDs preservation
        ("track SBL-12345", "track SBL-12345"),
        ("where is my parcel SBL-84920", "where is my parcel SBL-84920"),

        # Email addresses preservation
        ("contact concierge@sable.com", "contact concierge@sable.com")
    ]

    passed = 0
    failed = 0

    for original, expected in test_cases:
        corrected, was_changed = spell_corrector.correct_sentence(original)
        is_pass = (corrected.strip() == expected.strip())
        status = "[PASS]" if is_pass else "[FAIL]"
        if is_pass:
            passed += 1
        else:
            failed += 1
        print(f"{status} | Original: '{original}' -> Corrected: '{corrected}' (Expected: '{expected}')")

    print("-" * 60)
    print(f"RESULTS: {passed} PASSED, {failed} FAILED out of {len(test_cases)} tests.")
    print("=" * 60)

    if failed > 0:
        sys.exit(1)

if __name__ == '__main__':
    run_spelling_tests()
