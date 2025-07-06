import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// 간단한 모달 컴포넌트 정의
function LoadingModal({ show }) {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(2px)",
      }}
    >
      {/* AppIcon.png가 위, 그 아래에 '번역 중입니다...'가 나오도록 수정 */}
      <div className="flex flex-col items-center">
        <img
          src="icon_only.png"
          alt="로딩 중"
          width="400"
          height="400"
          style={{
            animation: "bounce 1s infinite"
          }}
        />
        <span className="text-lg font-semibold text-gray-700 mt-4">번역 중입니다...</span>
      </div>
      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}
      </style>
    </div>
  );
}

function ActionButtons({
  userId,
  imageId,
  sourceLanguage,
  targetLanguage,
  selectedBlocks,
  originalImage,
  detectedTextBlocks,
}) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  console.log("ActionButtons - 원본 이미지:", originalImage ? "있음" : "없음");
  console.log("ActionButtons - 원본 이미지 길이:", originalImage ? originalImage.length : 0);

  // 선택된 블록 인덱스만 배열로 추출
  const selectedIndexes = Object.entries(selectedBlocks)
    .filter(([_, isSelected]) => isSelected)
    .map(([idx]) => idx);  // 인덱스는 문자열로 되어 있음

  const resultToPost = {
    userId,
    imageId,
    targetTextBlocks: selectedIndexes,
    sourceLanguage,
    targetLanguage,
    outputType: "0", // 초기값, 버튼에 따라 바뀜
  };

  console.log("최종 전송 데이터:", resultToPost);

  const handleClickToText = async () => {
    const payload = { 
      ...resultToPost, 
      outputType: "1"
    };
    console.log("📦 텍스트 번역 요청 데이터:", payload);

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const responseData = await response.json();
      
      // 원본 이미지와 감지된 텍스트 블록을 응답 데이터에 추가
      const finalData = {
        ...responseData,
        originalImage: originalImage,
        detectedTextBlocks: detectedTextBlocks,
        outputType: "1" // 텍스트 번역임을 명시적으로 추가
      };
      
      navigate("/result", { state: finalData });
    } catch (error) {
      console.error("텍스트 번역 요청 실패:", error);
      alert("텍스트 번역 요청에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClickToImg = async () => {
    const payload = { ...resultToPost, outputType: "2" };
    console.log("📦 보낼 데이터:", payload);

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/v1/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }

      const responseData = await response.json();
      
      // 원본 이미지와 감지된 텍스트 블록을 응답 데이터에 추가
      const finalData = {
        ...responseData,
        originalImage: originalImage,
        detectedTextBlocks: detectedTextBlocks
      };
      
      navigate("/result", { state: finalData });
    } catch (error) {
      console.error("번역 요청 실패:", error);
      alert("번역 요청에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingModal show={isLoading} />
      <div className="flex justify-center gap-10 mt-5 max-w-full text-xl font-semibold text-center text-blue-950 w-[620px]">
        <button
          onClick={handleClickToText}
          disabled={isLoading}
          className="flex flex-1 gap-2.5 justify-center items-center bg-white border border-[0.7px] border-[color:var(--Point-color-Point-400,#313E86)] min-h-[80px] rounded-[50px] max-md:px-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="h-[30px] w-[30px]">
            <img src="/editIcon.png" />
          </div>
          <span>{isLoading ? "번역 중..." : "텍스트로 번역"}</span>
        </button>
        <button
          onClick={handleClickToImg}
          disabled={isLoading}
          className="flex flex-1 gap-2.5 justify-center items-center bg-white border border-[0.7px] border-[color:var(--Point-color-Point-400,#00106A)] min-h-[80px] rounded-[50px] max-md:px-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="h-[30px] w-[30px]">
            <img src="/galleryIcon.png" />
          </div>
          <span>{isLoading ? "번역 중..." : "이미지로 번역"}</span>
        </button>
      </div>
    </>
  );
}

export default ActionButtons;
