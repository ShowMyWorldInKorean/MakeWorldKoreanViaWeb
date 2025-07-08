FROM pytorch/pytorch:2.0.1-cuda11.7-cudnn8-runtime
ENV DEBIAN_FRONTEND=noninteractive
# Install system dependencies
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
    && rm -rf /var/lib/apt/lists/*

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

RUN uv venv /opt/srnet/.venv
ENV UV_PROJECT_ENVIRONMENT=/opt/srnet/.venv
ENV PATH="/opt/srnet/.venv/bin:$PATH"

WORKDIR /app/srnet

COPY pyproject.toml ./
RUN uv lock
RUN uv sync --frozen

WORKDIR /app
RUN git clone https://github.com/Onkarsus13/Diff_SceneTextEraser.git
WORKDIR /app/Diff_SceneTextEraser
RUN uv pip install -e ".[torch]"
RUN uv pip install -e .[all,dev,notebooks]
RUN uv pip install flax==0.6.9
RUN uv pip install jax==0.4.20 jaxlib==0.4.20
RUN uv pip install "huggingface_hub==0.25.2"

WORKDIR /app/srnet

# RUN uv pip install torch==2.0.1+cu117 torchvision==0.15.2+cu117 -f https://download.pytorch.org/whl/torch_stable.html
