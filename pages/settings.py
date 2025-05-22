import streamlit as st

st.title("Settings")

languages = ["English", "Spanish", "French"]
themes = ["Light", "Dark", "System"]

with st.form("settings_form"):
    st.write("Adjust your preferences below:")

    theme = st.selectbox("Choose a theme", themes)
    language = st.selectbox("Language", languages)
    submitted = st.form_submit_button("Save Settings")

    if submitted:
        st.success("Settings saved!")
        # store in session state
        st.session_state.settings = {
            "theme": theme,
            "language": language
        }
