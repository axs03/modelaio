import litellm
from litellm import completion

RED = "\033[91m"
YELLOW = "\033[93m"
GREEN = "\033[92m"
RESET = "\033[0m"


def get_responses_capable_models() -> list[str]:
    """Return LiteLLM chat models that are unambiguously routable.

    Only models with an explicit provider prefix (e.g. 'openrouter/openai/gpt-4o',
    'deepseek/deepseek-chat') OR native OpenAI models (which litellm routes by
    default) are included. Bare alias names like 'deepseek-chat' or
    'claude-3-5-sonnet-20241022' are excluded because litellm cannot determine
    the provider from the name alone and will raise BadRequestError.
    """
    models = []
    for model_name, model_info in litellm.model_cost.items():
        if not isinstance(model_info, dict) or model_info.get("mode") != "chat":
            continue
        provider = model_info.get("litellm_provider", "")
        # Include models that carry an explicit provider in their name, or
        # OpenAI models which litellm routes without a prefix.
        if "/" in model_name or provider in ("openai", "text-completion-openai"):
            models.append(model_name)
    return sorted(models)


class LLMController():
    STATUS = str("OK")

    def get_response(self, model_name: str, secret: str, prompt: str) -> str:
        """Get a response from any LiteLLM-supported chat model."""
        if not model_name or not secret or not prompt:
            raise ValueError("model_name, secret, and prompt are all required")
        try:
            response = completion(
                model=model_name,
                messages=[{"role": "user", "content": prompt}],
                api_key=secret.strip(),
            )
        except Exception as e:
            raise Exception(f"Error generating response from {model_name}: {e}")

        text = response['choices'][0]['message']['content']  # type: ignore
        return text