import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function ActionButtons({ resultToPost }) {
  const location = useLocation();
  const navigate = useNavigate();

  console.log("보낼 데이터:", resultToPost);

  const handleClickToText = () => {
    resultToPost.outputType = "1"
    console.log(resultToPost.outputType);

    navigate('/result', { state: resultToPost })
    // setResponseMessage(`Upload successful: ${result.message}`);
    // console.log(result.message);
  }

  const handleClickToImg = async () => {
    resultToPost.outputType = "2";
    console.log("보낼 데이터:", resultToPost);
    const payload = { ...resultToPost, outputType: 2 };
    console.log("📦 보낼 데이터:", payload);

    await fetch("http://localhost:8000/api/v1/translate", {
      method : "POST",
      headers: { "Content-Type": "application/json" },
      body   : JSON.stringify(payload),
    });
    
    try {
      const response = await fetch("http://localhost:8000/api/v1/translate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resultToPost),
      });
  
      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }
  
      const responseData = await response.json();
      console.log("응답 받은 데이터:", responseData);
  
      navigate("/result", { state: responseData });
  
    } catch (error) {
      console.error("번역 요청 실패:", error);
      alert("번역 요청에 실패했습니다. 다시 시도해주세요.");
    }
  };
  


  return (
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
  );
}

export default ActionButtons;
