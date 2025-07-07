import os
import json
import logging
import base64
import tempfile
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from PIL import Image
from io import BytesIO
from srnet_processor import *
from typing import Dict, Any

app = FastAPI(title="SRNet API", description="Scene Text Replacement Network API", version="0.1.0")
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ProcessRequest(BaseModel):
    image_id: str
    user_id: str
    image_base64: str
    i_s_info: Dict[str, Any]
    para_info: Dict[str, Any]

class SuccessResponse(BaseModel):
    success: bool
    message: str
    data: Dict[str, Any]

class ErrorResponse(BaseModel):
    success: bool
    message: str

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/process", response_model=SuccessResponse)
async def process_image(request: ProcessRequest):
    try:
        image_id = request.image_id
        user_id = request.user_id
        image_base64 = request.image_base64
        i_s_info = request.i_s_info
        para_info = request.para_info
        
        logger.info(f"🚀 Starting SRNet processing for {user_id}_{image_id}")
        
        # Create temporary working directory
        with tempfile.TemporaryDirectory() as temp_dir:
            # Set up paths
            work_dir = temp_dir
            os.environ['SAVE_PATH'] = work_dir
            
            # Create required directories
            os.makedirs(f"{work_dir}/origin", exist_ok=True)
            os.makedirs(f"{work_dir}/i_t_utils", exist_ok=True)
            
            # Decode and save image
            image_data = base64.b64decode(image_base64)
            image = Image.open(BytesIO(image_data))
            image_path = f"{work_dir}/origin/{image_id}.jpg"
            image.save(image_path, format="JPEG")
            
            # Save JSON data
            with open(f"{work_dir}/i_s_info.json", 'w') as f:
                json.dump(i_s_info, f)
            with open(f"{work_dir}/para_info.json", 'w') as f:
                json.dump(para_info, f)
            
            # Create gray background for i_t generation
            gray_bg = Image.new('RGB', (256, 128), color=(121, 127, 141))
            gray_bg.save(f"{work_dir}/i_t_utils/gray_bg_256x128.png")
            
            # Execute SRNet processing pipeline
            try:
                logger.info("📋 Step 1: Generating crops...")
                generate_crops()
                
                logger.info("🔧 Step 2: Modifying crops...")
                modify_crops()
                
                logger.info("📝 Step 3: Generating i_t...")
                generate_i_t()
                
                logger.info("🎭 Step 4: Making masks...")
                make_masks()
                
                logger.info("🧹 Step 5: Scene text eraser...")
                scene_text_eraser()
                
                logger.info("🏗️ Step 6: Making output base...")
                make_output_base()
                
                logger.info("🎨 Step 7: Making bg...")
                make_bg()
                
                logger.info("🎯 Step 8: Generating o_t...")
                generate_o_t()
                
                logger.info("🎪 Step 9: Blending o_t bg...")
                blend_o_t_bg()
                
                logger.info("🖼️ Step 10: Creating final images...")
                create_final_images()
                
                # Get final result and convert to base64
                output_dir = f"{work_dir}/output"
                if os.path.exists(output_dir):
                    output_files = os.listdir(output_dir)
                    if output_files:
                        # Load the first output file
                        output_path = os.path.join(output_dir, output_files[0])
                        result_image = Image.open(output_path)
                        
                        # Convert to base64
                        buffered = BytesIO()
                        result_image.save(buffered, format="JPEG")
                        result_base64 = base64.b64encode(buffered.getvalue()).decode()
                        
                        logger.info(f"✅ SRNet processing completed successfully for {user_id}_{image_id}")
                        return {
                            "success": True,
                            "message": "SRNet processing completed successfully",
                            "data": {
                                "image_base64": result_base64,
                                "image_id": image_id,
                                "user_id": user_id
                            }
                        }
                
                logger.error(f"❌ No output files generated for {user_id}_{image_id}")
                raise HTTPException(status_code=500, detail="No output files generated")
                
            except Exception as e:
                logger.error(f"❌ Error during processing: {str(e)}")
                raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
            
    except Exception as e:
        logger.error(f"❌ Request processing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Request failed: {str(e)}")
