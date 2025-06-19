"use client";

import React, { FC, useState } from "react";

import AddElementModal from "./AddElementModal";
import PageBuilder from "@/app/admin/element/PageBuilder";
import PageElementsList from "./PageElementsList";

const ShowElement: FC<any> = ({ props }) => {
  const qureies = props.id;
  const id = qureies[0];

  const page = qureies[1];

  const [isModalOpen, setModalOpen] = useState(false);
  const [loadData, setLoadData] = useState(false);
  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div className="px-2">
      <div className="flex justify-between items-center my-3">
        <h1 className="text-xl font-bold">Page Elements</h1>
        <button
          onClick={handleOpenModal}
          className="bg-main text-white px-2 py-1 rounded-md hover:bg-blue-600"
        >
          Add Element
        </button>
      </div>

      <PageElementsList id={id} pageName={page} />

      {/* Modal Component */}
      {isModalOpen && (
        <AddElementModal onClose={handleCloseModal}>
          <div className="fixed top-0 bottom-0 left-0 right-0 bg-gray-300 z-[9999] block">
            <PageBuilder
              onClose={handleCloseModal}
              page={page}
              id={id}
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
