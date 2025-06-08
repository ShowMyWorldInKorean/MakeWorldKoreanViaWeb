FROM python:3.9-slim

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

ENV UV_PROJECT_ENVIRONMENT=/opt/.venv

WORKDIR /app
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-cache

ENV PATH="/opt/.venv/bin:$PATH"

# COPY korean_rec /opt/.venv/lib/python3.9/site-packages/paddleocr/inference/korean_rec