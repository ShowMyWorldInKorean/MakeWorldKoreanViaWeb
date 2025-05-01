import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import Modal from "../common/Modal";

function ActionButtons({ resultToPost }) {
  const location = useLocation();
  const navigate = useNavigate();


  const handleClickToText = () => {
    resultToPost.outputType = "1"
    console.log(resultToPost.outputType);

    navigate('/result', { state: resultToPost })
    // setResponseMessage(`Upload successful: ${result.message}`);
    // console.log(result.message);
  }

  const handleClickToImg = () => {
    resultToPost.outputType = "2"
    console.log(resultToPost.outputType);
    navigate('/result', { state: resultToPost })

  }


  return (
    <>
    <div className="flex justify-center gap-10 mt-5 max-w-full text-xl font-semibold text-center text-blue-950 w-[620px]">
      <button onClick={handleClickToText}
        className="flex flex-1 gap-2.5 justify-center items-center  bg-white border border-[0.7px] border-[color:var(--Point-color-Point-400,#313E86)] min-h-[80px] rounded-[50px] max-md:px-3">
        <div className="h-[30px] w-[30px]">
          <img src="/editIcon.png" />
        </div>
        <span>텍스트로 번역</span>
      </button>
      <button onClick={handleClickToImg}
        className="flex flex-1 gap-2.5 justify-center items-center  bg-white border border-[0.7px] border-[color:var(--Point-color-Point-400,#00106A)] min-h-[80px] rounded-[50px] max-md:px-3">
        <div className="h-[30px] w-[30px]">
          <img src="/galleryIcon.png" />

        </div>
        <span color="00106A">이미지로 번역</span>
      </button>
    </div>

    <Modal
      isOpen={isLoading}
      modalClose={() => setIsLoading(false)}
      onConfirm={() => setIsLoading(false)}
    >
      <div className="flex flex-col items-center">
        <img src="/LoadingIcon.png" alt="로딩 중" className="w-20 h-20 mb-4" />
        <h2 className="text-2xl font-bold">사진을 열심히 번역하고 있어요!</h2>
      </div>
    </Modal>
    </>
  );
}

export default ActionButtons;
