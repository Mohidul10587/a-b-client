import { ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

const EditElementModal: React.FC<ModalProps> = ({ children, onClose }) => {
  return (
    <div className="fixed md:py-12 top-0 bottom-0 left-0 right-0 bg-black/50 z-[100]">
      {children}
    </div>
  );
};

export default EditElementModal;
