import React, { useState } from "react";
import OriginalTextPanel from "./OriginalTextPanel";
import TranslatedTextPanel from "./TranslatedTextPanel";
import TranslatedImgPanel from "./TranslatedImgPanel";

function TranslationContent({outputType}) {
  const [activeTab, setActiveTab] = useState("translation"); // 공통 탭 상태

  return (
    <div className="flex flex-col items-center h-128.5 self-center w-full max-w-[1140px] max-md:px-5 max-md:max-w-full">
      <div className="mt-5 w-full max-w-[1160px] max-md:max-w-full">
        {/* Panel Container */}
        <div className="flex w-full items-stretch gap-5 max-md:flex-col">
          {/* 왼쪽 패널 */}
          <div className="flex-1 flex flex-col h-full">
            {outputType=='1'?<OriginalTextPanel activeTab={activeTab} setActiveTab={setActiveTab} />:<TranslatedImgPanel activeTab={activeTab} setActiveTab={setActiveTab}/>}
            
          </div>

          {/* 세로 구분선 (중앙 정렬) */}
          <div className="w-[2px] bg-gray-300 self-stretch max-md:hidden"></div>

          {/* 오른쪽 패널 - 번역 텍스트 패널*/}
          <div className="flex-1 flex flex-col h-full">
            <TranslatedTextPanel activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TranslationContent;
