import React, { ReactNode } from "react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

const AddElementModal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div className="inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 w-[900px] rounded-md">
        <div>{children}</div>
      </div>
    </div>
  );
};

export default AddElementModal;
