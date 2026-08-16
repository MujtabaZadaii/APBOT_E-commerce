from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import sys

# Ensure correct path resolution
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from chatbot.predictor import ApBotPredictor
predictor = ApBotPredictor()

app = Flask(__name__)
CORS(app)

@app.route('/api/apbot/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        if not data or 'message' not in data:
            return jsonify({"error": "No message provided"}), 400
            
        message = data['message']
        result = predictor.predict_intent(message)
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Error during prediction: {e}")
        return jsonify({
            "intent": "unknown", 
            "confidence": 0.0, 
            "message": "I'm having a little trouble connecting to my systems right now."
        }), 500

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "ok",
        "model_loaded": predictor.model is not None
    })

if __name__ == '__main__':
    # Run on 5001 so it doesn't conflict with Express on 5000
    app.run(host='0.0.0.0', port=5001, debug=True)
