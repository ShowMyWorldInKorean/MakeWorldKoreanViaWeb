import React from "react";
import LanguageSelector from "./LanguageSelector2";
import DocumentArea from "./DocumentArea";
import ActionButtons from "./ActionButtons";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../common/Header";

function SelectionScreen() {

  const location = useLocation();
  const navigate = useNavigate();


  const resultRaw = location.state
  const resultStr = JSON.stringify(resultRaw)
  const result = JSON.parse(resultStr)


  console.log("넘어 온 데이터 :", result);
  console.log("넘어 온 데이터 :", result.data.detectedTextBlocks); //object
 

  const resultToPost = {
    "userId": result.data.userId,
    "imageId": result.data.imageId, 
    "targetTextBlocks": [result.data.detectedTextBlocks["1"], result.data.detectedTextBlocks["3"],],
    "sourceLanguage": "en",
    "targetLanguage": "ko",
    "outputType": "0"
  }

  // console.log("resultToPost: ",resultToPost);

  //Object인 TextBlocks를 배열로 변환. Object.values() 이용
  const blocksObject = result.data.detectedTextBlocks
  const blocksArr = Object.values(blocksObject)

console.log("변환 전:",blocksObject);
console.log("변환 후:",blocksArr);

const btnSelectAll = ()=>{
  resultToPost.targetTextBlocks = blocksArr.map((block)=>block)
}

const btnChangeImg = ()=>{
  const confirmMsg = window.confirm("첫 화면으로 나갈까요?")

      //모달창으로 바꾸기
      if (confirmMsg) {
        navigate('/')
      }
      
}


  return (
    <main className="flex overflow-hidden flex-col items-center pb-10 bg-stone-50">
      <Header />

      <h1 className="mt-10 text-4xl font-semibold text-center text-black max-md:max-w-full">
        번역을 원하는 부분을 모두 선택해주세요
      </h1>

      <section className="flex flex-col px-px py-7 mt-9 mb-3.5 w-full bg-white border-solid border-[0.7px] border-[color:var(--Neutral-color-Neutral-300,#D6D6D6)] max-w-[1282px] rounded-[30px] max-md:max-w-full">
        <LanguageSelector />
        <hr className="shrink-0 self-center mt-5 max-w-full h-px border border-solid border-neutral-200 w-[1200px]" />
        <DocumentArea />
        <div className="flex flex-wrap gap-8 items-center px-10 mt-7 text-2xl font-medium text-right text-stone-500 max-md:px-5">
          <button onClick={btnSelectAll}
          className="self-stretch my-auto">전체 선택</button>
          <div className="shrink-0 self-stretch w-0 border border-solid border-neutral-200 h-[33px]" />
          <button onClick={btnChangeImg}
          className="self-stretch my-auto">이미지 변경</button>
        </div>
      </section>

      <ActionButtons resultToPost={resultToPost}/>
    </main>
  );
}

export default SelectionScreen;
