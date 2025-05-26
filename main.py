from typing import List, Union
from fastapi import FastAPI, Query
from core.SimilarityModel import SimilarityModel

app = FastAPI()
version = "v1"

@app.get("/")
def read_root():
    return {
        "status": "200", 
        "message": "Welcome to the model.aio backend!"
    }


@app.get(f"/{version}/responses")
def get_response(models: List[str] = Query(..., description="List of model names to get responses from")):
    try:
        return {
            "model_names": models,
            "response": [f"Response from {model}" for model in models]
        }
    except Exception as e:
        return {
            "error": str(e),
            "message": "An error occurred while processing the request."
        }


@app.get(f"/{version}/similarity")
def get_similarity(model_name: str, chunk1: str, chunk2: str):
    return {
        "model_name": model_name,
        "text1": chunk1,
        "text2": chunk2,
        "similarity_score": 0.85 # placeholder
    }