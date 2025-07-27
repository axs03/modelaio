from .SimilarityModel import SimilarityModel
from .ModelControllers import LLMController
from pydantic import BaseModel
from typing import List

class SimilarityPayloadObjects(BaseModel):
    model_name: str
    content: str

class SimilarityPayload(BaseModel):
    base_model_idx: int
    inputs: List[SimilarityPayloadObjects]

class SimilarityResponse(BaseModel):
    base_model_name: str
    response: List[SimilarityPayloadObjects]
    scores: List[float]


class ChatPayloadObjects(BaseModel):
    model_name: str
    secret: str # needs to be encrypted

class ChatPayload(BaseModel):
    models: List[ChatPayloadObjects]
    prompt: str

__all__ = ["SimilarityModel", "SimilarityPayload", "SimilarityResponse", "ChatPayload"]