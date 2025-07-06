import React from "react";
import { useLocation } from "react-router-dom";

function OriginalTextPanel({ activeTab, setActiveTab, outputType }) {
  const location = useLocation();
  const result = location.state;

  // 감지된 텍스트 블록들 추출 - 다양한 데이터 구조 지원
  const detectedTextBlocks = result?.data?.detectedTextBlocks || result?.detectedTextBlocks || {};
  const originalImage = result?.data?.originalImage || result?.originalImage || "";
  const finalOutputType = outputType || result?.outputType || "1";

  console.log("🔍 OriginalTextPanel - 감지된 텍스트 블록:", detectedTextBlocks);
  console.log("🔍 OriginalTextPanel - 원본 이미지:", originalImage ? "있음" : "없음");
  console.log("🔍 OriginalTextPanel - outputType:", finalOutputType);

  return (
    <article className="ml-5 w-6/12 max-md:ml-0 max-md:w-full">
      <div className="flex flex-col grow max-md:mt-10 max-md:max-w-full">
        {/* 텍스트 번역의 경우 탭 버튼 숨김 */}
        {finalOutputType === "2" && (
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
        )}
      
        <div className="flex flex-col justify-center w-120 max-md:max-w-full">
          <div className="flex flex-col items-start w-full max-md:pr-5 max-md:pb-24 max-md:max-w-full">
            {/* 텍스트 번역의 경우 원본 이미지로 고정 */}
            {finalOutputType === "1" ? (
              <div className="flex flex-col items-center w-full">
                {originalImage ? (
                  <>
                    <img
                      src={originalImage.startsWith('data:image/') ? originalImage : `data:image/jpeg;base64,${originalImage}`}
                      alt="원본 이미지"
                      className="max-w-full h-auto rounded-lg shadow-lg"
                      style={{ maxHeight: '400px' }}
                    />
                    <p className="mt-4 text-sm text-gray-600">원본 이미지</p>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
                    <p className="text-gray-500">원본 이미지가 없습니다.</p>
                  </div>
                )}
              </div>
            ) : (
              /* 이미지 번역의 경우 기존 방식 유지 */
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default OriginalTextPanel;
