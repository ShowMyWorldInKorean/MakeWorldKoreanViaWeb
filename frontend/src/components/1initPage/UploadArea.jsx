import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from 'uuid';

function UploadArea() {
  const [responseMessage, setResponseMessage] = useState("");
  const navigate = useNavigate();



  const handleClick = () => {
    console.log("hi");


    const userId = uuidv4();
    console.log(userId);


    const originalImage = "sample"


    const requestBody = {
      userId,
      originalImage,
    }

    const result =  {
      "success": true,
      "message": "텍스트 감지 완료",
      "data": {
        "userId": userId,
        "imageId": "img123...",
        "detectedTextBlocks": {
          "1": {
            "bbox": [[10, 20], [100, 20], [100, 50], [10, 50]],
            "detectedText": "감지된 원본 텍스트1"
          },
          "2": {
            "bbox": [[150, 30], [300, 30], [300, 80], [150, 80]],
            "detectedText": "감지된 원본 텍스트2"
          },
          "3": {
            "bbox": [[150, 32], [300, 40], [140, 80], [299, 80]],
            "detectedText": "감지된 원본 텍스트3"
          },
        }
      }
    } 


    navigate('/selectBox', {state:result})
    setResponseMessage(`Upload successful: ${result.message}`);
    console.log(result.message);
  }




  return (
    <div className="flex flex-col items-center mt-36 mb-0 max-w-full text-base leading-6 bg-white w-[321px] max-md:mt-10 max-md:mb-2.5">
      <div className="flex w-12 min-h-12" />
      <div className="text-center" onClick={handleClick}>
        <div className="flex justify-center" height="45px" >
          <img src="/Style=bold.png" width="50px" height="50px" className="pb-5" />
        </div>

        <span className="text-[20px] text-[#666666]">
          클릭 또는 드래그하여
        </span>
        <br />
        <span className="font-semibold text-[20px]">
          번역할 사진(JPG, PNG 등)
        </span>
        <span className="text-[20px] text-[#666666]">
          을 <br />
          올려주세요.
        </span>
        <br />
        <br />
        <span className="text-[15px] text-[#666666]">최대 용량: 00MB</span>
      </div>
    </div>
  );
}

export default UploadArea;
