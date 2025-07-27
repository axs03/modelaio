import os
import dspy
import json

class LLMController():
    def __init__(self):
        self.models = {
            "openai/gpt-4o-mini" : ["OPENAI_API_KEY", None],
            "deepseek/deepseek-chat" : ["DEEPSEEK_API_KEY", "https://api.deepseek.com"],
            "claude-3-7-sonnet-20250219" : ["ANTHROPIC_API_KEY", "https://api.anthropic.com"]
        }
        self.init_models()


    def init_models(self):
        self.initialized_models = dict()

        try:
            for model_name, (env_var, base_url) in self.models.items():
                api_key = os.environ.get(env_var)
                model_instance = dspy.LM(
                    model_name,
                    api_key=api_key,
                    base_url=base_url
                )

                self.initialized_models[model_name] = model_instance
        except Exception as e:
            raise Exception(f"Error in initializing models: {e}")


    def get_response(self, selected_model_names: list, prompt: str):
        responses = {}
        try:
            for model_name in selected_model_names:
                if model_name in self.initialized_models.keys():
                    response = self.initialized_models[model_name](prompt)
                    responses[model_name] = response
        except Exception as e:
            raise Exception(f"Error in generating the responses: {e}")

        return responses