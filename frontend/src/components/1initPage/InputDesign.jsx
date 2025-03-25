import React from "react";
import Header from "./Header";
import UploadSection from "./UploadSection";
import BrandingSection from "./BrandingSection";

function InputDesign() {
  return (
    <main className="overflow-hidden bg-white">
      <div className="flex flex-col pb-36 w-full bg-stone-50 max-md:pb-24 max-md:max-w-full">
        <Header />
        <section className="self-center mt-24 mb-0 w-full max-w-[1314px] max-md:mt-10 max-md:mb-2.5 max-md:max-w-full">
          <div className="flex gap-15 max-md:flex-col">
            <div className="w-[61%] max-md:ml-0 max-md:w-full">
              <UploadSection />
            </div>
            <div className="flex ml-5 mr-5 w-[39%] max-md:ml-0 max-md:w-full">
              <BrandingSection />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

export default InputDesign;
