from fastapi import FastAPI, HTTPException
from core import (
    SimilarityModel, LLMController
)
from pydantic import BaseModel
from typing import List

app = FastAPI()
sim = SimilarityModel()
llms = LLMController()


class ChatPayloadObject(BaseModel):
    model_name: str
    secret: str # needs to be encrypted
class ChatPayload(BaseModel):
    base_model_idx: int # index of the base model in the models list
    models: List[ChatPayloadObject] # list of models with their names and encrypted secrets
    prompt: str # query by the user
class ChatPayloadResponse(BaseModel):
    base_model_name: str # name of the base model
    responses: list # list of the responses from the models
    scores: list # list of the scores for each response


@app.get(f"/")
def read_root():
    return {
        "message": "Welcome to the model.aio backend!",
        "status": sim.STATUS
    }


@app.post("/get_responses_with_similarity")
async def get_responses_with_similarity(payload: ChatPayload):
    try:
        scores = []
        responses = await llms.get_responses_async(
            selected_models=payload.models, # contains the encrypted secret and the model name
            prompt=payload.prompt
        )


        base_model_response = responses[payload.base_model_idx].response # keep track of base model response
        print(f"Base model response: {base_model_response}")
        for response_idx in range(len(responses)):
            if response_idx == payload.base_model_idx:
                print(f"Skipping base model response at index {response_idx}")
                continue # skip current iteration

            # Compute cosine similarity with the base model response
            curr_model_response = responses[response_idx].response
            similarity_score = float(sim.get_cosine_similarity(base_model_response, curr_model_response))
            scores.append(
                {
                    "model_name": payload.models[response_idx].model_name,
                    "similarity_score": similarity_score
                }
            )

        return ChatPayloadResponse(
            base_model_name=payload.models[payload.base_model_idx].model_name,
            responses=responses,
            scores=scores
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error in generating responses: {str(e)}"
        )


@app.post("/get_responses")
async def get_responses(payload: ChatPayload):
    """Endpoint to get responses from the models based on the user prompt."""
    try:
        responses = await llms.get_responses_async(
            selected_models=payload.models, # contains the encrypted secret and the model name
            prompt=payload.prompt
        )

        return responses

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error in generating responses: {str(e)}"
        )
    