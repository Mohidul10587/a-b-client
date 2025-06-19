"use client";
import React, { useState } from "react";
import Content from "../../components/Content";
import Modal from "@/components/Modal";

import Image from "next/image";

import Keywords from "@/components/Keywords";
import useSWR from "swr";
import { fetcher } from "@/app/shared/fetcher";

import { apiUrl } from "@/app/shared/urls";
import { processContent } from "@/app/shared/processContent";
import ImageGallery from "@/components/ImageGallery";

type QnA = {
  title: string;
  description: string;
};

export interface ISubcategory {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  title: string;
  slug?: string;
  img: string;
  metaImg: string;
  position: number;
  commissionForSeller: number;
  display: boolean;
  parentCategory: string;
  queAndAnsArray: QnA[];
}

export interface InfoSection {
  id: number;
  sectionIcon: any;
  sectionTitle: string;
  fields: {
    fieldIcon: any;
    fieldTitle: string;
    content: string;

    display: boolean;
    extraInfo: null;
  }[];
}

const IndexPage: React.FC = () => {
  const initialInfoSections: InfoSection[] = [
    {
      id: 1,
      sectionIcon: null,
      sectionTitle: "",
      fields: [
        {
          fieldIcon: null,
          fieldTitle: "",
          content: "",
          display: false,
          extraInfo: null,
        },
      ],
    },
  ];

  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");

  const [imageType, setImageType] = useState("");

  const [data, setData] = useState<ISubcategory>({
    metaTitle: "",
    metaDescription: "",
    keywords: [] as string[],
    title: "",
    slug: "",
    img: "",
    metaImg: "",
    position: 0,
    commissionForSeller: 0,
    display: true,
    parentCategory: "",
    queAndAnsArray: [{ title: "", description: "" }],
  });

  const { data: response, isLoading } = useSWR(
    `category/allCategoriesForSubCatAddPage`,
    fetcher
  );

  const openModal = (content: string) => {
    setModalContent(content);
    setIsSubmitModalOpen(true);
  };

  const closeModal = () => {
    setIsSubmitModalOpen(false);
    setIsImageModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.title) return openModal("Title is required.");
    if (!data.img) return openModal("Photo is required.");
    if (!data.parentCategory) return openModal("Parent is required.");

    const finalDescription = processContent(description);
    const finalShortDescription = processContent(shortDescription);
    const updatedData = {
      ...data,
      description: finalDescription,
      shortDescription: finalShortDescription,
    };

    try {
      openModal("Creating...");
      const response = await fetch(`${apiUrl}/subcategory/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "Application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      if (response.ok) {
        openModal(data.message);
        // Optionally reset the form fields if needed
      } else {
        openModal(data.message);
      }
    } catch (error) {
      openModal("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <>
      <div className="container my-4">
        <form onSubmit={handleSubmit}>
          {" "}
          <div className="flex flex-col md:flex-row gap-8">
            {" "}
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
              <div className="pt-4">
                <p>Select a parent category</p>
                <select
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={data.parentCategory}
                  onChange={(e) =>
                    setData({ ...data, parentCategory: e.target.value })
                  }
                  required
                >
                  {" "}
                  <option value="" disabled>
                    Select parent
                  </option>
                  {!isLoading && (
                    <>
                      {response.respondedData?.map((item: any) => (
                        <option key={item._id} value={item._id}>
                          {item.title}
                        </option>
                      ))}
                    </>
                  )}
                </select>
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
                  onChange={(content: string) => {
                    setDescription(content);
                  }}
                />
              </div>
              <div className="mb-4">
                <p>Short Description</p>
                <Content
                  onChange={(content: string) => {
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
                    />

                    <p
                      className="font-bold mt-2 w-[200px] border border-black p-2 "
                      onClick={() => {
                        setIsImageModalOpen(true);
                        setImageType("metaImg");
                      }}
                    >
                      {data.metaImg ? "Change Image " : "Choose Image"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/2">
              <div className="border-2 border-main border-dashed rounded-md p-2 my-8">
                <button
                  type="submit"
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
                  />

                  <p
                    className="font-bold mt-2 w-[200px] border border-black p-2 "
                    onClick={() => {
                      setIsImageModalOpen(true);
                      setImageType("img");
                    }}
                  >
                    {data.img ? "Change Image " : "Choose Image"}
                  </p>
                </div>
              </div>
              <Keywords data={data} setData={setData} />
            </div>
          </div>{" "}
        </form>
        <Modal
          isOpen={isSubmitModalOpen}
          onClose={closeModal}
          content={modalContent}
        />
        <ImageGallery
          isOpen={isImageModalOpen}
          onClose={closeModal}
          img={imageType}
          setData={setData}
          data={data}
        />
      </div>
    </>
  );
};

export default IndexPage;
