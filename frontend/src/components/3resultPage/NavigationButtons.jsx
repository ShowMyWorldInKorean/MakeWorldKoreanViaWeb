import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../common/Modal";

function NavigationButtons({ outputType }) {
  const navigate = useNavigate();
  const [actionType, setActionType] = useState(""); // home 또는 back
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  
  
  const handleHomeClick = () => {
    setActionType("home")
    setIsOpen(true)
  }

  const handleBackClick = () => {
    setActionType("back")
    setIsOpen(true)
  }


  const modalClose = () => {
    setIsOpen(false);
  };

  const backToPrevious = ()=>{
    setIsOpen(false)
      if(actionType==="home"){
                navigate("/")
      }else if(actionType === "back"){
                navigate(-1)
      }
  }


  return (
    <div className="flex justify-center gap-10 mt-5 max-w-full text-xl font-semibold text-center text-blue-950 w-[620px]">
      <button onClick={handleHomeClick}
        className="flex flex-1 gap-2.5 justify-center items-center  bg-white border border-[0.7px] border-[color:var(--Point-color-Point-400,#313E86)] min-h-[80px] rounded-[50px] max-md:px-3">
        <div className="h-[30px] w-[30px]">
          <img src="/homeIcon.png" />
        </div>
        <span>처음으로</span>
      </button>
      <button onClick={handleBackClick}
        className="flex flex-1 gap-2.5 justify-center items-center  bg-white border border-[0.7px] border-[color:var(--Point-color-Point-400,#00106A)] min-h-[80px] rounded-[50px] max-md:px-3">
        <div className="h-[30px] w-[30px]">
          <img src="/arrow-left.png" />
        </div>
        <span color="00106A">이전으로</span>
      </button>
    
    
      <Modal isOpen={isOpen} modalClose={modalClose} onConfirm={backToPrevious}>
        <div className="flex flex-col gap-2 items-center">
       
          {outputType === '1' ?
            <>
            <h2 className="text-2xl font-semibold"> 결과를 확인하셨나요?</h2>
            <p className="text-base text-center">결과가 모두 사라지고
              {actionType==='home'? ' 첫':' 이전'} 화면으로 돌아갑니다.</p>
            </>
            : 
            <>
            <h2 className="text-2xl font-semibold">이미지를 다운로드 하셨나요?</h2>
            <p className="text-base text-center">결과가 모두 사라지고
              {actionType==='home'? ' 첫':' 이전'} 화면으로 돌아갑니다.</p>
            </>
          }
           
          </div>

      </Modal>
    
     
    </div>
  );
}

export default NavigationButtons;
