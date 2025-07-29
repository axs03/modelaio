from fastapi import FastAPI, HTTPException
from core import (
    SimilarityModel, LLMController
)
from core.types import (
    SendSingleResponsePayload, GetSingleResponseObject, SendSingleResponseObject
)

app = FastAPI()
sim = SimilarityModel()
llm = LLMController()


@app.get(f"/")
def read_root():
    return {
        "message": "Welcome to the model.aio backend!",
        "status": sim.STATUS
    }


@app.post("/get_similarity_score")
async def get_similarity_score(payload):
    pass


@app.post("/get_response")
async def get_response(payload: SendSingleResponsePayload) -> GetSingleResponseObject:
    """Endpoint to get responses from a model based on the user prompt."""
    try:
        response = await llm.get_single_response_async(
            selected_model=payload.model_data, # passing the model object
            prompt=payload.prompt
        )

        return response

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error in generating responses: {str(e)}"
        )
    