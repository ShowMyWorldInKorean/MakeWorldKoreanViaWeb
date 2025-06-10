import React, { useState } from "react";

import LanguageSelector from "./LanguageSelector2";
import DocumentArea from "./DocumentArea";
import ActionButtons from "./ActionButtons";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../common/Modal";
import Header from "../common/Header";

function SelectionScreen() {

  const location = useLocation();
  const navigate = useNavigate();
  const  [isOpen, setIsOpen] = useState(false);
  const modalOpen = ()=>{
    
    setIsOpen(true)
  }

  const backToHome = () => {
    setIsOpen(false);
    navigate('/')
  };

  const modalClose = () => {
    setIsOpen(false);
  };

const result = location.state;
const base64Image = result.base64Image;
const resultRaw = location.state
const resultStr = JSON.stringify(resultRaw)
  // const resultJSON = JSON.parse(resultStr)


  console.log("넘어 온 데이터 :", result);
  console.log("넘어 온 데이터 :", result.data.detectedTextBlocks); //object
  console.log("넘어 온 데이터 :", resultJSON);

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



  return (
    <main className="flex overflow-hidden flex-col items-center pb-12 bg-stone-50">
      <h1 className="mt-10 text-4xl font-semibold text-center text-black max-md:max-w-full">
        번역을 원하는 부분을 모두 선택해주세요
      </h1>

      <section className="flex flex-col py-7 mt-9 mb-3.5 w-full bg-white border-solid border-[0.7px] border-[color:var(--Neutral-color-Neutral-300,#D6D6D6)] max-w-[1282px] rounded-[30px] max-md:max-w-full">
        <LanguageSelector />
        <hr className="shrink-0 self-center mt-5 max-w-full h-px border border-solid border-neutral-200 w-[1200px]" />
        <DocumentArea base64Image={base64Image}/>
        <div className="flex flex-wrap gap-8 items-center px-10 mt-7 text-2xl font-medium text-right text-stone-500 max-md:px-5">
          <button onClick={btnSelectAll}
          className="self-stretch my-auto">전체 선택</button>
          <div className="shrink-0 self-stretch w-0 border border-solid border-neutral-200 h-[33px]" />
          <button onClick={modalOpen}
          className="self-stretch my-auto">이미지 변경</button>
         <Modal isOpen={isOpen} modalClose={modalClose} onConfirm={backToHome}>
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-2xl font-semibold">이미지를 변경하시겠어요?</h2>
            <p className="text-base text-center">
              진행상황이 모두 사라지고 첫 화면으로 돌아갑니다.
            </p>
          </div>
                 </Modal>

        </div>
      </section>

      <ActionButtons resultToPost={resultToPost}/>
    </main>
  );
}

export default SelectionScreen;
