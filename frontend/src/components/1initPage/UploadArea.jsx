import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useDropzone } from "react-dropzone";

// 간단한 모달 컴포넌트 정의
function LoadingModal({ show }) {
  if (!show) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(2px)",
      }}
    >
      {/* AppIcon.png가 위, 그 아래에 '번역 중입니다...'가 나오도록 수정 */}
      <div className="flex flex-col items-center">
        <img
          src="icon_only.png"
          alt="로딩 중"
          width="400"
          height="400"
          style={{
            animation: "bounce 1s infinite"
          }}
        />
        <span className="text-lg font-semibold text-gray-700 mt-4">글씨를 찾고 있어요...</span>
      </div>
      <style>
        {`
          @keyframes bounce {
            0%, 100% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-20px);
            }
          }
        `}
      </style>
    </div>
  );
}

function UploadArea() {
  const [responseMessage, setResponseMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const fileInputRef = useRef(null)



  //dropzone
  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => handleFileSelect(acceptedFiles), //파일 선택시 실행
  })

  const handleFileSelect = (acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {

      handleFileProcessing(file); //파일타입검사, 로딩-2초 코드 묶음음


    }
  }



  //클릭해서 파일 여는 함수
  const handleClick = () => {

    if (fileInputRef.current) {
      fileInputRef.current.click()

    }
  }


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileProcessing(file)
    }
  }



  const handleFileProcessing = async (file) => {
    console.log("선택된 파일", file)

    if (!file || !file.type.startsWith("image/")) {
      alert("이미지 파일만 선택 가능합니다.")
      return;
    }
    setLoading(true);




    try {
      //2초 로딩시간 유지
      setTimeout(() => {


        const reader = new FileReader()

        reader.onloadend = async () => {
          const base64Image = reader.result.split(",")[1]

          const payload = {
            userid: uuidv4(),
            originalImage: base64Image
          }



          const response = await fetch("http://localhost:8000/api/v1/text-detection", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)

          })

          if (!response.ok) {
            throw new error("서버 응답에 실패하였습니다.")
          }

          const result = await response.json()
          console.log("API응답 : ", result)


          setLoading(false);
          setResponseMessage(`Upload successful: ${result.message}`)
          navigate("/selectBox", { 
            state: {
              ...result, 
              base64Image: reader.result, 
            }
            })


        }

        reader.readAsDataURL(file) //base64로 읽기
      }, 2000);
    } catch (error) {
      console.error("에러 발생 : ", error)
      setLoading(false)
      alert("파일 업로드에 실패했어요")
    }


  }



  return (
    <>
      <LoadingModal show={loading} />
      <div
        className="flex flex-col items-center justify-center py-42 w-full bg-white rounded-lg cursor-pointer hover:bg-gray-100 transition-all duration-200"
        {...getRootProps()} //드래그앤드랍랍
        onClick={handleClick}
      >
        <img src="/FileUploadIcon.png" width="50px" height="50px" className="mb-3" alt="파일 업로드 아이콘" />
        <span className="text-[18px] text-gray-700">
          클릭 또는 드래그하여
        </span>
        <span className="text-[18px] font-semibold text-gray-900">
          <b>번역할 사진(JPG, PNG 등)</b>을 올려주세요.
        </span>
        <span className="mt-2 text-sm text-gray-500">최대 용량: 00MB</span>


        <input
          {...getInputProps()}//드래그앤드랍
          ref={fileInputRef}
          type="file"
          accept="image/*" // 이미지 파일만 선택 가능
          style={{ display: "none" }} // 화면에 보이지 않도록 숨김
          onChange={handleFileChange}
        />

      </div>
    </>
  );
}

export default UploadArea;
