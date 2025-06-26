import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ActionButtons({
  userId,
  imageId,
  sourceLanguage,
  targetLanguage,
  selectedBlocks,
}) {
  const navigate = useNavigate();

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
    }
  };

  return (
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
        className="flex flex-1 gap-2.5 justify-center items-center bg-white border border-[0.7px] border-[color:var(--Point-color-Point-400,#00106A)] min-h-[80px] rounded-[50px] max-md:px-3"
      >
        <div className="h-[30px] w-[30px]">
          <img src="/galleryIcon.png" />
        </div>
        <span>이미지로 번역</span>
      </button>
    </div>
  );
}

export default ActionButtons;
