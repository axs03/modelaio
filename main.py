from fastapi import FastAPI, HTTPException
from core import (
    SimilarityModel, LLMController
)
from pydantic import BaseModel
from typing import List

app = FastAPI()
sim = SimilarityModel()
llms = LLMController()
VERSION = "v1"


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


@app.get(f"/{VERSION}")
def read_root():
    return {
        "message": "Welcome to the model.aio backend!",
        "status": sim.STATUS
    }


@app.post(f"/{VERSION}/chat")
def chat(payload: ChatPayload):
    try:
        responses = llms.get_response(
            selected_models=payload.models, # contains the encrypted secret and the model name
            prompt=payload.prompt
        )

        return ChatPayloadResponse(
            base_model_name=payload.models[payload.base_model_idx].model_name,
            responses=responses,
            scores=[1.0] * len(responses)  # assuming equal scores for simplicity
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error in generating responses: {str(e)}"
        )

# post request to find cosine similarity between two chunks of text
"""
{
    "base_model_idx": 1,
    "inputs": [
        {
            "model_name": "name of model",
            "content": "this is base sentence"
        },
        {
            "model_name": "name of another model",
            "content": "this is another sentence"
        },
        {
            "model_name": "name of different model",
            "content": "this is a different sentence"
        },
        .....
    ]
}

The base model will always be the first input in the inputs list.
"""
# @app.post(f"/{VERSION}/similarity")
# async def compute_similarity(payload: SimilarityPayload):
#     try:
#         # two models are required to compare responses
#         if len(payload.inputs) < 2:
#             raise HTTPException(
#                 status_code = 400, 
#                 detail="Two models are required to compare responses."
#                 )
        
#         # get the base model
#         base_model = payload.base_model_idx
#         if base_model < 0 or base_model >= len(payload.inputs):
#             raise HTTPException(
#                 status_code=400,
#                 detail=f"base_model_idx {base_model} is out of range. It must be between 0 and {len(payload.inputs) - 1}."
#             )

#         scores = []
#         for i in range(len(payload.inputs)):
#             if i == base_model:
#                 continue # skip this iteration if it is the base model

#             similarity_score = float(sim.get_cosine_similarity(payload.inputs[base_model].content, payload.inputs[i].content))
#             scores.append(similarity_score)

#         return SimilarityResponse(
#             base_model_name=payload.inputs[base_model].model_name,
#             response=payload.inputs,
#             scores=scores
#         )
#     # error catch for failed result
#     except Exception as e:
#         return {
#             "error": str(e),
#         }