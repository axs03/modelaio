import dspy
import asyncio
from pydantic import BaseModel

RED = "\033[91m"
YELLOW = "\033[93m"
GREEN = "\033[92m"
RESET = "\033[0m"

class ChatPayloadObject(BaseModel):
    model_name: str
    secret: str # needs to be encrypted
class ChatPayloadResponseObjectNoScore(BaseModel):
    model_name: str
    response: str

class LLMController():
    STATUS = str("OK")
    def __init__(self):
        self.models = {
            # "model_name" : base_url
            "openai/gpt-4o-mini" : None,
            "deepseek/deepseek-chat" : "https://api.deepseek.com",
            "claude-3-7-sonnet-20250219" : "https://api.anthropic.com"
        }


    def _create_model(self, model_name: str, api_key: str, base_url: str) -> dspy.LM:
        """Create a model instance based on the model name and API key."""
        try:
            if model_name not in self.models.keys():
                LLMController.STATUS = f"{RED}Model {model_name} is not supported.{RESET}"
                raise Exception(f"Model {model_name} is not supported.")
            
            # decrypt the secret here, currently assuming the keys are all okay
        except Exception as e:
            LLMController.STATUS = f"{RED}{e}{RESET}"
            raise

        try:
            model_instance = dspy.LM(
                model_name,
                api_key=api_key,
                base_url=base_url
            )

            return model_instance
        
        except Exception as e:
            LLMController.STATUS = f"{RED}{e}{RESET}"
            raise Exception(f"Error in initializing models: {e}")


    async def _get_single_response(self, model_name: str, secret: str,prompt: str):
        """Get a single response from the model."""
        try:
            model_instance = self._create_model(
                model_name=model_name,
                api_key=secret,
                base_url=self.models[model_name]
            )

            model_response = await model_instance.aforward(prompt)

            print(f"{RED}{model_response.choices[0].message.content}{RESET}")

            return model_response.choices[0].message.content # extracts the content from the response

        except Exception as e:
            LLMController.STATUS = f"{RED}{e}{RESET}"
            raise Exception(f"Error in generating the response: {e}")


    async def get_responses_async(self, selected_models: list, prompt: str):
        """Get responses from the selected models based on the user prompt."""
        tasks = []
        try:
            for model in selected_models:
                task = self._get_single_response( # async func is coroutine, doesn't run yet
                    model_name=model.model_name,
                    secret=model.secret,
                    prompt=prompt
                )
                tasks.append(task)

            generated_responses = await asyncio.gather(*tasks, return_exceptions=True) # unpack all the tasks

            # check if the recieved response is valid, otherwise return error string for the model
            responses = []
            for i, response in enumerate(generated_responses):
                if isinstance(response, Exception):
                    responses.append(
                        ChatPayloadResponseObjectNoScore(
                            model_name=selected_models[i].model_name,
                            response="There was an error generating an answer. Please try again later."
                        )
                    )
                else:
                    responses.append(
                        ChatPayloadResponseObjectNoScore(
                            model_name=selected_models[i].model_name,
                            response=str(response))
                    )

            print(f"{RED}{responses}{RESET}")
            return responses

        except Exception as e:
            LLMController.STATUS = f"{RED}{e}{RESET}"
            raise Exception(f"Error in generating the responses: {e}")