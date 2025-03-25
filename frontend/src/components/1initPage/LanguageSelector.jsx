import React from "react";

function LanguageSelector() {
  return (
    <>
      <div className="flex flex-wrap gap-10 justify-between items-center self-stretch px-24 text-2xl font-semibold bg-white max-md:px-5 max-md:max-w-full">
        <div className="self-stretch my-auto w-[63px]">영어 </div>
        <img src="\translanteArrow.png" width="25" height="25"/>
        <div className="self-stretch my-auto">한국어</div>
      </div>
      <div className="shrink-0 mt-3.5 max-w-full h-px border border-solid bg-neutral-200 border-neutral-200 w-[598px]" />
    </>
  );
}

export default LanguageSelector;
