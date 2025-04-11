import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "./Modal";


function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {


    if (location.pathname == '/') {
      window.location.reload();
    } else {
      setIsOpen(true);
    }


  }
  const modalClose = () => {
    setIsOpen(false);
  }
  const backToHome = () => {
    setIsOpen(false);
    navigate('/')
  };




  return (
    <header className="flex flex-wrap gap-10 justify-between items-center pr-10 pl-10 w-full min-h-[100px] max-md:px-5 max-md:max-w-full">
      <div className="flex gap-8 items-center self-stretch pt-2.5 my-auto min-h-[100px] w-[125px]">

        <img onClick={openModal}

          src="https://cdn.builder.io/api/v1/image/assets/TEMP/e140f127d3b775b140526766ab0eb6d01d3c20814da123520a30eb8147661e49?placeholderIfAbsent=true&apiKey=a074662c9a4e43468db0c0711707807b"
          alt="Company Logo"
          className="object-contain self-stretch my-auto rounded-none aspect-[2.5] w-[125px]"
        />
        <Modal isOpen={isOpen} modalClose={modalClose} onConfirm={backToHome}>
          <div className="flex flex-col gap-2 items-center">
            <h2 className="text-2xl font-semibold">첫 화면으로 나갈까요?</h2>
            <p className="text-base text-center">
              진행상황이 모두 사라지고 첫 화면으로 돌아갑니다.
            </p>
          </div>
                 </Modal>

      </div>
      <div className="flex gap-6 items-center self-stretch my-auto text-xl text-center text-white min-w-60">
        <div className="flex self-stretch my-auto rounded-none min-w-80 w-[285px]">
          <div className="flex-auto gap-2.5 self-stretch py-2.5 pr-3 pl-3 rounded-lg bg-blue-950">
            <h5>
              <span className="font-semibold">모바일</span>에서도 만날 수
              있어요!
            </h5>
          </div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/158c85571c79b9bdd0d556a92a3ad751601d2aa6a600801c253d518f79be5d6d?placeholderIfAbsent=true&apiKey=a074662c9a4e43468db0c0711707807b"
            alt="Mobile icon"
            className="object-contain shrink-0 my-auto aspect-[0.9] w-[18px]"
          />
        </div>
        <img
          src="\AppIcon.png"
          alt="QR code"
          className="object-contain shrink-0 self-stretch my-auto aspect-[1/1] w-[60px]"
        />
      </div>
    </header>
  );
}

export default Header;
