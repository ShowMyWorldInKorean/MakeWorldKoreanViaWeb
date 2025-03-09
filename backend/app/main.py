from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from database.mongodb import db
from routes.text_detection import router as text_detection_router
from routes.translation import router as translation_router

import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

app = FastAPI(
    title="SMWIK API",
    description="이미지 텍스트 감지 및 번역 API",
    version="1.0.0"
)

# 추후 특정 출처로 변경
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(text_detection_router, tags=["Text Detection"])
app.include_router(translation_router, tags=["Translation"])

@app.on_event("startup")
async def startup_db_client():
    await db.connect_db()

@app.on_event("shutdown")
async def shutdown_db_client():
    await db.close_db()