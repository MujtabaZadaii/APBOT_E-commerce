import nltk
from nltk.stem import WordNetLemmatizer
import numpy as np
import difflib
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')
try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')
lemmatizer = WordNetLemmatizer()
ROMAN_URDU_TYPO_MAP = {
    'btao': 'batao',
    'bataoo': 'batao',
    'bataon': 'batao',
    'dikao': 'dikhao',
    'dikhayein': 'dikhao',
    'dikhaye': 'dikhao',
    'dikaho': 'dikhao',
    'chahiye': 'chahiye',
    'chahiyea': 'chahiye',
    'chahye': 'chahiye',
    'jaket': 'jacket',
    'jact': 'jacket',
    'jcket': 'jacket',
    'blck': 'black',
    'blac': 'black',
    'cheep': 'cheap',
    'cheaper': 'cheaper',
    'tsirt': 'shirt',
    'shrt': 'shirt',
    'sizez': 'size',
    'prc': 'price',
    'prce': 'price',
    'traking': 'tracking',
    'trak': 'track',
    'trck': 'track',
    'shiping': 'shipping',
    'shping': 'shipping',
    'oder': 'order',
    'ordar': 'order',
    'isnot': 'is not',
    'recevied': 'received',
    'repoart': 'report',
    'repart': 'report',
    'jcket': 'jacket',
    'jaket': 'jacket',
    'jact': 'jacket',
    'blak': 'black',
    'blck': 'black',
    'cheep': 'cheap',
    'cheaper': 'cheap',
    'similer': 'similar',
    'wht': 'what',
    'ths': 'this',
    'chekout': 'checkout',
    'optin': 'option',
    'sasta': 'cheap',
    'dikhao': 'show',
    'dikao': 'show',
    'batao': 'tell',
    'btao': 'tell',
    'chahiye': 'want',
    'chahye': 'want',
    'mehnga': 'expensive',
    'wapas': 'return',
    'wapsi': 'return'
}
def tokenize(sentence):
    """
    Split sentence into array of words/tokens
    """
    return nltk.word_tokenize(sentence)
def correct_word(word, vocabulary=None):
    """
    Fuzzy correct typos in English & Roman Urdu using Levenshtein distance
    """
    w_clean = word.lower().strip()
    if w_clean in ROMAN_URDU_TYPO_MAP:
        return ROMAN_URDU_TYPO_MAP[w_clean]
    if vocabulary and len(w_clean) > 3:
        matches = difflib.get_close_matches(w_clean, vocabulary, n=1, cutoff=0.78)
        if matches:
            return matches[0]
    return w_clean
def lemmatize(word):
    """
    Lemmatize word to its root form
    """
    return lemmatizer.lemmatize(word.lower())
def bag_of_words(tokenized_sentence, all_words):
    """
    Return bag of words array with fuzzy typo tolerance for English & Roman Urdu
    """
    corrected_tokens = [lemmatize(correct_word(w, all_words)) for w in tokenized_sentence]
    bag = np.zeros(len(all_words), dtype=np.float32)
    for idx, w in enumerate(all_words):
        if w in corrected_tokens:
            bag[idx] = 1.0
    return bag
