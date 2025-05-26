import os
from openai import OpenAI

class Controller:
    system_message = "You are a helpful assistant"


class LLMController(Controller):
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

    def __init__(self, provider="openai", model=None, base_url=None):
        config = self.PROVIDERS.get(provider)
        if not config:
            raise ValueError(f"Unknown provider: {provider}")

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
        return self.completion.choices[0].message.content