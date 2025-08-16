"""
This module contains the backend classes for processing the similarity score between responses
Type safe classes are also present for importing.
"""

from .SimilarityModel import SimilarityModel
from .ModelControllers import LLMController
from .types import (
    SendSingleResponsePayload, GetSingleResponseObject, SendSingleResponseObject,
    SendSimilarityScoreObject, SendSimilarityScorePayload, GetSimilarityScorePayload,
    GetSimilarityScoreObject
)

__all__ = [
    "SimilarityModel", "LLMController", "SendSingleResponsePayload",
    "GetSingleResponseObject", "SendSingleResponseObject",
    "SendSimilarityScoreObject", "SendSimilarityScorePayload",
    "GetSimilarityScorePayload", "GetSimilarityScoreObject"
]
