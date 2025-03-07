from fastapi import APIRouter, HTTPException
from models.request import TextDetectionRequest
from models.response import TextDetectionResponse
from services.text_detection import detect_text_in_image

import logging
logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/api/v1/text-detection", response_model=TextDetectionResponse)
async def text_detection(request: TextDetectionRequest):
    try:
        logger.info(f"✅ Text Detection Request: {request.userId}")
        detection_result = await detect_text_in_image(
            request.userId, 
            request.originalImage
        )
        
        logger.info(f"✅ Text Detection Success: {request.userId}")
        return {
            "success": True,
            "message": "텍스트 감지 완료",
            "data": detection_result
        }
    except ValueError as e:
        logger.error(f"❌ Text Detection Failure: {request.userId}, {str(e)}")
        return {
            "success": False,
            "message": str(e),
            "data": {}
        }
    except Exception as e:
        logger.error(f"❌ Text Detection Server Error: {request.userId}, {str(e)}")
        raise HTTPException(status_code=500, detail=f"Text Detection Server Error: {str(e)}")