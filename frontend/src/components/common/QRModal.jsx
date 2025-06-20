// QRModal.jsx
import React from "react";
import QRCode from "react-qr-code";

function QRModal({ onClose, url }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white p-6 rounded-xl shadow-xl text-center">
        <h2 className="text-xl font-bold mb-4">홈페이지 QR 코드</h2>
        <div className="bg-white p-4">
          <QRCode value={url} size={200} />
        </div>
        <button
          onClick={onClose}
          style={{ backgroundColor: '#00106A'}}
          className="mt-4 px-4 py-2 text-white rounded hover:opacity-80"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default QRModal;
