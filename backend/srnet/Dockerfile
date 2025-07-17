FROM pytorch/pytorch:2.0.1-cuda11.7-cudnn8-runtime
ENV DEBIAN_FRONTEND=noninteractive

# 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    build-essential \
    python3-dev \
    libgl1-mesa-glx \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    git \
    imagemagick \
    fonts-noto \
    && rm -rf /var/lib/apt/lists/*

# uv 설치
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/
RUN uv venv /opt/srnet/.venv
ENV UV_PROJECT_ENVIRONMENT=/opt/srnet/.venv
ENV PATH="/opt/srnet/.venv/bin:$PATH"

# SRNet 의존성 설치
WORKDIR /app/srnet
COPY pyproject.toml ./
RUN uv lock
RUN uv sync --frozen

# SceneTextEraser 설치
WORKDIR /app
RUN git clone https://github.com/Onkarsus13/Diff_SceneTextEraser.git
WORKDIR /app/Diff_SceneTextEraser
RUN uv pip install -e ".[torch]"
RUN uv pip install -e .[all,dev,notebooks]
RUN uv pip install flax==0.6.9
RUN uv pip install jax==0.4.20 jaxlib==0.4.20
RUN uv pip install "huggingface_hub==0.25.2"

WORKDIR /app/srnet
