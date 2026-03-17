from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from core import (
    SimilarityModel, LLMController, get_responses_capable_models,
    SendSingleResponsePayload, GetSingleResponseObject, SendSimilarityScorePayload,
    GetSimilarityScorePayload, GetSimilarityScoreObject, GetAvailableModelsResponse
)
import asyncio
import json
import litellm

_available_models: list[str] = []

@asynccontextmanager
async def lifespan(app: FastAPI):
    global _available_models
    _available_models = get_responses_capable_models()
    yield

app = FastAPI(lifespan=lifespan)
sim = SimilarityModel()
llm = LLMController()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Next.js / Vite dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "Welcome to the model.aio backend!",
        "status": sim.STATUS
    }


@app.get("/models")
def get_models() -> GetAvailableModelsResponse:
    """Return all LiteLLM models that support the /responses endpoint."""
    return GetAvailableModelsResponse(models=_available_models)


@app.post("/get_similarity_score")
async def get_similarity_score(payload: SendSimilarityScorePayload) -> GetSimilarityScorePayload:
    base_model_idx = payload.base_model_idx

    if len(payload.content) < 2:
        raise HTTPException(
            status_code=400,
            detail="At least 2 model responses are required to compute similarity."
        )

    if base_model_idx < 0 or base_model_idx >= len(payload.content):
        raise HTTPException(
            status_code=400,
            detail="base_model_idx is out of range for provided model responses."
        )

    base_model = payload.content[base_model_idx]
    base_model_content = base_model.content.strip()

    if not base_model_content:
        raise HTTPException(
            status_code=422,
            detail="Baseline model response cannot be empty."
        )

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
                    status_code=422,
                    detail=f"Invalid response content for similarity ({item.model_name}): {str(score)}"
                )
            results.append(GetSimilarityScoreObject(
                model_name=item.model_name,
                similarity_score=float(score) # type:ignore
            ))

        return GetSimilarityScorePayload(
            base_model_name=base_model.model_name,
            content=results
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error in computing similarity scores: {str(e)}"
        )


@app.post("/get_response")
def get_response(payload: SendSingleResponsePayload) -> GetSingleResponseObject:
    """Endpoint to get responses from a model based on the user prompt."""
    try:
        response = llm.get_response(
            model_name=payload.model_data.model_name,
            secret=payload.model_data.secret,
            prompt=payload.prompt
        )

        return GetSingleResponseObject(
            model_name=payload.model_data.model_name,
            response=response
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error in generating responses: {str(e)}"
        )


@app.post("/get_response_stream")
async def get_response_stream(payload: SendSingleResponsePayload):
    """Streaming SSE endpoint for model responses."""
    # Capture values upfront so the async generator closure holds primitives
    model_name = payload.model_data.model_name
    api_key = payload.model_data.secret.strip()
    prompt = payload.prompt

    async def event_generator():
        try:
            response = await litellm.acompletion(
                model=model_name,
                messages=[{"role": "user", "content": prompt}],
                api_key=api_key,
                stream=True,
            )
            async for chunk in response:
                delta = chunk.choices[0].delta.content
                if delta:
                    yield f"data: {json.dumps({'content': delta})}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: {json.dumps({'error': str(e)})}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
    