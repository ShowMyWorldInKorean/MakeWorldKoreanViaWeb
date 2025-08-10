FROM pytorch/pytorch:2.1.2-cuda11.8-cudnn8-runtime
ENV DEBIAN_FRONTEND=noninteractive

# 1) 시스템 패키지 설치
RUN apt-get update && apt-get install -y \
    gcc g++ build-essential python3-dev \
    libgl1-mesa-glx libglib2.0-0 libsm6 libxext6 libxrender-dev libgomp1 \
    git imagemagick \
    fonts-nanum fonts-noto-cjk && rm -rf /var/lib/apt/lists/*\
    && rm -rf /var/lib/apt/lists/* 

# 2) uv 바이너리 복사
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# 3) 가상환경 생성 및 PATH 등록
RUN uv venv /opt/srnet/.venv
ENV UV_PROJECT_ENVIRONMENT=/opt/srnet/.venv
ENV PATH="/opt/srnet/.venv/bin:$PATH"

# 4) 프로젝트 의존성 설치
WORKDIR /app/srnet
COPY pyproject.toml ./
RUN uv lock
RUN uv sync --frozen
RUN uv pip install python-dotenv==1.0.0

# 5) Diff_SceneTextEraser 설치
WORKDIR /app
RUN git clone https://github.com/Onkarsus13/Diff_SceneTextEraser.git
WORKDIR /app/Diff_SceneTextEraser
RUN uv pip install -e .[all,dev,notebooks]
RUN uv pip install flax==0.6.9
RUN uv pip install jax==0.4.20 jaxlib==0.4.20
RUN uv pip install "huggingface_hub==0.25.2"

# 6) PyTorch CUDA 11.8 (2.1.2) + torchaudio + accelerate 재설치
RUN uv pip install --index-url https://download.pytorch.org/whl/cu118 \
    torch==2.1.2 torchvision==0.16.2 torchaudio==2.1.2
RUN uv pip install accelerate==0.30.1

# 7) 버전 체크 (torch, accelerate, CUDA)
RUN python -c "import torch; import accelerate; \
print('Torch Version:', torch.__version__); \
print('Accelerate Version:', accelerate.__version__); \
print('CUDA Available:', torch.cuda.is_available()); \
print('CUDA Version:', torch.version.cuda)"

# 8) 앱 코드 복사
WORKDIR /app/srnet
COPY . .

# 9) uvicorn 실행
EXPOSE 8001
CMD ["/opt/srnet/.venv/bin/uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8001", "--reload"]
