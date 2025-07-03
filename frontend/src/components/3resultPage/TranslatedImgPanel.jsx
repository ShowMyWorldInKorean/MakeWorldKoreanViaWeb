import React from "react";
import { useLocation } from "react-router-dom";
import OriginalTextPanel from "./OriginalTextPanel";

function OriginalTextPanel2({ activeTab, setActiveTab }) {
  const location = useLocation();
  const resultData = location.state;

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
            <div className="w-full">
              {resultData && resultData.translated_image ? (
                <img 
                  src={`data:image/jpeg;base64,${resultData.translated_image}`} 
                  alt="번역된 이미지" 
                  className="w-full h-auto rounded-lg shadow-md"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">번역된 이미지가 없습니다.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "original" && (
            <div className="w-full">
              {resultData && resultData.original_image ? (
                <img 
                  src={`data:image/jpeg;base64,${resultData.original_image}`} 
                  alt="원본 이미지" 
                  className="w-full h-auto rounded-lg shadow-md"
                />
              ) : (
                <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500">원본 이미지가 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

export default OriginalTextPanel2;
