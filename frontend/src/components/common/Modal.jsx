import React from 'react';

const Modal = ({ isOpen, modalClose, children, onConfirm, backToPrevious }) => {
    if (!isOpen) return null;



    return (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50 z-50">
            <div className="flex flex-col gap-8 items-center px-0 py-10 bg-white rounded-3xl w-[480px] max-sm:p-8 max-sm:w-[90%]">
                {children}
                <div className="flex gap-5 max-sm:flex-col max-sm:w-full">
                    <button
                        onClick={modalClose}
                        className="text-sm font-semibold text-white bg-blue-950 h-[50px] rounded-[50px] w-[150px] max-sm:w-full"
                    >
                        다시 확인하기
                    </button>
                    <button onClick={onConfirm}
                        className="text-sm font-semibold border border-solid border-zinc-300 h-[50px] rounded-[50px] text-stone-500 w-[150px] max-sm:w-full">
                        나가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
