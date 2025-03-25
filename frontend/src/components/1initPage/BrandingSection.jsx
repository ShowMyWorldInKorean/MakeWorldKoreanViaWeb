import React from "react";

function BrandingSection() {
  return (
    <section className="flex flex-col self-stretch my-auto w-full text-black max-md:mt-10">
      <div className="flex gap-7 items-end text-4xl whitespace-nowrap">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/51d309018c1c1a811ac02f700a5ae716353cb2469b0d206ffec2f5efbdbff052?placeholderIfAbsent=true&apiKey=a074662c9a4e43468db0c0711707807b"
          alt="Brand logo"
          className="object-contain aspect-[1.75] min-w-60 w-[252px]"
        />
        <div className="h-[91px] w-[131px]">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/ff3e68ebb2f239af05e3394587143df55653c7a52985020d77f377cf48218738?placeholderIfAbsent=true&apiKey=a074662c9a4e43468db0c0711707807b"
            alt="Secondary logo"
            className="object-contain rounded-none aspect-[2.36] w-[92px]"
          />
          <div className="mt-5">Aechae</div>
        </div>
      </div>
      <h3 className="self-start mt-7 text-2xl font-medium text-center">
        원하는 사진을 우리의 글자로 자연스럽게!
      </h3>
    </section>
  );
}

export default BrandingSection;
