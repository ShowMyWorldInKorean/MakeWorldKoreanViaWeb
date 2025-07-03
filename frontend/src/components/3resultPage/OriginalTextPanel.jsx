import React from "react";
import { useLocation } from "react-router-dom";

function OriginalTextPanel({ activeTab, setActiveTab }) {
  const location = useLocation();
  const result = location.state;

  // 감지된 텍스트 블록들 추출 - 다양한 데이터 구조 지원
  const detectedTextBlocks = result?.data?.detectedTextBlocks || result?.detectedTextBlocks || {};
  const originalImage = result?.data?.originalImage || result?.originalImage || "";

  console.log("🔍 OriginalTextPanel - 감지된 텍스트 블록:", detectedTextBlocks);
  console.log("🔍 OriginalTextPanel - 원본 이미지:", originalImage ? "있음" : "없음");

  return (
    <article className="w-6/12 max-md:ml-0 max-md:w-full">
      <div className="flex flex-col grow max-md:mt-10 max-md:max-w-full">
        <div className="flex gap-9 items-center self-start font-medium text-center whitespace-nowrap mb-4">
          <button
            className={`self-stretch my-auto ${
              activeTab === "translation" ? "text-black" : "text-neutral-400"
            }`}
            onClick={() => setActiveTab("translation")}
          >
            번역
          </button>
          <button
            className={`self-stretch my-auto ${
              activeTab === "original" ? "text-black" : "text-neutral-400"
            }`}
            onClick={() => setActiveTab("original")}
          >
            원문
          </button>
        </div>
      
        <div className="flex flex-col justify-center py-7 w-120 bg-zinc-800 max-md:max-w-full">
          <div className="flex flex-col items-start py-30 w-full bg-white max-md:pr-5 max-md:pb-24 max-md:max-w-full">
            {activeTab === "translation" && (
              <div className="w-full p-4">
                <h3 className="text-lg font-semibold mb-4">감지된 텍스트 블록들</h3>
                {Object.entries(detectedTextBlocks).length > 0 ? (
                  Object.entries(detectedTextBlocks).map(([key, block]) => (
                    <div key={key} className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <p className="text-sm text-gray-600 mb-1">블록 {key}</p>
                      <p className="text-base">
                        {typeof block === 'string' ? block : block.detectedText}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">감지된 텍스트가 없습니다.</p>
                )}
              </div>
            )}

            {activeTab === "original" && (
              <div className="w-full p-4">
                <h3 className="text-lg font-semibold mb-4">원본 이미지</h3>
                {originalImage ? (
                  <img 
                    src={originalImage.startsWith('data:image/') ? originalImage : `data:image/jpeg;base64,${originalImage}`}
                    alt="원본 이미지"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                    style={{ maxHeight: '300px' }}
                  />
                ) : (
                  <p className="text-gray-500">원본 이미지가 없습니다.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default OriginalTextPanel;
