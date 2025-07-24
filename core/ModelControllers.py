import os
from openai import OpenAI

class LLMController():
    system_message = """You are a helpful assistant. Provide the answers to the questions based on what you know. 
                        If you don't know the answer, say 'I don't know'.
                        
                        If an answer format is not stated, use the following format to forumlate your response:
                        **Definition:** <definition>
                        **Example:** <example>
                        """
    PROVIDERS = {
        "openai": {
            "model":   "gpt-4o-mini",
            "env_var": "OPENAI_API_KEY",
            "base_url": None
        },
        "deepseek": {
            "model":   "deepseek-chat",
            "env_var": "DEEPSEEK_API_KEY",
            "base_url": "https://api.deepseek.com"
        }
    }

    def __init__(self, provider, model=None, base_url=None):
        config = self.PROVIDERS.get(provider)
        if not config:
            raise ValueError("No Provider is found, value is None")

        self.model = model or config["model"]
        ev = config["env_var"]
        self.api_key = os.environ.get(ev)
        if not self.api_key:
            raise EnvironmentError(f"Missing environment variable: {ev}")

        self.client = OpenAI(api_key=self.api_key, base_url=base_url or config["base_url"])
        self.completion = None

    def get_response(self, prompt, stream=False):
        self.completion = self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": self.system_message},
                {"role": "user",   "content": prompt}
            ],
            stream=stream
        )
        return self.completion.choices[0].message.content # type: ignore