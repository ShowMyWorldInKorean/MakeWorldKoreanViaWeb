import React from "react";

function OriginalTextPanel() {
  return (
    <article className="w-6/12 max-md:ml-0 max-md:w-full">
      <div className="flex flex-col grow max-md:mt-10 max-md:max-w-full">
      
        <div className="flex flex-col justify-center py-7 w-120 bg-zinc-800 max-md:max-w-full">
          <div className="flex flex-col items-start py-30 w-full bg-white max-md:pr-5 max-md:pb-24 max-md:max-w-full">
            <div className="flex shrink-0 rounded-xl border-solid border-[0.682px] border-[color:var(--Point-color-Point-001,#E00)] h-[47px] w-[229px]" />
            <div className="flex gap-3 mt-4 -mb-6 max-md:mb-2.5">
              <div className="flex shrink-0 rounded-xl border-solid border-[0.682px] border-[color:var(--Point-color-Point-001,#E00)] h-[47px] w-[188px]" />
              <div className="flex shrink-0 rounded-xl border-solid border-[0.682px] border-[color:var(--Point-color-Point-001,#E00)] h-[47px] w-[188px]" />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default OriginalTextPanel;
