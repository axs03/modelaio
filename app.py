import streamlit as st
from test_responses import response_generator

st.set_page_config(
    page_title="model.aio Chat",
    page_icon="🤖",
    layout="wide",
    initial_sidebar_state="collapsed",
)

st.title("model.aio Chat")

# Sidebar model selection
st.sidebar.title("Model Selection")
st.sidebar.write("Model response comparisons:")
selected_models = {
    "ChatGPT": st.sidebar.checkbox("ChatGPT", key="chgpt"),
    "DeepSeek": st.sidebar.checkbox("DeepSeek", key="dpsk"),
}


# Initialize session state
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])


# Accept user input
if prompt := st.chat_input("Enter your prompt here..."):
    with st.chat_message("user"):
        st.markdown(prompt)
    st.session_state.messages.append({"role": "user", "content": prompt})

    with st.chat_message("assistant"):
        response = st.write_stream(response_generator())
    st.session_state.messages.append({"role": "assistant", "content": response})