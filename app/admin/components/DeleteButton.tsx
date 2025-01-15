import { apiUrl } from "@/app/shared/urls";
import { ReactNode } from "react";

interface ModalProps {
  children?: ReactNode;
  className?: any;
  deleteApiEndPointWithId: string;
  mutate?: any;
}

const DeleteButton: React.FC<ModalProps> = ({
  children = "Delete",
  className = "text-red-500 border border-red-500 rounded px-2 py-1",
  deleteApiEndPointWithId,
  mutate,
}) => {
  const handleDelete = async () => {
    try {
      const response = await fetch(`${apiUrl}/${deleteApiEndPointWithId}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.ok) {
        alert("Successfully deleted");

        if (mutate) {
          mutate();
        }
      } else {
        alert("Failed to delete the product");
      }
    } catch (error) {
      alert("Failed to delete the product");
    }
  };
  return (
    <button className={className} onClick={() => handleDelete()}>
      {children}
    </button>
  );
};

export default DeleteButton;
