from fastapi import APIRouter, HTTPException
from models.request import TranslationRequest
from models.response import TranslationResponse
from services.translation import translate_text

import logging
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/api/v1/translate", response_model=TranslationResponse)
async def translate(request: TranslationRequest):
    try:
        logger.info(f"✅ Translate Request: {request.userId}")
        translation_result = await translate_text(
            request.userId,
            request.imageId,
            request.targetTextBlocks,
            request.sourceLanguage,
            request.targetLanguage,
            request.outputType
        )
        
        message = "번역 완료" if request.outputType == 1 else "번역 및 이미지 합성 완료"
        
        logger.info(f"✅ Translate Server Success: {request.userId}")
        return {
            "success": True,
            "message": message,
            "data": translation_result
        }
    except ValueError as e:
        logger.error(f"❌ Translate Server Failure: {request.userId}, {str(e)}")
        return {
            "success": False,
            "message": str(e),
            "data": {}
        }
    except Exception as e:
        logger.error(f"❌ Translate Server Error: {request.userId}, {str(e)}")
        raise HTTPException(status_code=500, detail=f"Translate Server Error: {str(e)}")