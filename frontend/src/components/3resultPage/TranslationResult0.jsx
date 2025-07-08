import React, { useState } from "react";
import TranslationContent from "./TranslationContent";
import NavigationButtons from "./NavigationButtons";
import LanguageSelector from "../2secondPage/LanguageSelector2";
import OriginalTextPanel from "./OriginalTextPanel";
import TranslatedTextPanel from "./TranslatedTextPanel";
import TranslatedImgPanel from "./TranslatedImgPanel";
import { useLocation } from "react-router-dom";


function TranslationResult() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("translation"); // 공통 탭 상태

  const resultRaw = location.state
  const resultStr = JSON.stringify(resultRaw)
  const result = JSON.parse(resultStr)

  console.log("outputType :", result.outputType); 
  console.log("마지막에 넘어 온 데이터 (result page): ", result);
  console.log("result의 타입:", typeof result.outputType);
  console.log("result.outputType === '1':", result.outputType === '1');
  console.log("result.outputType === '2':", result.outputType === '2');

  const outputType = result.outputType

  return (
    <main className="flex overflow-hidden flex-col items-center pb-12 bg-stone-50">
      <h1 className="mt-10 text-4xl font-semibold text-center text-black max-md:max-w-full">
        {outputType=='1'?"텍스트로 번역했어요!":"이미지로 번역했어요!"}
      </h1>

      <section className="flex flex-col px-px py-7 mt-9 mb-3.5 w-full bg-white border-solid border-[0.7px] border-[color:var(--Neutral-color-Neutral-300,#D6D6D6)] max-w-[1282px] rounded-[30px] max-md:max-w-full">
        <LanguageSelector />
        <hr className="shrink-0 self-center mt-5 max-w-full h-px border border-solid border-neutral-200 w-[1200px]" />

        {/* outputType에 따라 다른 레이아웃 렌더링 */}
        <div className="flex flex-col items-center h-128.5 self-center w-full max-w-[1140px] max-md:px-5 max-md:max-w-full">
          <div className="mt-5 w-full max-w-[1160px] max-md:max-w-full">
            {/* Panel Container */}
            <div className="flex w-full items-stretch gap-5 max-md:flex-col">
              {/* 왼쪽 패널 */}
              <div className="flex-1 flex flex-col h-full">
                {outputType === '1' ? (
                  <OriginalTextPanel activeTab={activeTab} setActiveTab={setActiveTab} outputType={outputType} />
                ) : (
                  <TranslatedImgPanel activeTab={activeTab} setActiveTab={setActiveTab} />
                )}
              </div>

              {/* 세로 구분선 (중앙 정렬) */}
              <div className="w-[2px] bg-gray-300 self-stretch max-md:hidden"></div>

              {/* 오른쪽 패널 - 번역 텍스트 패널*/}
              <div className="flex-1 flex flex-col h-full">
                <TranslatedTextPanel activeTab={activeTab} setActiveTab={setActiveTab} outputType={outputType} />
              </div>
            </div>
          </div>
        </div>
      </section>
      <NavigationButtons outputType={outputType} />
    </main>
  );
}

export default TranslationResult;

