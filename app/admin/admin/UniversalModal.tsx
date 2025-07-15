import React, { ReactNode } from "react";

const Modal: React.FC<{
  modalIsOpen: boolean;
  setModalIsOpen: any;
  children: ReactNode;
  className: string;
}> = ({ modalIsOpen, setModalIsOpen, children, className }) => {
  if (!modalIsOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`relative bg-white p-6 rounded-lg shadow-lg ${className}`}
      >
        <button
          onClick={() => setModalIsOpen(false)}
          className="absolute top-0 right-0 px-2 py-1 bg-main text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 16 16"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="m7.116 8l-4.558 4.558l.884.884L8 8.884l4.558 4.558l.884-.884L8.884 8l4.558-4.558l-.884-.884L8 7.116L3.442 2.558l-.884.884z"
              clipRule="evenodd"
            />
          </svg>
      </button>
        <div className="text-center">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
