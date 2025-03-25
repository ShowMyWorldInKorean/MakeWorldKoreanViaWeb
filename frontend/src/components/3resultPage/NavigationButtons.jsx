import React from "react";
import { useNavigate } from "react-router-dom";

function NavigationButtons() {
const navigate = useNavigate();
// const location = useLocation();


const handleClickToInit = ()=>{
  const confirmMsg = window.confirm("첫 화면으로 나갈까요?")

      //모달창으로 바꾸기
      if (confirmMsg) {
        navigate('/')
      }
}

const handleClickToBack = ()=>{
  console.log("back");
    //다시 데이터 가지고 가야함
// navigate('/selectBox', result~)
}


  return (
    <div className="flex justify-center gap-10 mt-5 max-w-full text-xl font-semibold text-center text-blue-950 w-[620px]">
      <button onClick={handleClickToInit}
      className="flex flex-1 gap-2.5 justify-center items-center  bg-white border border-[0.7px] border-[color:var(--Point-color-Point-400,#313E86)] min-h-[80px] rounded-[50px] max-md:px-3">
        <div className="h-[30px] w-[30px]">
          <img src="/home.png"/>
        </div>
        <span>처음으로</span>
      </button>
      <button  onClick={handleClickToBack}
      className="flex flex-1 gap-2.5 justify-center items-center  bg-white border border-[0.7px] border-[color:var(--Point-color-Point-400,#00106A)] min-h-[80px] rounded-[50px] max-md:px-3">
        <div className="h-[30px] w-[30px]">
        <img src="/arrow-left.png"/>
        </div>
        <span color="00106A">이전으로</span>
      </button>
    </div>
  );
}

export default NavigationButtons;
