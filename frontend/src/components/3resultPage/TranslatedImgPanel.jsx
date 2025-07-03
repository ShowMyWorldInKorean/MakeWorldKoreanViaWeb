import React from "react";
import { useLocation } from "react-router-dom";

function TranslatedImgPanel({ activeTab, setActiveTab }) {
  const location = useLocation();
  const result = location.state;

  // 원본 이미지와 번역된 이미지 추출
  const originalImage = result?.originalImage || result?.data?.originalImage || "";
  const translatedImage = result?.data?.translatedImage || "";

  // base64 이미지 URL 생성 함수
  const getImageUrl = (base64String) => {
    if (!base64String) return "";
    // 이미 data:image/ 접두사가 있으면 그대로 사용, 없으면 추가
    return base64String.startsWith('data:image/') 
      ? base64String 
      : `data:image/jpeg;base64,${base64String}`;
  };

  console.log("🔍 TranslatedImgPanel - 원본 이미지:", originalImage ? "있음" : "없음");
  console.log("🔍 TranslatedImgPanel - 번역된 이미지:", translatedImage ? "있음" : "없음");
  console.log("🔍 TranslatedImgPanel - 전체 데이터:", result);

  return (
    <article className="ml-5 w-6/12 max-md:ml-0 max-md:w-full">
      <div className="flex flex-col w-full text-2xl min-h-[423px] max-md:mt-10 max-md:max-w-full">
       <div className="flex gap-9 items-center self-start font-medium text-center whitespace-nowrap">
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
            원본
          </button>
        </div>

        <div className="mt-12 leading-9 text-black max-md:mt-10 max-md:max-w-full">
          {activeTab === "translation" && (
            <div className="w-120">
              {translatedImage ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={`data:image/jpeg;base64,${translatedImage}`}
                    alt="번역된 이미지"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                    style={{ maxHeight: '400px' }}
                    onError={(e) => {
                      console.error("번역된 이미지 로드 실패:", e);
                      e.target.style.display = 'none';
                      e.target.nextSibling.textContent = '번역된 이미지를 불러올 수 없습니다.';
                    }}
                  />
                  <p className="mt-4 text-sm text-gray-600">번역된 이미지</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
                  <p className="text-gray-500">번역된 이미지가 없습니다.</p>
                  <p className="text-xs text-gray-400 mt-2">API 응답에 translatedImage가 포함되지 않았습니다.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "original" && (
            <div className="w-120">
              {originalImage ? (
                <div className="flex flex-col items-center">
                  <img 
                    src={getImageUrl(originalImage)}
                    alt="원본 이미지"
                    className="max-w-full h-auto rounded-lg shadow-lg"
                    style={{ maxHeight: '400px' }}
                    onError={(e) => {
                      console.error("원본 이미지 로드 실패:", e);
                      e.target.style.display = 'none';
                      e.target.nextSibling.textContent = '원본 이미지를 불러올 수 없습니다.';
                    }}
                  />
                  <p className="mt-4 text-sm text-gray-600">원본 이미지</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 bg-gray-100 rounded-lg">
                  <p className="text-gray-500">원본 이미지가 없습니다.</p>
                  <p className="text-xs text-gray-400 mt-2">API 응답에 originalImage가 포함되지 않았습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default TranslatedImgPanel;
