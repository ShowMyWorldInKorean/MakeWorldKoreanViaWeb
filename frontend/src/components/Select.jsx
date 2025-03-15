import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Main.css";
import MainNav from "./MainNav";
// src\assets\temp2.jpg
// src\components\Select.jsx


const Select = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(""); // 이미지 URL
  const [objects, setObjects] = useState([]); // 객체 데이터
  const [error, setError] = useState(""); // 에러 메시지
  const [selectedObjectIds, setSelectedObjectIds] = useState([]); // 선택된 객체 ID 배열
  const [serverMessage, setServerMessage] = useState(""); // 서버 응답 메시지
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

  // useEffect(() => {
  //   if (location.state && location.state.image && location.state.coor) {
  //     const base64Image = location.state.image;

  //     if (!base64Image.startsWith("data:image/")) {
  //       setImageSrc(`data:image/png;base64,${base64Image}`);
  //     } else {
  //       setImageSrc(base64Image);
  //     }

  //     setObjects(location.state.coor); // 전달된 객체 데이터 설정
  //     setError(""); // 에러 초기화
  //   } else {
  //     setError("이미지 데이터가 전달되지 않았습니다.");
  //   }
  // }, [location.state]);
  //------------------------------- 위아래로 주석 풀기/채우기
  //   setImageSrc(tempImg);
  //   setObjects([
  //     // 임시 객체 데이터 추가
  //     {
  //       id: 1,
  //       polygon: [
  //         [50, 50],
  //         [500, 50],
  //         [500, 500],
  //         [50, 500],
  //       ],
  //       type: "id_card"
  //       // type: "sign"
  //     },
  //   ]);
  //   setError("");
  // }, []);
  // -----------------------------------

  const resultRaw = location.state
  const resultStr = JSON.stringify(resultRaw)
  const result = JSON.parse(resultStr)

  console.log("넘어 온 데이터 :", result.success);
  console.log("넘어 온 데이터1 :", result.message);
  console.log("넘어 온 데이터2 :", result.data.detectedTextBlocks);
  console.log("넘어 온 데이터id :", result.data.userId);



  const handleGoBack = () => {
    navigate("/");
  };
  
  const handleSendToServer = () => {
  // const handleSendToServer = async () => {
  //   if (selectedObjectIds.length === 0) {
  //     setError("선택된 객체가 없습니다. 먼저 객체를 선택해주세요.");
  //     return;
  //   }

    // setIsLoading(true); // 로딩 시작
    console.log(JSON.stringify({ selected_ids: selectedObjectIds }));

    // try {
    //   const response = await fetch("http://localhost:5000/load_result", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ selected_ids: selectedObjectIds }),
    //   });

    //   // console.log(JSON.stringify({ selected_ids: selectedObjectIds }));
    //   const data = await response.json();

    const resultToPost = {
      "userId": result.data.userId,
      "imageId": result.data.imageId, 
      "targetTextBlocks": [result.data.detectedTextBlocks["1"], result.data.detectedTextBlocks["3"],],
      "sourceLanguage": "en",
      "targetLanguage": "ko",
      "outputType": 2
    }
     
    console.log("resultToPost: ",resultToPost);
    


          navigate("/Output", { state: { result: resultToPost } }); // Output 페이지로 결과 전달

  //     if (response.ok) {
  //       setServerMessage(data.message); // 서버의 성공 메시지 표시
  //       navigate("/Output", { state: { result: data.result } }); // Output 페이지로 결과 전달
  //     } else {
  //       setError(`서버 오류: ${data.message}`);
  //     }
  //   } catch (error) {
  //     setError("서버 요청에 실패했습니다. 네트워크 상태를 확인해주세요.");
  //   } finally {
  //     setIsLoading(false); // 로딩 종료
  //   }
  };

  return (
    <div>
      <MainNav />

      {error && <div style={{ color: "red", marginTop: "10px" }}>{error}</div>}
      {serverMessage && <div style={{ color: "green", marginTop: "10px" }}>{serverMessage}</div>}
      {isLoading && (
        <div className="lock-loading">
          <div className="lock">
            <div className="lock-body"></div>
            <div className="lock-shackle"></div>
          </div>
          <h3>잠시만 기다려주세요...</h3>
        </div>
      )}
      <div className="container_row" style={{ display: isLoading ? "none" : "flex" }}>

        <div className="box">
          <div className="alert_col">
            <h3>사진에 표시된<br />객체들 중<br />가리고 싶은 대상을<br />선택해주세요.</h3>
          </div>
          <div >
            <div className="align-center">
              <button className="upload_button" onClick={handleGoBack}>
                이전 페이지로
              </button>
              <button className="upload_button" onClick={handleSendToServer}>
                선택 완료
              </button>
            </div>
          </div>

        </div>
        <div>
          <h1>텍스트 감지 결과</h1>
          {/* 마땅한 이미지파일이 아니었을 경우, 아래 부분이 detectedTextBlocks가 없는게 맞는지 모르겠음(or data) */}
          {(!result.data.detectedTextBlocks) ? "감지된 것이 없슈" :
            <>
              <p>{result.message}</p>
              <h2>감지된 텍스트:</h2>
              <ul>
                {Object.entries(result.data.detectedTextBlocks).map(([key, value]) => (
                  <li key={key}>
                    <strong>{value.detectedText}</strong>
                    (좌표: {JSON.stringify(value.bbox)})
                  </li>
                ))}
              </ul>
            </>
          }

        </div>
      </div>
    </div>
  );
};

export default Select;
