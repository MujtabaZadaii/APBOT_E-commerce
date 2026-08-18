import re
import difflib

# Explicit high-frequency typo map for instant O(1) correction
EXPLICIT_TYPO_MAP = {
    # Garment & Category typos
    'blak': 'black',
    'blck': 'black',
    'blac': 'black',
    'jaket': 'jacket',
    'jackt': 'jacket',
    'jact': 'jacket',
    'jcket': 'jacket',
    'shrit': 'shirt',
    'tsirt': 'shirt',
    'shrt': 'shirt',
    'dres': 'dress',
    'drss': 'dress',
    'coat': 'coat',
    'coatt': 'coat',
    'sweater': 'sweater',
    'swater': 'sweater',
    'swetr': 'sweater',
    'trouser': 'trouser',
    'trousers': 'trousers',
    'trser': 'trousers',
    'outwear': 'outerwear',
    'outerwere': 'outerwear',
    # Action & Query typos
    'whre': 'where',
    'wher': 'where',
    'wht': 'what',
    'wat': 'what',
    'hw': 'how',
    'cheep': 'cheap',
    'cheaper': 'cheap',
    'sasta': 'cheap',
    'mehnga': 'expensive',
    'similer': 'similar',
    'simlar': 'similar',
    'trck': 'track',
    'trak': 'track',
    'traking': 'tracking',
    'ordar': 'order',
    'oder': 'order',
    'recevied': 'received',
    'receved': 'received',
    'chekout': 'checkout',
    'chkout': 'checkout',
    'wapas': 'return',
    'wapsi': 'return',
    'dikhao': 'show',
    'dikao': 'show',
    'batao': 'tell',
    'btao': 'tell',
    'chahiye': 'want',
    'chahye': 'want',
    'repoart': 'report',
    'repart': 'report'
}

DEFAULT_DOMAIN_VOCABULARY = {
    # Core Brand & App Terms
    'sable', 'apbot', 'couture', 'atelier', 'mayfair', 'london', 'luxury', 'haute',
    # Colors
    'black', 'white', 'grey', 'gray', 'blue', 'red', 'green', 'brown', 'navy',
    'ivory', 'beige', 'charcoal', 'onyx', 'obsidian', 'khaki',
    # Categories & Fashion Terms
    'jacket', 'jackets', 'coat', 'coats', 'trench', 'bomber', 'overshirt', 'overshirts',
    'shirt', 'shirts', 'tshirt', 'tee', 'tees', 'sweater', 'sweaters', 'jumper',
    'jumpers', 'cardigan', 'cardigans', 'knitwear', 'trouser', 'trousers', 'pants',
    'slacks', 'tailoring', 'blazer', 'blazers', 'outerwear', 'essentials', 'clothing',
    'dress', 'dresses', 'garment', 'garments', 'outfit', 'outfits', 'suit', 'suits',
    'cotton', 'wool', 'cashmere', 'twill', 'suede', 'leather', 'denim', 'silk',
    # Genders
    'men', 'mens', 'women', 'womens', 'unisex', 'male', 'female',
    # Size & Fit
    'size', 'sizes', 'sizing', 'fit', 'fitting', 'height', 'weight', 'small', 'medium',
    'large', 'xlarge', 'cm', 'kg', 'lbs', 'ft', 'inch',
    # Actions & E-commerce Terms
    'show', 'find', 'search', 'view', 'open', 'add', 'remove', 'clear', 'delete',
    'buy', 'purchase', 'get', 'take', 'tell', 'give', 'where', 'what', 'how', 'when',
    'which', 'want', 'need', 'cart', 'bag', 'checkout', 'order', 'orders', 'tracking',
    'track', 'parcel', 'package', 'return', 'returns', 'refund', 'shipping', 'delivery',
    'price', 'cheap', 'cheapest', 'expensive', 'discount', 'coupon', 'promo', 'vip',
    'wishlist', 'favorite', 'fav', 'save', 'unsave', 'support', 'contact', 'report',
    'help', 'new', 'arrivals', 'trending', 'winter', 'office', 'date', 'formal',
    'similar', 'surprise', 'recommend', 'recommendation'
}

class DomainSpellCorrector:
    """
    Lightweight Domain-Aware Spell Corrector for ApBot NLP Pipeline.
    Corrects typos while strictly preserving numbers, prices, order IDs, URLs, emails, and valid domain terms.
    """
    def __init__(self, additional_vocab=None):
        self.vocab = set(DEFAULT_DOMAIN_VOCABULARY)
        if additional_vocab:
            for v in additional_vocab:
                self.vocab.add(v.lower().strip())
        self.explicit_map = EXPLICIT_TYPO_MAP

    def add_vocabulary(self, words):
        for w in words:
            if isinstance(w, str) and len(w) > 1:
                self.vocab.add(w.lower().strip())

    def is_protected_token(self, token):
        """
        Check if a token should NOT be altered (numbers, currencies, tracking IDs, emails, URLs, short tokens).
        """
        # Numbers, prices, currency formats (£200, 200, $50, €30)
        if re.match(r'^[£$€]?\d+(\.\d+)?%?$', token):
            return True
        # Tracking IDs / Order IDs (e.g. SBL-12345, SBL-REP-58491)
        if re.match(r'^SBL-[A-Z0-9-]+$', token, re.IGNORECASE):
            return True
        # Email addresses or URLs
        if '@' in token or token.startswith('http') or '.' in token:
            return True
        # Single characters or very short tokens
        if len(token) <= 2:
            return True
        return False

    def correct_word(self, word):
        """
        Correct a single word token using explicit map or confidence-based Levenshtein match.
        """
        clean_word = word.lower().strip()

        # Rule 1: Protected tokens
        if self.is_protected_token(word):
            return word

        # Rule 2: Explicit high-frequency typo map
        if clean_word in self.explicit_map:
            corrected = self.explicit_map[clean_word]
            # Match original case
            if word.isupper():
                return corrected.upper()
            elif word.istitle():
                return corrected.capitalize()
            return corrected

        # Rule 3: Valid domain word -> Keep as is
        if clean_word in self.vocab:
            return word

        # Rule 4: Fuzzy Levenshtein matching against domain vocabulary
        if len(clean_word) >= 3:
            # Cutoff = 0.80 ensures high confidence match only
            matches = difflib.get_close_matches(clean_word, list(self.vocab), n=1, cutoff=0.80)
            if matches:
                corrected = matches[0]
                if word.isupper():
                    return corrected.upper()
                elif word.istitle():
                    return corrected.capitalize()
                return corrected

        # Rule 5: Low confidence -> Keep original word
        return word

    def correct_sentence(self, sentence):
        """
        Correct an entire sentence while preserving punctuation, numbers, and spacing.
        Returns tuple: (corrected_sentence, was_corrected)
        """
        if not sentence or not isinstance(sentence, str):
            return sentence, False

        # Tokenize preserving spaces & punctuation
        tokens = re.findall(r'[A-Za-z0-9-£$€@.]+|[^A-Za-z0-9-£$€@.\s]+|\s+', sentence)
        corrected_tokens = []
        was_corrected = False

        for token in tokens:
            if re.match(r'^[A-Za-z0-9-£$€@.]+$', token):
                corrected = self.correct_word(token)
                if corrected.lower() != token.lower():
                    was_corrected = True
                corrected_tokens.append(corrected)
            else:
                corrected_tokens.append(token)

        corrected_sentence = "".join(corrected_tokens)
        return corrected_sentence, was_corrected

# Global instance for app-wide use
spell_corrector = DomainSpellCorrector()
