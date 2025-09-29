# MakeWorldKoreanViaWeb
<p align="center">
  <img src="docs/assets/IMG_4156.gif" alt="데모 GIF" width="840" />
</p>

영문 이미지를 업로드하면 텍스트를 감지하고 한국어로 번역(선택 시 합성)해 주는 웹 서비스입니다.

## 구조
- `backend/`: FastAPI 기반 OCR/번역 API와 MongoDB 연동, SRNet 서비스 연동
- `frontend/`: React(Vite) 기반 클라이언트 UI

## 빠른 시작
### 요구사항
- Docker, Docker Compose
- uv (Python 패키지/venv 관리)

### 백엔드 (Docker Compose)
```bash
cd backend
uv sync
docker compose up -d
```
- API 문서: `http://localhost:8000/docs`
- 종료: `docker compose down -v`

### 프론트엔드 (개발 서버)
```bash
cd frontend
npm install
npm run dev
```
- 개발 서버: `http://localhost:5173`

## 백엔드 개요
- 프레임워크: FastAPI
- 실행: compose 기준 `uvicorn main:app --host 0.0.0.0 --port 8000 --reload`
- 주요 엔드포인트
  - `POST /api/v1/text-detection`: 이미지 내 텍스트 감지 및 블록 반환
  - `POST /api/v1/translate`: 텍스트 번역(출력 타입에 따라 이미지 합성)
- 데이터베이스: MongoDB (컨테이너 `mwkvw_mongodb`)
- 추가 서비스: `srnet` (이미지 합성 관련, 포트 8001)

## 프론트엔드 개요
- Vite + React 19, React Router 7
- 주요 스크립트: `dev`, `build`, `preview`

## 미디어/데모
- 데모 GIF: `docs/assets/IMG_4156.gif`

### 번역 결과 비교
원본 이미지와 다양한 번역 결과를 비교해보세요:

| 구분 | 이미지 | 설명 |
|------|--------|------|
| 원본 | ![원본](docs/assets/274.jpg) | 원본 영문 이미지 |
| 번역 결과 | ![번역 결과](docs/assets/IMG_1941 2.JPG) | 본 프로그램으로 번역된 결과 |
| 구글 번역 | ![구글 번역](docs/assets/274구글.jpg) | 구글 번역 결과 |
| ChatGPT | ![ChatGPT](docs/assets/ChatGPT Image 2025년 9월 29일 오후 03_16_46.png) | ChatGPT 번역 결과 |

- 추가 이미지들: `docs/assets/` 폴더 참조

## 라이선스
본 저장소 내 서드파티 모델/툴킷은 각 프로젝트의 라이선스를 따릅니다.
