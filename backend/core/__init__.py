"""
This module contains the backend classes for processing the similarity score between responses
Type safe classes are also present for importing.
"""

from .SimilarityModel import SimilarityModel
from .ModelControllers import LLMController, get_responses_capable_models
from .types import (
    SendSingleResponsePayload, GetSingleResponseObject, SendSingleResponseObject,
    SendSimilarityScoreObject, SendSimilarityScorePayload, GetSimilarityScorePayload,
    GetSimilarityScoreObject, GetAvailableModelsResponse
)

__all__ = [
    "SimilarityModel", "LLMController", "get_responses_capable_models",
    "SendSingleResponsePayload", "GetSingleResponseObject", "SendSingleResponseObject",
    "SendSimilarityScoreObject", "SendSimilarityScorePayload",
    "GetSimilarityScorePayload", "GetSimilarityScoreObject", "GetAvailableModelsResponse"
]
