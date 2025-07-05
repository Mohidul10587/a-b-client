"use client";
import React, { useState } from "react";
import Content from "@/components/Content";
import Image from "next/image";
import ImageGallery from "@/components/ImageGallery";
import Keywords from "@/components/Keywords";
import { processContent } from "@/app/shared/processContent";
import { useData } from "@/app/DataContext";
import { req } from "@/app/shared/request";

const Form: React.FC<Props<ICategory>> = ({
  id,
  initialData,
  pagePurpose = "add",
}) => {
  const { showModal } = useData();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isMetaImageModalOpen, setIsMetaImageModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");

  const [data, setData] = useState<ICategory>(initialData);

  const closeModal = () => {
    setIsImageModalOpen(false);
    setIsMetaImageModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.title) return showModal("Title is required.", "info");

    const finalDescription = processContent(description);
    const finalShortDescription = processContent(shortDescription);

    const updatedData = {
      ...data,
      description: finalDescription,
      shortDescription: finalShortDescription,
    };

    const url =
      pagePurpose === "add" ? "category/create" : `category/update/${id}`;
    const method = pagePurpose === "add" ? "POST" : `PUT`;
    try {
      const { res, data: resData } = await req(url, method, updatedData);
      showModal(resData.message, res.ok ? "success" : "error");
    } catch (error) {
      showModal("Failed to upload product due to an unexpected error", "error");
    } finally {
    }
  };

  return (
    <>
      <div className="container  md:p-4 p-2">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <div className="mb-4">
              <p> Title</p>
              <input
                type="text"
                value={data.title}
                onChange={(e) => setData({ ...data, title: e.target.value })}
                placeholder="Category Name"
                className="p-2 mt-2 w-full outline-none rounded-md"
              />
            </div>

            <div className="mb-4">
              <p>Position</p>
              <input
                type="number"
                value={data.position}
                onChange={(e) =>
                  setData({ ...data, position: Number(e.target.value) })
                }
                placeholder="Position"
                className="p-2 mt-2 w-full outline-none rounded-md"
              />
            </div>

            <div className="mb-4">
              <p>Description</p>
              <Content
                onChange={(content) => {
                  setDescription(content);
                }}
              />
            </div>
            <div className="mb-4">
              <p>Short Description</p>
              <Content
                onChange={(content) => {
                  setShortDescription(content);
                }}
              />
            </div>
            <div className="p-4 w-full space-y-4 bg-white mt-4">
              <div>
                <label htmlFor="titleInput" className="text-gray-700">
                  Meta Title
                </label>
                <input
                  id="titleInput"
                  type="text"
                  value={data.metaTitle}
                  onChange={(e) =>
                    setData({ ...data, metaTitle: e.target.value })
                  }
                  placeholder="Enter title"
                  className="mt-1 p-2 w-full border outline-0 rounded-md"
                />
              </div>

              <div>
                <label htmlFor="descriptionInput" className="text-gray-700">
                  Meta Description
                </label>
                <textarea
                  id="descriptionInput"
                  value={data.metaDescription}
                  onChange={(e) =>
                    setData({ ...data, metaDescription: e.target.value })
                  }
                  placeholder="Enter description"
                  className="mt-1 p-2 w-full border outline-0 rounded-md resize-none"
                  rows={2}
                />
              </div>
              <div className="w-full md:w-1/3">
                <p>Meta Image</p>
                <div>
                  <Image
                    src={data.metaImg || "/default.jpg"}
                    width={200}
                    height={150}
                    alt="Image"
                    className="border border-black "
                    onClick={() => setIsMetaImageModalOpen(true)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-1/2">
            <div className="border-2 border-main border-dashed rounded-md p-2 my-8">
              <button
                onClick={handleSubmit}
                className="bg-main flex items-center justify-center w-full text-white px-4 py-2 rounded-md"
              >
                Publish
              </button>
            </div>

            {/* Category image start here */}
            <div className="w-full md:w-1/3">
              <p>Image</p>
              <div>
                <Image
                  src={data.img || "/default.jpg"}
                  width={200}
                  height={150}
                  alt="Image"
                  className="border border-black "
                  onClick={() => setIsImageModalOpen(true)}
                />
              </div>
            </div>
            <Keywords data={data} setData={setData} />
          </div>
        </div>

        <ImageGallery
          isOpen={isImageModalOpen}
          onClose={closeModal}
          img={"img"}
          setData={setData}
          data={data}
        />
        <ImageGallery
          isOpen={isMetaImageModalOpen}
          onClose={closeModal}
          img={"metaImg"}
          setData={setData}
          data={data}
        />
      </div>
    </>
  );
};

export default Form;
