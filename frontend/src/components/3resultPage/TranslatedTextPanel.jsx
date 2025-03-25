import React from "react";

function TranslatedTextPanel({ activeTab, setActiveTab }) {
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
            <>
              한국어로 번역된 텍스트 한국어로 번역된 텍스트
              <br />
              한국어로 번역된 텍스트 한국어로 번역된 텍스트
              <br />
              한국어로 번역된 텍스트 한국어로 번역된 텍스트 한국어로 번역된
              텍스트
            </>
          )}

          {activeTab === "original" && <p>원문 텍스트가 여기에 표시됩니다.</p>}
        </div>
      </div>
    </article>
  );
}

export default TranslatedTextPanel;
