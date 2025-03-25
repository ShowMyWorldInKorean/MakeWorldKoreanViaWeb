import React, { useState } from "react";

function DocumentArea() {
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleSelection = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  return (
    <div className="flex flex-col items-center self-center px-20 w-full bg-zinc-800 max-w-[1140px] max-md:px-5 max-md:max-w-full">
      <div className="flex flex-col items-start py-36 pr-20 pl-7 max-w-full bg-white w-[880px] max-md:px-5 max-md:py-24">
        <button
          onClick={() => toggleSelection("item1")}
          className="flex shrink-0 max-w-full rounded-3xl border border-solid border-[color:var(--Neutral-color-Neutral-400,#A0A0A0)] h-[69px] w-[336px]"
          aria-label="Select item 1"
        />
        <div className="flex flex-wrap gap-4 mt-7 mb-0 max-md:mb-2.5">
          <button
            onClick={() => toggleSelection("item2")}
            className="flex shrink-0 max-w-full rounded-3xl border border-solid border-[color:var(--Neutral-color-Neutral-400,#A0A0A0)] h-[69px] w-[276px]"
            aria-label="Select item 2"
          />
          <button
            onClick={() => toggleSelection("item3")}
            className="flex shrink-0 max-w-full rounded-3xl border border-solid border-[color:var(--Neutral-color-Neutral-400,#A0A0A0)] h-[69px] w-[276px]"
            aria-label="Select item 3"
          />
        </div>
      </div>
    </div>
  );
}

export default DocumentArea;
