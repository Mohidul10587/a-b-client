import React, { ReactNode } from "react";

interface ModalProps {
  onClose: () => void;
  children: ReactNode;
}

const AddElementModal: React.FC<ModalProps> = ({ onClose, children }) => {
  return (
    <div>{children}</div>
  );
};

export default AddElementModal;
