from pydantic import BaseModel

class SendSingleResponseObject(BaseModel):
    model_name: str
    secret: str

class SendSingleResponsePayload(BaseModel):
    model_data: SendSingleResponseObject
    prompt: str

class GetSingleResponseObject(BaseModel):
    model_name: str
    response: str


class SendSimilarityScoreObject(BaseModel):
    model_name: str
    content: str

class SendSimilarityScorePayload(BaseModel):
    base_model_idx: int
    content: list[SendSimilarityScoreObject]

class GetSimilarityScoreObject(BaseModel):
    model_name: str
    similarity_score: float

class GetSimilarityScorePayload(BaseModel):
    base_model_name: str
    content: list[GetSimilarityScoreObject]