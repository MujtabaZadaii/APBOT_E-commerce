import nltk
from nltk.stem import WordNetLemmatizer
import numpy as np
from chatbot.spell_corrector import spell_corrector

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

def correct_word(word, vocabulary=None):
    """
    Fuzzy correct typos in English & Roman Urdu using DomainSpellCorrector
    """
    return spell_corrector.correct_word(word)

def correct_sentence(sentence):
    """
    Correct entire sentence prior to NLP processing
    """
    return spell_corrector.correct_sentence(sentence)

def lemmatize(word):
    """
    Lemmatize word to its root form
    """
    return lemmatizer.lemmatize(word.lower())

def bag_of_words(tokenized_sentence, all_words):
    """
    Return bag of words array with fuzzy typo tolerance for English & Roman Urdu
    """
    spell_corrector.add_vocabulary(all_words)
    corrected_tokens = [lemmatize(correct_word(w, all_words)) for w in tokenized_sentence]
    bag = np.zeros(len(all_words), dtype=np.float32)
    for idx, w in enumerate(all_words):
        if w in corrected_tokens:
            bag[idx] = 1.0
    return bag
