import React from "react";
import LanguageSelector from "./LanguageSelector";
import UploadArea from "./UploadArea";

function UploadSection() {
  return (
    <section className="flex flex-col grow text-center text-black max-md:mt-10 max-md:max-w-full">
      <h2 className="self-center text-3xl font-semibold max-md:max-w-full">
        번역을 원하는 사진을 업로드해주세요
      </h2>
      <div className="flex flex-col items-center px-px pt-5 pb-52 mt-9 w-full bg-white rounded-3xl border border-solid border-[#D6D6D6] max-md:pb-24 max-md:max-w-full">
        <LanguageSelector />
        <UploadArea />
      </div>
    </section>
  );
}

export default UploadSection;
