FROM python:3.10-slim

# 기본 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    git \
    gcc \
    g++ \
    build-essential \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# IndicTransToolkit 설치
RUN git clone https://github.com/VarunGumma/IndicTransToolkit /tmp/IndicTransToolkit && \
    pip install /tmp/IndicTransToolkit && \
    rm -rf /tmp/IndicTransToolkit

# numpy 다운그레이드
RUN pip install numpy==1.24.4

# 모델 & 토크나이저 미리 다운로드 (원하는 모델로 교체 가능)
RUN uv run python -c "from transformers import AutoTokenizer, AutoModelForSeq2SeqLM; AutoTokenizer.from_pretrained('NHNDQ/nllb-finetuned-en2ko', trust_remote_code=True); AutoModelForSeq2SeqLM.from_pretrained('NHNDQ/nllb-finetuned-en2ko', trust_remote_code=True)"
RUN uv run python -c "from transformers import MarianTokenizer, MarianMTModel; MarianTokenizer.from_pretrained('Helsinki-NLP/opus-mt-ko-en', trust_remote_code=True); MarianMTModel.from_pretrained('Helsinki-NLP/opus-mt-ko-en', trust_remote_code=True)"

WORKDIR /app

# API 서버 코드 복사
COPY . /app

# FastAPI + Uvicorn 설치
RUN pip install fastapi uvicorn pydantic

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8002"]
