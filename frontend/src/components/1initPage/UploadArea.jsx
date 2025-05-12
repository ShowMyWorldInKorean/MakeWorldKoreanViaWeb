import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

// 간단한 모달 컴포넌트 정의
function LoadingModal({ show }) {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0, 0, 0, 0.3)", // 일반적인 불투명한 검정 배경
        backdropFilter: "blur(2px)",
      }}
    >
      <div className="flex flex-col items-center justify-center bg-white rounded-2xl p-8 shadow-lg">
        <img src="/AppIcon.png" alt="로딩 중" width="80" height="80" className="mb-4 animate-bounce" />
        <span className="text-lg font-semibold text-gray-700">번역 중입니다...</span>
      </div>
    </div>
  );
}

function UploadArea() {
  const [responseMessage, setResponseMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => {
    setLoading(true); // 모달 표시

    // 실제 번역 처리 시간 시뮬레이션 (예: 2초)
    setTimeout(() => {
      const userId = uuidv4();
      const originalImage = "sample";

      const result = {
        success: true,
        message: "텍스트 감지 완료",
        data: {
          userId: userId,
          imageId: "img123...",
          detectedTextBlocks: {
            "1": {
              bbox: [[10, 20], [100, 20], [100, 50], [10, 50]],
              detectedText: "감지된 원본 텍스트1",
            },
            "2": {
              bbox: [[150, 30], [300, 30], [300, 80], [150, 80]],
              detectedText: "감지된 원본 텍스트2",
            },
            "3": {
              bbox: [[150, 32], [300, 40], [140, 80], [299, 80]],
              detectedText: "감지된 원본 텍스트3",
            },
          },
        },
      };

      setLoading(false); // 모달 숨김
      navigate("/selectBox", { state: result });
      setResponseMessage(`Upload successful: ${result.message}`);
      console.log(result.message);
    }, 2000); // 2초 후에 번역 완료
  };

  return (
    <>
      <LoadingModal show={loading} />
      <div
        className="flex flex-col items-center justify-center py-42 w-full bg-white rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200"
        onClick={handleClick}
      >
        <img src="/FileUploadIcon.png" width="50px" height="50px" className="mb-3" alt="파일 업로드 아이콘" />
        <span className="text-[18px] text-gray-700">
          클릭 또는 드래그하여
        </span>
        <span className="text-[18px] font-semibold text-gray-900">
          <b>번역할 사진(JPG, PNG 등)</b>을 올려주세요.
        </span>
        <span className="mt-2 text-sm text-gray-500">최대 용량: 00MB</span>
      </div>
    </>
  );
}

export default UploadArea;
