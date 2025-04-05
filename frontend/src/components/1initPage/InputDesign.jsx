import React from "react";
import BrandingSection from "./BrandingSection";
import UploadSection from "./UploadSection";

function InputDesign() {
  return (
    <main>
        <section className="self-center mt-24 mb-0 w-full max-w-[1314px] max-md:mt-10 max-md:mb-2.5 max-md:max-w-full">
          <div className="flex gap-15 max-md:flex-col">
            <div className="w-[61%] max-md:ml-0 max-md:w-full">
              <UploadSection />
            </div>
            <div className="flex w-[39%] max-md:ml-0 max-md:w-full">
              <BrandingSection />
            </div>
          </div>
        </section>
    </main>
  );
}

export default InputDesign;
