import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function UploadArea() {
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();

  const handleClick = () => {
    console.log("hi");

    const userId = uuidv4();
    console.log(userId);

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

    navigate("/selectBox", { state: result });
    setResponseMessage(`Upload successful: ${result.message}`);
    console.log(result.message);
  };
  return (

    
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
  );
}

export default UploadArea;
