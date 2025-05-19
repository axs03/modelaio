import streamlit as st
import random
import time

# App title and layout configuration
title = "model.aio Chat"
chat_input_placeholder = "Enter your prompt here..."

st.set_page_config(
    page_title=title,
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="collapsed",
)

st.title(title)

# sidebar stuff
st.sidebar.title("Model Selection")
st.sidebar.write("Model response comparisons:")
selected_models = {
    "ChatGPT": st.sidebar.checkbox("ChatGPT", key="chgpt"),
    "DeepSeek": st.sidebar.checkbox("DeepSeek", key="dpsk"),
}

# session state
if "messages" not in st.session_state:
    st.session_state.messages = []

# chat history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# test response
def response_generator():
    response = random.choice(
        [
            "Hello there! How can I assist you today?",
            "Hi, human! Is there anything I can help you with?",
            "Do you need help?",
        ]
    )
    for word in response.split():
        yield word + " "
        time.sleep(0.1)

# Accept user input
if prompt := st.chat_input(chat_input_placeholder):
    # Display and store user message
    with st.chat_message("user"):
        st.markdown(prompt)
    st.session_state.messages.append({"role": "user", "content": prompt})

    # Display assistant response in chat message container
    with st.chat_message("assistant"):
        response = st.write_stream(response_generator())
    # Add assistant response to chat history
    st.session_state.messages.append({"role": "assistant", "content": response})