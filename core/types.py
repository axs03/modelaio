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