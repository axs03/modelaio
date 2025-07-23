from typing import List, Union
from fastapi import FastAPI, Query, Request, HTTPException
from pydantic import BaseModel
from core.SimilarityModel import SimilarityModel

app = FastAPI()
sim = SimilarityModel()
version = "v1"

class SimilarityPayload(BaseModel):
    inputs: List[str]

@app.get(f"/{version}")
def read_root():
    return {
        "status": "200", 
        "message": "Welcome to the model.aio backend!"
    }


# post request to find cosine similarity between two chunks of text
"""
{
    "inputs": [
        "this is one sentence"`
        "this is another sentence"
    ],
    "similarity_score": 0.8459491729736328
}
"""
@app.post(f"/{version}/similarity")
async def compute_similarity(payload: SimilarityPayload):
    try:
        if len(payload.inputs) < 2:
            raise HTTPException(
                status_code = 400, 
                detail="At least two models are required to compute cosine similarity."
                )
        
        similarity_score = float(sim.get_cosine_similarity(payload.inputs))
        return {
            "inputs": payload.inputs,
            "similarity_score": similarity_score
        }
    # error catch for failed result
    except Exception as e:
        return {
            "error": str(e),
            "message": "An error occurred while calculating similarity."
        }