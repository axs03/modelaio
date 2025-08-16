from fastapi import FastAPI, HTTPException
from core import (
    SimilarityModel, LLMController,
    SendSingleResponsePayload, GetSingleResponseObject, SendSimilarityScorePayload, 
    GetSimilarityScorePayload, GetSimilarityScoreObject
)
import asyncio

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
async def get_similarity_score(payload: SendSimilarityScorePayload) -> GetSimilarityScorePayload:
    base_model_idx = payload.base_model_idx
    base_model = payload.content[base_model_idx]
    base_model_content = base_model.content

    try:
        # similarity computations in thread pool for concurrency
        loop = asyncio.get_event_loop()
        tasks = []
        
        for item in payload.content:
            task = loop.run_in_executor(
                None,
                sim.get_cosine_similarity,
                base_model_content,
                item.content
            )
            tasks.append(task)

        scores = await asyncio.gather(*tasks, return_exceptions=True)

        results = []
        for i, (item, score) in enumerate(zip(payload.content, scores)):
            if i == base_model_idx:
                continue # do not include the base model in results

            if isinstance(score, Exception):
                raise HTTPException(
                    status_code=500,
                    detail=f"Error computing similarity for {item.model_name}: {str(score)}"
                )
            results.append(GetSimilarityScoreObject(
                model_name=item.model_name,
                similarity_score=float(score) # type:ignore
            ))

        return GetSimilarityScorePayload(
            base_model_name=base_model.model_name,
            content=results
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error in computing similarity scores: {str(e)}"
        )


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
    