import nltk
from nltk.stem import WordNetLemmatizer
import numpy as np

# Download necessary NLTK packages on first run
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/wordnet')
except LookupError:
    nltk.download('wordnet')

lemmatizer = WordNetLemmatizer()

def tokenize(sentence):
    """
    Split sentence into array of words/tokens
    """
    return nltk.word_tokenize(sentence)

def lemmatize(word):
    """
    Lemmatize word to its root form
    """
    return lemmatizer.lemmatize(word.lower())

def bag_of_words(tokenized_sentence, all_words):
    """
    Return bag of words array:
    1 for each known word that exists in the sentence, 0 otherwise
    """
    tokenized_sentence = [lemmatize(w) for w in tokenized_sentence]
    bag = np.zeros(len(all_words), dtype=np.float32)
    for idx, w in enumerate(all_words):
        if w in tokenized_sentence:
            bag[idx] = 1.0
    return bag
