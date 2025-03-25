import React from "react";
import OriginalTextPanel from "./OriginalTextPanel";

function OriginalTextPanel2({ activeTab, setActiveTab }) {
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
            <OriginalTextPanel/>
          )}

          {activeTab === "original" && <div className="w-120">원본 이미지가 여기에 표시됩니다.</div>}
        </div>
      </div>
    </article>
  );
}

export default OriginalTextPanel2;
