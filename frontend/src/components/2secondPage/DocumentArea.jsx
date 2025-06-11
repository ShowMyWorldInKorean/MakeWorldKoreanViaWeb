import React, { useEffect, useState } from "react";

function DocumentArea({ base64Image, blocks }) {
  const [originalSize, setOriginalSize] = useState(null);
  const renderedWidth = 800;
  const renderedHeight = 600;

  useEffect(() => {
    if (!base64Image) return;

    const img = new Image();
    img.onload = () => {
      setOriginalSize({
        width: img.width,
        height: img.height
      });
    };
    img.src = base64Image;
  }, [base64Image]);

  if (!originalSize) {
    return <div className="text-white">이미지 로딩 중...</div>;
  }

  const scaleX = renderedWidth / originalSize.width;
  const scaleY = renderedHeight / originalSize.height;

  return (
    <div className="flex justify-center items-center">
      <div
        className="relative"
        style={{ width: `${renderedWidth}px`, height: `${renderedHeight}px` }}
      >
        <img
          src={base64Image}
          alt="업로드 이미지"
          style={{ width: `${renderedWidth}px`, height: `${renderedHeight}px` }}
        />

        {blocks.map((block, index) => {
          const bbox = block.bbox;
          if (!bbox || bbox.length !== 4) return null;

          const [x1, y1] = bbox[0];
          const [x2] = bbox[1];
          const [, , , [x4, y4]] = bbox;

          const width = (x2 - x1) * scaleX;
          const height = (y4 - y1) * scaleY;

          const left = x1 * scaleX;
          const top = y1 * scaleY;

          return (
            <div
              key={index}
              className="absolute border border-red-500 rounded-lg"
              style={{
                left: `${left}px`,
                top: `${top}px`,
                width: `${width}px`,
                height: `${height}px`,
                zIndex: 10,
                border: '2px solid #00106A'
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

export default DocumentArea;
