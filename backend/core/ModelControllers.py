import litellm
from litellm import completion

RED = "\033[91m"
YELLOW = "\033[93m"
GREEN = "\033[92m"
RESET = "\033[0m"


def get_responses_capable_models() -> list[str]:
    """Return all LiteLLM models that support the /responses endpoint (chat-mode models)."""
    models = []
    for model_name, model_info in litellm.model_cost.items():
        if isinstance(model_info, dict) and model_info.get("mode") == "chat":
            models.append(model_name)
    return sorted(models)


class LLMController():
    STATUS = str("OK")
    def __init__(self):
        self.models = {
            "openai/gpt-4o" : None,
            "anthropic/claude-3-sonnet-20240229" : None,
            "xai/grok-2-latest" : None,
            "ollama/llama2" : "http://localhost:11434", # TODO: impl dynamic port
            "deepseek/deepseek-chat" : "https://api.deepseek.com",
            "claude-3-7-sonnet-20250219" : "https://api.anthropic.com"
        }


    def get_response(self, model_name: str, secret: str, prompt: str):
        """Get a response from one single model."""
        base_url = self.models.get(model_name, None)

        conds = (model_name in self.models.keys(), secret is not None, prompt is not None)
        if all(conds) and base_url is not None:
            try:
                response = completion(
                    model=model_name,
                    messages=[
                        {"role": "user", "content": prompt}
                    ],
                    api_key=secret,
                    base_url=base_url,
                )
            except Exception as e:
                raise Exception(f"error in generating w/ base_url: {e}")
        elif all(conds):
            try:
                response = completion(
                    model=model_name,
                    messages=[
                        {"role": "user", "content": prompt}
                    ],
                    api_key=secret,
                )
            except Exception as e:
                raise Exception(f"error in generating w/o base_url: {e}")

        text = response['choices'][0]['message']['content'] # type: ignore
        return text