import nltk
from nltk.stem import WordNetLemmatizer
import json

lemmatizer = WordNetLemmatizer()
import pickle
import numpy as np
import json
import random
from keras.models import load_model
import os

current_location = os.getcwd()
print("Current Location:", current_location)

nltk.download("punkt")
nltk.download("wordnet")
model = load_model("./chatbot/utils/chatbot_model.h5")
intents = json.loads(open("./chatbot/utils/intents.json", encoding="utf-8").read())
words = pickle.load(open("./chatbot/utils/words.pkl", "rb"))
classes = pickle.load(open("./chatbot/utils/classes.pkl", "rb"))


def hello():
    return json.dumps({"Keyword": "Connection Success"})


def decrypt(message):
    string = message
    new_string = string.replace("+", " ")
    return new_string


def clean_up_sentence(sentence):
    sentence_words = nltk.word_tokenize(sentence)
    sentence_words = [lemmatizer.lemmatize(word.lower()) for word in sentence_words]
    return sentence_words


def bag_of_words(sentence, words, show_details=True):
    sentence_words = clean_up_sentence(sentence)
    bag = [0] * len(words)

    for s in sentence_words:
        for i, w in enumerate(words):
            if w == s:
                bag[i] = 1
                if show_details:
                    print("found in bag: %s" % w)

    return np.array(bag)


def predict_class(sentence, model):
    print("This is predict class")
    print(sentence, model)
    p = bag_of_words(sentence, words, show_details=False)
    res = model.predict(np.array([p]))[0]
    ERROR_THRESHOLD = 0.5
    result = [[i, r] for i, r in enumerate(res) if r > ERROR_THRESHOLD]
    result.sort(key=lambda x: x[1], reverse=True)
    result_list = []

    for r in result:
        result_list.append({"intent": classes[r[0]], "probability": str(r[1])})
    print("result list is", result_list)
    return result_list


def getResponse(ints, intents_json):
    tag = ints[0]["intent"]
    list_of_intents = intents_json["intents"]
    for i in list_of_intents:
        if i["tag"] == tag:
            result = random.choice(i["responses"])
            break
    return result


import spellchecker


def chatbot_response(message):
    spell = spellchecker.SpellChecker()
    misspelled = spell.unknown(message.split())
    print(misspelled)
    if misspelled:
        return "Oops! I noticed a few spelling errors. Could you please check your spelling and try again?"
    try:
        print("Checking Intent")
        print("Message is:", message)
        intent = predict_class(message, model)
        print("intent:", intent)

        if intent[0]["intent"] == "goodbye" and float(intent[0]["probability"]) > 0.5:
            return "I'm sorry, I didn't quite catch that. Could you please rephrase your question or provide more details? If it's an emergency, please call your local emergency services."
        res = getResponse(intent, intents)
    except Exception as e:
        print("excecption is", e)
        res = "I'm sorry, I'm having trouble understanding your question. Could you please rephrase it or provide more details?"
    return res


def query_chatbot(sentence):
    decrypt_msg = decrypt(sentence)
    response = chatbot_response(decrypt_msg)
    json_obj = json.dumps({"top": {"response": response}})
    return response
