import os
import json
import pickle
import numpy as np
from tensorflow.keras.models import load_model
from chatbot.nlp import tokenize, bag_of_words
class ApBotPredictor:
    def __init__(self, model_path='model/chatbot_model.keras', words_path='model/words.pkl', classes_path='model/classes.pkl', intents_path='data/intents.json'):
        self.model_path = model_path
        self.words_path = words_path
        self.classes_path = classes_path
        self.intents_path = intents_path
        self.model = None
        self.words = []
        self.classes = []
        self.intents = {}
        self.load_data()
    def load_data(self):
        base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
        full_model_path = os.path.join(base_dir, self.model_path)
        full_words_path = os.path.join(base_dir, self.words_path)
        full_classes_path = os.path.join(base_dir, self.classes_path)
        full_intents_path = os.path.join(base_dir, self.intents_path)
        if os.path.exists(full_model_path):
            self.model = load_model(full_model_path)
            self.words = pickle.load(open(full_words_path, 'rb'))
            self.classes = pickle.load(open(full_classes_path, 'rb'))
            self.intents = json.loads(open(full_intents_path).read())
        else:
            print(f"Warning: Model or data files not found at {full_model_path}. Please train the model first.")
    def predict_intent(self, sentence):
        if self.model is None:
            return {"intent": "unknown", "confidence": 0.0, "message": "Model is not trained yet.", "originalMessage": sentence, "correctedMessage": sentence}
        from chatbot.nlp import correct_sentence
        corrected_text, _ = correct_sentence(sentence)
        sentence_words = tokenize(corrected_text)
        bow = bag_of_words(sentence_words, self.words)
        res = self.model.predict(np.array([bow]))[0]
        ERROR_THRESHOLD = 0.5
        results = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
        if not results:
            return {
                "intent": "unknown",
                "confidence": max(res) if len(res) > 0 else 0.0,
                "message": "I'm not entirely sure how to help with that. Could you try rephrasing?",
                "originalMessage": sentence,
                "correctedMessage": corrected_text
            }
        results.sort(key=lambda x: x[1], reverse=True)
        intent_tag = self.classes[results[0][0]]
        confidence = float(results[0][1])
        import random
        response_text = ""
        for intent in self.intents['intents']:
            if intent['tag'] == intent_tag:
                response_text = random.choice(intent['responses'])
                break
        return {
            "intent": intent_tag,
            "confidence": confidence,
            "message": response_text,
            "originalMessage": sentence,
            "correctedMessage": corrected_text
        }
