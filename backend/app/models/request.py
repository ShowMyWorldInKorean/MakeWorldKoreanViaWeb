from typing import List, Optional
from pydantic import BaseModel, Field

class TextDetectionRequest(BaseModel):
    userId: Optional[str] = None
    originalImage: str # Base64로 인코딩된 이미지 데이터

class TranslationRequest(BaseModel):
    userId: str
    imageId: str
    targetTextBlocks: List[str]
    sourceLanguage: str
    targetLanguage: str
    outputType: int = Field(ge=1, le=2) # 1=텍스트만, 2=이미지 합성