import React, { useState } from "react"

function DocumentArea({ base64Image }) {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  }

  console.log("base64Image 전달됨?", base64Image);


  return (
    <div className="flex flex-col items-center self-center w-full bg-zinc-800 max-w-[1140px]  max-md:max-w-full"
      style={{
        width: "880px",  // 너비 고정
        height: "600px", // 높이 고정정
        overflow: "hidden",
      }}>


      <div className="w-full flex justify-center">
        <div className="relative" >
          <img
            src={base64Image}
            alt="업로드 이미지"
            className="max-w-full max-h-[600px]"
          />

          <button
            onClick={() => toggleSelection("item1")}
            className="absolute top-[50px] left-[100px] w-[120px] h-[40px] border border-gray-400 rounded-[7px] bg-white/20"
          >
            
          </button>
          <button
            onClick={() => toggleSelection("item2")}
            className="absolute top-[120px] left-[200px] w-[140px] h-[40px] border border-gray-400 rounded-[7px] bg-white/20"
          >
            
          </button>
          <button
            onClick={() => toggleSelection("item3")}
            className="absolute top-[200px] left-[150px] w-[160px] h-[40px] border border-gray-400 rounded-[7px] bg-white/20"
          >
            
          </button>
        </div>
      </div>






    </div>
  );
}

export default DocumentArea;
