import os
import base64
import logging
from io import BytesIO
from PIL import Image
from database.mongodb import db
from dotenv import load_dotenv
from services import exclude_key_words, detect_para

load_dotenv()
SAVE_PATH = os.getenv('SAVE_PATH')

logger = logging.getLogger(__name__)

async def translate_text(user_id: str, image_id: str, target_blocks: list, 
                       source_lang: str, target_lang: str, output_type: int):
    # MongoDB에서 저장된 감지 결과 가져오기
    database = db.get_database()
    detection = await database.text_detections.find_one({"imageId": image_id, "userId": user_id})

    if not detection:
        raise ValueError("❌ Image not found or user ID does not match")
    
    if not target_blocks:
        raise ValueError("❌ No text to translate")
    
    # 원본 BASE64 이미지 디코딩 (srnet에서 사용할 듯)
    image_data = base64.b64decode(detection["originalImage"])
    image = Image.open(BytesIO(image_data))
    
    bbox_file_path = os.path.join(SAVE_PATH, "ocr_results", f"{image_id}_bbox.json")
    
    if not os.path.exists(bbox_file_path):
            raise ValueError(f"❌ OCR result not found: {bbox_file_path}")
    
    # 번역 서비스 호출
    exclude_key_words(bbox_file_path) # 저장된 파일 대신 mongodb에 저장된 detection[detectedTextBlocks] 활용 가능
    detect_para()

    # 예시 번역 결과 (실제로는 번역 모델 호출 결과를 사용)
    translation_result = { 
        "100_0": { "ref_i_s": "100_4", "bbox": [ 154, 122, 508, 180 ], "trans_txt": "\u0915\u094b\u0932\u091a\u0947\u0938\u094d\u091f\u0930", "ratio": 0.2222222222222222 }, 
        "100_1": { "ref_i_s": "100_1", "bbox": [ 67, 193, 123, 249 ], "trans_txt": "\u0914\u0930", "ratio": 5.0 }, 
        "100_2": { "ref_i_s": "100_2", "bbox": [ 123, 193, 492, 252 ], "trans_txt": "\u0917\u094d\u0930\u0940\u0928\u0938\u094d\u091f\u0947\u0921", "ratio": 0.3 }, 
        "100_3": { "ref_i_s": "100_0", "bbox": [ 71, 254, 127, 327 ], "trans_txt": "\u0915\u0947", "ratio": 5.0 }, 
        "100_4": { "ref_i_s": "100_0", "bbox": [ 127, 254, 212, 327 ], "trans_txt": "\u0932\u093f\u090f", "ratio": 3.3333333333333335 }, 
        "100_5": { "ref_i_s": "100_0", "bbox": [ 212, 254, 382, 327 ], "trans_txt": "\u092b\u0941\u091f\u092a\u093e\u0925", "ratio": 1.6666666666666667 }
    }
    
    # 번역 결과를 API 응답 형식으로 변환
    translations = {}
    
    # 요청된 블록만 필터링
    for block_id in target_blocks:
        if block_id in translation_result:
            translations[block_id] = translation_result[block_id]["trans_txt"]
    
    # 응답 준비
    response_data = {
        "userId": user_id,
        "imageId": image_id,
        "translations": translations
    }
    
    # 출력 타입이 2인 경우, 번역된 텍스트로 새 이미지 생성
    if output_type == 2:
        try:
            # 이미지를 Base64로 변환
            buffered = BytesIO()
            image.save(buffered, format="JPEG") # image를 모델에서 생성한 번역 이미지로 변경
            img_str = base64.b64encode(buffered.getvalue()).decode()
            
            response_data["translatedImage"] = img_str
            
        except Exception as e:
            # 이미지 생성에 실패해도 번역 결과는 반환
            logger.error(f"❌ Image Creation Error: {user_id}, {str(e)}")
    
    # 번역 결과 저장
    try:
        await database.translations.insert_one({
            "userId": user_id,
            "imageId": image_id,
            "targetBlocks": target_blocks,
            "sourceLanguage": source_lang,
            "targetLanguage": target_lang,
            "translations": translations,
            "originalTranslationResult": translation_result, # 원본 번역 결과도 저장
            "outputType": output_type
        })
        logger.info(f"✅ Translation MongoDB Save Success: {user_id}")
    except Exception as e:
        # 저장 실패 시 로그만 출력하고 진행 (번역 결과는 이미 생성됨)
        logger.error(f"❌ Translation MongoDB Save Error: {user_id}, {str(e)}")
    
    return response_data
