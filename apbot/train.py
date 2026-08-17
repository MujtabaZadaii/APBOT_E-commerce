import json
import pickle
import numpy as np
import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from chatbot.nlp import tokenize, bag_of_words, lemmatize
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import SGD
def train_model():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    intents_path = os.path.join(base_dir, 'data', 'intents.json')
    model_dir = os.path.join(base_dir, 'model')
    words_path = os.path.join(model_dir, 'words.pkl')
    classes_path = os.path.join(model_dir, 'classes.pkl')
    model_path = os.path.join(model_dir, 'chatbot_model.keras')
    print("Loading intents from:", intents_path)
    with open(intents_path, 'r', encoding='utf-8') as f:
        intents = json.load(f)
    words = []
    classes = []
    documents = []
    ignore_letters = ['?', '!', '.', ',']
    for intent in intents['intents']:
        for pattern in intent['patterns']:
            word_list = tokenize(pattern)
            words.extend(word_list)
            documents.append((word_list, intent['tag']))
            if intent['tag'] not in classes:
                classes.append(intent['tag'])
    words = [lemmatize(word) for word in words if word not in ignore_letters]
    words = sorted(set(words))
    classes = sorted(set(classes))
    if not os.path.exists(model_dir):
        os.makedirs(model_dir)
    pickle.dump(words, open(words_path, 'wb'))
    pickle.dump(classes, open(classes_path, 'wb'))
    print("Preparing training data...")
    training = []
    output_empty = [0] * len(classes)
    for document in documents:
        bag = bag_of_words(document[0], words)
        output_row = list(output_empty)
        output_row[classes.index(document[1])] = 1
        training.append([bag, output_row])
    import random
    random.shuffle(training)
    training = np.array(training, dtype=object)
    train_x = list(training[:, 0])
    train_y = list(training[:, 1])
    print("Building model architecture...")
    model = Sequential()
    model.add(Dense(128, input_shape=(len(train_x[0]),), activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(64, activation='relu'))
    model.add(Dropout(0.5))
    model.add(Dense(len(train_y[0]), activation='softmax'))
    sgd = SGD(learning_rate=0.01, decay=1e-6, momentum=0.9, nesterov=True)
    model.compile(loss='categorical_crossentropy', optimizer=sgd, metrics=['accuracy'])
    print("Training model...")
    hist = model.fit(np.array(train_x), np.array(train_y), epochs=200, batch_size=5, verbose=1)
    print(f"Saving model to {model_path}...")
    model.save(model_path)
    print("Done!")
if __name__ == "__main__":
    train_model()
