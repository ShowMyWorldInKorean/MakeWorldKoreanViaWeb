import React from "react";

function LanguageSelector() {
  return (
    <div className="flex flex-wrap gap-10 justify-between items-center px-56 text-3xl font-semibold text-center text-black max-md:px-5 max-md:max-w-full">
      <h2 className="self-stretch my-auto w-[63px]">영어 </h2>
      <img src="\translanteArrow.png" width="30" height="30"/>

      <h2 className="self-stretch my-auto">한국어</h2>
    </div>
  );
}

export default LanguageSelector;
