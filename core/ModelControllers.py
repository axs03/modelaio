import dspy
from pydantic import BaseModel
from typing import List

class ChatPayloadObject(BaseModel):
    model_name: str
    secret: str # needs to be encrypted
class ChatPayloadResponseObject(BaseModel):
    model_name: str
    response: str

class LLMController():
    def __init__(self):
        self.models = {
            # "model_name" : base_url
            "openai/gpt-4o-mini" : None,
            "deepseek/deepseek-chat" : "https://api.deepseek.com",
            "claude-3-7-sonnet-20250219" : "https://api.anthropic.com"
        }


    def create_model(self, model_name: str, api_key: str, base_url: str) -> dspy.LM:
        """Create a model instance based on the model name and API key."""
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


    def get_response(self, selected_models, prompt: str):
        """Get responses from the selected models based on the user prompt."""
        responses = []
        try:
            for model in selected_models:
                name = model.model_name
                secret = model.secret

                model_instance = self.create_model(
                    model_name=name,
                    api_key=secret,
                    base_url=self.models[name]
                )

                response = model_instance(prompt)

                responses.append(ChatPayloadResponseObject(
                    model_name=name,
                    response=response[0] # text in the response
                ))

        except Exception as e:
            raise Exception(f"Error in generating the responses: {e}")

        return responses