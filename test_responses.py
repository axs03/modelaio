import random
import time

# sample response
def response_generator():
    response = random.choice(
        [
            "Hello there! How can I assist you today?",
            "Hi, human! Is there anything I can help you with?",
            "Do you need help?",
            "Greetings! What can I do for you?",
            "Hey! How's it going?",
            "Hello! What brings you here?",
            "Hi! How can I be of service?",
            "Hello! What can I assist you with?",
            "Hi! How can I help you today?",
        ]
    )
    for word in response.split():
        yield word + " "
        time.sleep(0.1)