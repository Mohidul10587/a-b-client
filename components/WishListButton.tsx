import { apiUrl } from "@/app/shared/urls";
import { useData } from "@/app/DataContext";
import { FC, ReactNode, useState } from "react";

import { AuthModal } from "@/app/auth/AuthModal";

interface ModalProps {
  children?: ReactNode;
  className?: any;
  apiEndPoint: string;
  mute?: () => void;
  productId: string;
}

const WishListButton: React.FC<ModalProps> = ({
  children = "Add to wishlist",
  className = "text-red-500 border border-red-500 rounded px-2 py-1",
  apiEndPoint,
  mute,
  productId,
}) => {
  const { showModal, sessionStatus } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddToWishList = async (productId: string) => {
    if (sessionStatus !== "authenticated") {
      setIsModalOpen(true);
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/${apiEndPoint}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ productId }),
      });
      const data = await response.json();
      showModal(data.message, response.ok ? "success" : "info");
    } catch (error) {
      alert("Failed to add the product");
    }
  };

  return (
    <>
      <button
        className={className}
        onClick={() => handleAddToWishList(productId)}
      >
        {children}
      </button>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-11/12">
            <h2 className="text-lg font-bold mb-4">Sign In Required</h2>
            <p className="mb-4 text-orange-500">
              You need to sign in to add products to your wishlist. Please log
              in or create an account to continue.
            </p>

            <AuthModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            />
            <div className="flex justify-end space-x-4">
              <button
                className="bg-gray-300 px-4 py-2 rounded text-gray-800"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WishListButton;
