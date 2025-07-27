import os
import dspy

class LLMController():
    def __init__(self):
        self.models = {
            # "model_name" : base_url
            "openai/gpt-4o-mini" : None,
            "deepseek/deepseek-chat" : "https://api.deepseek.com",
            "claude-3-7-sonnet-20250219" : "https://api.anthropic.com"
        }


    def create_model(self, model_name: str, api_key: str, base_url: str):
        try:
            if model_name not in self.models.keys():
                raise Exception(f"Model {model_name} is not supported.")
            
            # decrypt the secret here, currently assuming the keys are all okay
        except Exception as e:
            raise

        try:
            model_instance = dspy.LM(
                model_name,
                api_key=api_key,
                base_url=base_url
            )

            return model_instance
        
        except Exception as e:
            raise Exception(f"Error in initializing models: {e}")


    def get_response(self, selected_models: list, prompt: str):
        responses = {}
        try:
            for model in selected_models:
                model_name = model.model_name
                secret = model.secret

                model_instance = self.create_model(
                    model_name=model_name,
                    api_key=secret,  # assuming secret is the API key
                    base_url=self.models[model_name]
                )

                response = model_instance(prompt)
                responses[model_name] = response

        except Exception as e:
            raise Exception(f"Error in generating the responses: {e}")

        return responses