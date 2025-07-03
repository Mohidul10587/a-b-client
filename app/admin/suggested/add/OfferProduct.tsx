"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/types/product";

import { apiUrl } from "@/app/shared/urls";
import Modal from "../../admin/Modal";

type OfferProductProps = {
  items: IProduct[];
  onRemove: (index: number) => void;
};

const OfferProduct: React.FC<OfferProductProps> = ({ items, onRemove }) => {
  const [title, setTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const products = items.map((item) => item._id);

  const handleSubmit = async () => {
    // Validation: Ensure there's at least one product and a title
    if (!title.trim()) {
      setModalContent("Please provide a title ");
      setIsModalOpen(true);
      return;
    }

    if (products.length === 0) {
      setModalContent("Please  add at least one product.");
      setIsModalOpen(true);
      return;
    }

    const data = { title, products };

    try {
      setModalContent("Processing...");
      setIsModalOpen(true);

      const response = await fetch(`${apiUrl}/suggestion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setModalContent("Data submitted successfully!");
      } else {
        setModalContent("Failed to submit data.");
      }
    } catch (error) {
      setModalContent("An error occurred while submitting data.");
    } finally {
      setIsModalOpen(true); // Show the modal with the response message
    }
  };

  return (
    <>
      <div className="my-4">
        <h1>Suggested Title</h1>
        <input
          type="text"
          className="p-2 border outline-0"
          placeholder="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          className="ml-2 p-2 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
      </div>

      <div className="w-full max-h-96 overflow-y-auto">
        <div className="grid grid-cols-6 gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="border p-2 flex items-center justify-between bg-white relative"
            >
              <Link href={"/"} className="flex items-center space-x-2">
                <Image
                  src={item.img}
                  alt={item.title}
                  width={50}
                  height={50}
                  className="object-cover"
                  unoptimized
                />
                <div>
                  <h2 className="text-sm line-clamp-1">{item.title}</h2>
                  <p className="text-sm text-gray-600">{item.sellingPrice}</p>
                </div>
              </Link>
              <button
                onClick={() => onRemove(index)}
                className="bg-red-500 text-white p-1 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          content={modalContent}
        />
      </div>
    </>
  );
};

export default OfferProduct;
