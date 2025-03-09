from typing import Dict, List, Any
from pydantic import BaseModel

class TextBlock(BaseModel):
    bbox: List[List[int]]
    detectedText: str

class BaseResponse(BaseModel):
    success: bool = True
    message: str
    data: Dict[str, Any] = {}

class TextDetectionResponse(BaseResponse):
    message: str = "텍스트 감지 완료"

class TranslationResponse(BaseResponse):
    message: str = "번역 완료"