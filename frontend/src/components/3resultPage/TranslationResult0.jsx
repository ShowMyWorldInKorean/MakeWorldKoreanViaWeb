import React from "react";
import TranslationContent from "./TranslationContent";
import NavigationButtons from "./NavigationButtons";
import LanguageSelector from "../2secondPage/LanguageSelector2";
import { useLocation } from "react-router-dom";


function TranslationResult() {
const location = useLocation();

const resultRaw = location.state
const resultStr = JSON.stringify(resultRaw)
const result = JSON.parse(resultStr)

console.log("outputType :", result.outputType); 
console.log("마지막에 넘어 온 데이터 : ", result);

const outputType = result.outputType

  return (
    <main className="flex overflow-hidden flex-col items-center pb-12 bg-stone-50">
          <h1 className="mt-10 text-4xl font-semibold text-center text-black max-md:max-w-full">
        {outputType=='1'?"텍스트로 번역했어요!":"이미지로 번역했어요!"}
      </h1>

      <section className="flex flex-col px-px py-7 mt-9 mb-3.5 w-full bg-white border-solid border-[0.7px] border-[color:var(--Neutral-color-Neutral-300,#D6D6D6)] max-w-[1282px] rounded-[30px] max-md:max-w-full">
        <LanguageSelector />
        <hr className="shrink-0 self-center mt-5 max-w-full h-px border border-solid border-neutral-200 w-[1200px]" />

        <TranslationContent outputType={outputType}/>
      </section>
      <NavigationButtons outputType={outputType} />
    </main>
  );
}

export default TranslationResult;