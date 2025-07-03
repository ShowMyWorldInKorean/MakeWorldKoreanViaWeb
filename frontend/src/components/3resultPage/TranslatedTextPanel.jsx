import React from "react";
import { useLocation } from "react-router-dom";

function TranslatedTextPanel({ activeTab, setActiveTab }) {
  const location = useLocation();
  const result = location.state;

  // 번역 결과 추출 - 다양한 데이터 구조 지원
  const translations = result?.data?.translations || result?.translations || {};
  const originalTextBlocks = result?.data?.detectedTextBlocks || result?.detectedTextBlocks || {};

  // 번역된 텍스트들을 배열로 변환
  const translatedTexts = Object.values(translations);
  const originalTexts = Object.values(originalTextBlocks).map(block => 
    typeof block === 'string' ? block : block.detectedText
  );

  console.log("🔍 TranslatedTextPanel - 번역 결과:", translations);
  console.log("🔍 TranslatedTextPanel - 원문 블록:", originalTextBlocks);
  console.log("🔍 TranslatedTextPanel - 번역된 텍스트들:", translatedTexts);
  console.log("🔍 TranslatedTextPanel - 원문 텍스트들:", originalTexts);

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
            원문
          </button>
        </div>

        <div className="mt-10 leading-9 w-120 text-black max-md:mt-10 max-md:max-w-full">
          {activeTab === "translation" && (
            <div>
              {translatedTexts.length > 0 ? (
                translatedTexts.map((text, index) => (
                  <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg">{text}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">번역 결과가 없습니다.</p>
              )}
            </div>
          )}

          {activeTab === "original" && (
            <div>
              {originalTexts.length > 0 ? (
                originalTexts.map((text, index) => (
                  <div key={index} className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-lg">{text}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">원문 텍스트가 없습니다.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default TranslatedTextPanel;
