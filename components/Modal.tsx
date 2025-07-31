import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string;
  type: ModalType;
}

const icons: Record<ModalType, JSX.Element> = {
  success: (
    <svg
      className="w-6 h-6 text-green-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  ),
  error: (
    <svg
      className="w-6 h-6 text-red-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
  info: (
    <svg
      className="w-6 h-6 text-blue-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z"
      />
    </svg>
  ),
  warning: (
    <svg
      className="w-6 h-6 text-yellow-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
      />
    </svg>
  ),
  loading: (
    <svg className="w-6 h-6 text-gray-600 animate-spin" viewBox="0 0 50 50">
      <circle
        className="opacity-30"
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="5"
        fill="none"
      />
      <path
        fill="currentColor"
        d="M25 5a20 20 0 0120 20h-5a15 15 0 00-15-15V5z"
      />
    </svg>
  ),
};

const typeStyles: Record<ModalType, string> = {
  success: "bg-green-50 border border-green-200 text-green-800",
  error: "bg-red-50 border border-red-200 text-red-800",
  info: "bg-blue-50 border border-blue-200 text-blue-800",
  warning: "bg-yellow-50 border border-yellow-200 text-yellow-800",
  loading: "bg-gray-100 border border-gray-200 text-gray-800",
};

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, content, type }) => {
  useEffect(() => {
    if (!isOpen || type === "loading") return;
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [isOpen, onClose, type]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 animate-slide-down">
      <div
        className={`relative max-w-md w-[90vw] rounded-lg shadow-lg px-4 py-3 flex items-center gap-3 ${typeStyles[type]}`}
      >
        {icons[type]}
        <p className="text-sm font-medium">{content}</p>
        {type !== "loading" && (
          <button
            onClick={onClose}
            className="absolute top-2 right-2 rounded border border-gray-500 px-1 text-sm text-gray-500 hover:text-gray-700"
          >
            ✖
          </button>
        )}
      </div>
    </div>
  );
};

export default Modal;
