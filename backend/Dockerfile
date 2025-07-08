FROM python:3.10-slim

RUN apt-get update && apt-get install -y \
    git \
    gcc \
    g++ \
    build-essential \
    python3-dev \
    libpango1.0-dev \
    libcairo2-dev \
    imagemagick \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

RUN uv venv /opt/.venv
ENV UV_PROJECT_ENVIRONMENT=/opt/.venv
ENV PATH="/opt/.venv/bin:$PATH"

WORKDIR /app
COPY pyproject.toml ./
RUN uv lock
RUN uv sync --frozen


RUN uv run python -c "import nltk; nltk.download('punkt')"

RUN git clone https://github.com/VarunGumma/IndicTransToolkit /tmp/IndicTransToolkit && \
    cd /tmp/IndicTransToolkit && \
    uv pip install ./ && \
    rm -rf /tmp/IndicTransToolkit

#IndicTransToolkit은 numpy 버전이 높아서 낮춰야 함
RUN uv pip install numpy==1.24.4

# 모델과 토크나이저 미리 다운로드
RUN uv run python -c "from transformers import AutoTokenizer, AutoModelForSeq2SeqLM; AutoTokenizer.from_pretrained('NHNDQ/nllb-finetuned-en2ko', trust_remote_code=True); AutoModelForSeq2SeqLM.from_pretrained('NHNDQ/nllb-finetuned-en2ko', trust_remote_code=True)"
RUN uv run python -c "from transformers import MarianTokenizer, MarianMTModel; MarianTokenizer.from_pretrained('Helsinki-NLP/opus-mt-ko-en', trust_remote_code=True); MarianMTModel.from_pretrained('Helsinki-NLP/opus-mt-ko-en', trust_remote_code=True)"
