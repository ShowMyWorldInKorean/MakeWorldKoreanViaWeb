import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";

function Frame() {
  return (
    <main className="overflow-hidden bg-white">
      {/* 🔥 여백 줄이기: pb-36 → pb-10 */}
      <div className="flex flex-col pb-10 w-full bg-stone-50 max-md:pb-2 max-md:max-w-full">
        <Header />
        <section className="mx-auto w-full max-w-[1314px] px-[80px] max-md:px-5">
          {/* 🔥 기존 grid 삭제하고 flex 적용 */}
          <div className="flex justify-between gap-[70px] max-md:flex-col">
            <Outlet />
          </div>
        </section>
      </div>
    </main>
  );
}

export default Frame;
