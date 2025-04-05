import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

function UploadArea() {
  const selectedFiles = useRef(null); 
  const navigate = useNavigate();

  
  const handleFileChange = (e)=>{

    const file = e.target.files[0];
    if(file){

      navigate("/selectBox", { state: {file} });
    }



  }
  return (

    
    <div
    className="flex flex-col items-center justify-center py-42 w-full bg-white rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200"
    onClick={() => selectedFiles.current?.click()}
  >
    <input 
        ref={selectedFiles}  //ref 연결
        type={'file'} 
        className="hidden" // display:none
        onChange={handleFileChange}
  />
    <img src="/FileUploadIcon.png" width="50px" height="50px" className="mb-3" alt="파일 업로드 아이콘" />
    
    <span className="text-[18px] text-gray-700">
      클릭 또는 드래그하여
    </span>
    <span className="text-[18px] font-semibold text-gray-900">
      <b>번역할 사진(JPG, PNG 등)</b>을 올려주세요.
    </span>
    <span className="mt-2 text-sm text-gray-500">최대 용량: 00MB</span>
  </div>
  );
}

export default UploadArea;
