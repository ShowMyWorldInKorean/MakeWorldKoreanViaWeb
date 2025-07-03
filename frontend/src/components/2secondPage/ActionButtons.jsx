import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ActionButtons({
  userId,
  imageId,
  sourceLanguage,
  targetLanguage,
  selectedBlocks,
}) {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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

  const handleClickToText = () => {
    const payload = { ...resultToPost, outputType: "1" };
    navigate("/result", { state: payload });
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
      navigate("/result", { state: responseData });
    } catch (error) {
      console.error("번역 요청 실패:", error);
      alert("번역 요청에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center gap-10 mt-5 max-w-full text-xl font-semibold text-center text-blue-950 w-[620px]">
        <button
          onClick={handleClickToText}
          className="flex flex-1 gap-2.5 justify-center items-center bg-white border border-[0.7px] border-[color:var(--Point-color-Point-400,#313E86)] min-h-[80px] rounded-[50px] max-md:px-3"
        >
          <div className="h-[30px] w-[30px]">
            <img src="/editIcon.png" />
          </div>
          <span>텍스트로 번역</span>
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

      {/* 로딩 모달 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">이미지 번역 중...</p>
            <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요</p>
          </div>
        </div>
      )}
    </>
  );
}

export default ActionButtons;
