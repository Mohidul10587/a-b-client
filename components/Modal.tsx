import React, { useEffect } from "react";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
} from "react-icons/fa";

type ModalType = "success" | "error" | "info";

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  content: string;
  type: ModalType;
}> = ({ isOpen, onClose, content, type }) => {
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const typeStyles = {
    success: {
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      btn: "hover:bg-green-100",
      icon: <FaCheckCircle className="text-green-600 text-xl" />,
    },
    error: {
      bg: "bg-red-50",
      border: "border-red-200",
      text: "text-red-700",
      btn: "hover:bg-red-100",
      icon: <FaTimesCircle className="text-red-600 text-xl" />,
    },
    info: {
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      text: "text-yellow-700",
      btn: "hover:bg-yellow-100",
      icon: <FaExclamationCircle className="text-yellow-600 text-xl" />,
    },
  };

  const { bg, border, text, btn, icon } = typeStyles[type];

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div
        className={`relative p-4 pl-5 pr-10 rounded-md shadow-md w-[90vw] max-w-md flex items-center gap-3 ${bg} ${border} border`}
      >
        {icon}
        <p className={`text-sm font-medium ${text}`}>{content}</p>
        <button
          onClick={onClose}
          className={`absolute top-2 right-2 px-2 py-1 rounded ${btn}`}
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default Modal;
