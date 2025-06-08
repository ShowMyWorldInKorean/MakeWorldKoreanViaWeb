import os
import base64
import uuid
import logging
from io import BytesIO
from PIL import Image
from database.mongodb import db
from services import OCRProcessor
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)
ocr_processor = OCRProcessor('korean')

async def detect_text_in_image(user_id: str, image_base64: str):
    # Base64 이미지 디코딩
    image_id = str(uuid.uuid4())
    SAVE_PATH = os.getenv('SAVE_PATH')
    ORIGIN_IMAGE_PATH = os.path.join(SAVE_PATH, "origin", f"{image_id}.jpg")
    
    try:
        image_data = base64.b64decode(image_base64)
        image = Image.open(BytesIO(image_data))
        os.makedirs(os.path.dirname(ORIGIN_IMAGE_PATH), exist_ok=True)
        image.save(ORIGIN_IMAGE_PATH)
        logger.info(f"✅ Image Save Successful: {ORIGIN_IMAGE_PATH}")
    except Exception as e:
        raise ValueError(f" ❌Invalid Image Data: {str(e)}")

    # OCR
    ocr_result = await ocr_processor.detect_text_in_image(ORIGIN_IMAGE_PATH)
    
    # OCR 결과를 API 응답 형식으로 변환
    detected_text_blocks = {}
    for block_id, block_data in ocr_result.items():
        # bbox 형식 변환: [x1, y1, x2, y2] -> [[x1, y1], [x2, y1], [x2, y2], [x1, y2]]
        x1, y1, x2, y2 = block_data["bbox"]
        formatted_bbox = [
            [x1, y1],  # 좌측 상단
            [x2, y1],  # 우측 상단
            [x2, y2],  # 우측 하단
            [x1, y2]   # 좌측 하단
        ]
        
        detected_text_blocks[block_id] = {
            "bbox": formatted_bbox,
            "detectedText": block_data["txt"]
        }

    # MongoDB에 감지 결과 저장
    database = db.get_database()
    user_id = user_id or str(uuid.uuid4()) # 사용자 ID가 제공되지 않은 경우 생성
    
    try:
        document = {
            "userId": user_id,
            "imageId": image_id,
            "originalOcrResult": ocr_result,
            "originalImage": image_base64,
            "detectedTextBlocks": detected_text_blocks
        }
        
        # 문서 저장
        await database.text_detections.insert_one(document)
        logger.info(f"✅ Text Detection MongoDB Save Success: {user_id}")
        
    except Exception as e:
        # 저장 실패 시 로그만 출력하고 진행 (API는 정상 작동하도록)
        logger.error(f"❌ Text Detection MongoDB Save Error: {user_id}, {str(e)}")
    
    response_data = {
        "userId": user_id,
        "imageId": image_id,
        "detectedTextBlocks": detected_text_blocks
    }
    
    return response_data