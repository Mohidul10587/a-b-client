"use client";

import React, { useState } from "react";
import AddElementModal from "./AddElementModal";
import PageBuilder from "@/app/account/(seller)/element/PageBuilder";
import PageElementsList2 from "./PageElementsList2";
import { useParams } from "next/navigation";

const ShowElement = () => {
  const params = useParams();

  const [isModalOpen, setModalOpen] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="my-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Page list</h1>
        <button
          onClick={handleOpenModal}
          className="bg-main text-white px-2 py-1 rounded-md"
        >
          Add
        </button>
      </div>

      {/* Page Elements List Component */}
      <PageElementsList2
        id={params.id as string}
        pageName={params.id as string}
        loadData={loadData}
      />

      {/* Modal Component */}
      {isModalOpen && (
        <AddElementModal onClose={handleCloseModal}>
          <div className="fixed md:py-12 top-0 bottom-0 left-0 right-0 bg-black/50 z-[100]">
            <PageBuilder
              onClose={handleCloseModal}
              page={params.id as string}
              id={params.id as string}
              loadData={loadData}
              setLoadData={setLoadData}
            />
          </div>
        </AddElementModal>
      )}
    </div>
  );
};

export default ShowElement;
