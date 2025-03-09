import base64
import uuid
from io import BytesIO
from PIL import Image
from database.mongodb import db

import logging
logger = logging.getLogger(__name__)

async def detect_text_in_image(user_id: str, image_base64: str):
    # Base64 이미지 디코딩
    try:
        image_data = base64.b64decode(image_base64)
        image = Image.open(BytesIO(image_data))
    except Exception as e:
        raise ValueError(f" ❌Invalid Image Data: {str(e)}")
    
    # 이미지를 위한 고유 ID 생성
    image_id = str(uuid.uuid4())
    
    # OCR 서비스 호출

    # 예시 OCR 결과 (실제로는 OCR 모델 호출 결과를 사용)
    ocr_result = { 
        "100_3": { "txt": "Footpath", "bbox": [ 154.93, 122.1, 411.07, 186.9 ] },
        "100_4": { "txt": "To", "bbox": [ 435.97, 117.4, 508.03, 180.6 ] }, 
        "100_0": { "txt": "Greenstead", "bbox": [ 71.21, 254.4, 382.79, 327.6 ] }, 
        "100_2": { "txt": "and", "bbox": [ 390.12, 184.0, 492.88, 252.0 ] }, 
        "100_1": { "txt": "Colchester", "bbox": [ 67.41, 193.1, 362.59, 249.9 ] }
    }
    
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
            "detectedTextBlocks": detected_text_blocks,
            "originalOcrResult": ocr_result,
            "originalImage": image_base64
        }
        
        # 문서 저장
        await database.text_detections.insert_one(document)
        logger.info(f"✅ Text Detection MongoDB Save Success: {user_id}")
        
    except Exception as e:
        # 저장 실패 시 로그만 출력하고 진행 (API는 정상 작동하도록)
        logger.error(f"❌ Text Detection MongoDB Save Error: {user_id}, {str(e)}")
    
    # 응답 준비
    response_data = {
        "userId": user_id,
        "imageId": image_id,
        "detectedTextBlocks": detected_text_blocks
    }
    
    return response_data