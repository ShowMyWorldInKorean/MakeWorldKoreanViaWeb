import React, { useState } from "react";
import OriginalTextPanel from "./OriginalTextPanel";
import TranslatedTextPanel from "./TranslatedTextPanel";
import OriginalTextPanel2 from "./TranslatedImgPanel";

function TranslationContent({outputType}) {
  const [activeTab1, setActiveTab1] = useState("translation"); // "translation" or "original"
  const [activeTab2, setActiveTab2] = useState("translation");

  return (
    <div className="flex flex-col items-center h-128.5 self-center w-full max-w-[1140px] max-md:px-5 max-md:max-w-full">
      <div className="mt-5 w-full max-w-[1160px] max-md:max-w-full">
        {/* Panel Container */}
        <div className="flex w-full items-stretch gap-5 max-md:flex-col">
          {/* 원본 텍스트 패널 */}
          <div className="flex-1 flex flex-col h-full">
            {outputType=='1'?<OriginalTextPanel activeTab={activeTab1} setActiveTab={setActiveTab1} />:<OriginalTextPanel2 activeTab={activeTab1} setActiveTab={setActiveTab1}/>}
            
          </div>

          {/* 세로 구분선 (중앙 정렬) */}
          <div className="w-[2px] bg-gray-300 self-stretch max-md:hidden"></div>

          {/* 번역 텍스트 패널*/}
          <div className="flex-1 flex flex-col h-full">
            <TranslatedTextPanel activeTab={activeTab2} setActiveTab={setActiveTab2} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TranslationContent;
