"use client";
import React, { useEffect, useState } from "react";
import Content from "@/components/Content";
import Modal from "@/components/Modal";

import Image from "next/image";
import ImageGallery from "@/components/ImageGallery";
import QnA from "@/components/QnA";

import Keywords from "@/components/Keywords";
import useSWR from "swr";

import { useParams } from "next/navigation";
import { InfoSection, ISubcategory } from "../../add/page";
import { fetcher } from "@/app/shared/fetcher";
import { processContent } from "@/app/shared/processContent";
import { apiUrl } from "@/app/shared/urls";

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
  const [infoSections, setInfoSections] =
    useState<InfoSection[]>(initialInfoSections);

  const [isSectionIconModalOpen, setIsSectionIconModalOpen] = useState(false);
  const [sectionId, setSectionId] = useState(0);
  const [imageType, setImageType] = useState("");
  const [fieldIndexNumber, setFieldIndexNumber] = useState<number | null>(null);
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const id = useParams().id;
  const [data, setData] = useState<ISubcategory>({
    metaTitle: "",
    metaDescription: "",
    keywords: [] as string[],
    title: "", // Category name

    img: "",
    metaImg: "",
    position: 0,
    commissionForSeller: 0,
    display: true,
    parentCategory: "",
    queAndAnsArray: [{ title: "", description: "" }],
  });

  const {
    data: response,
    error,
    mutate,
    isLoading,
  } = useSWR(`category/allCategoriesForSubCatAddPage`, fetcher);
  const {
    data: responseSingle,
    error: errorSingle,
    mutate: muteSingle,
    isLoading: isLoadingSingle,
  } = useSWR(
    `subcategory/singleSubcategoryForSubcategoryEditPage/${id}`,
    fetcher
  );

  const openModal = (content: string) => {
    setModalContent(content);
    setIsSubmitModalOpen(true);
  };

  const closeModal = () => {
    setIsSubmitModalOpen(false);
    setIsImageModalOpen(false);
    setIsSectionIconModalOpen(false);
  };

  const handleFieldIconChange = (sectionId: number, fieldIndex: number) => {
    setIsSectionIconModalOpen(true);
    setSectionId(sectionId);
    setFieldIndexNumber(fieldIndex);
  };

  const handleSectionTitleChange = (sectionId: number, value: string) => {
    setInfoSections(
      infoSections.map((section) =>
        section.id === sectionId ? { ...section, sectionTitle: value } : section
      )
    );
  };

  const handleFieldTitleChange = (
    sectionId: number,
    fieldIndex: number,
    value: string
  ) => {
    setInfoSections(
      infoSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map((field, index) =>
                index === fieldIndex ? { ...field, fieldTitle: value } : field
              ),
            }
          : section
      )
    );
  };

  const handleFieldContentChange = (
    sectionId: number,
    fieldIndex: number,
    value: string
  ) => {
    setInfoSections(
      infoSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.map((field, index) =>
                index === fieldIndex ? { ...field, content: value } : field
              ),
            }
          : section
      )
    );
  };
  // Handle icon image change

  const addInfoSection = () => {
    const newSection: InfoSection = {
      id: Date.now(),
      sectionIcon: null, // Initialize with null
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
    };
    setInfoSections([...infoSections, newSection]);
  };

  const addField = (sectionId: number) => {
    setInfoSections(
      infoSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: [
                ...section.fields,
                {
                  fieldIcon: null,
                  fieldTitle: "",
                  content: "",
                  display: false,
                  extraInfo: null,
                },
              ],
            }
          : section
      )
    );
  };

  const removeField = (sectionId: number, fieldIndex: number) => {
    setInfoSections(
      infoSections.map((section) =>
        section.id === sectionId
          ? {
              ...section,
              fields: section.fields.filter((_, index) => index !== fieldIndex),
            }
          : section
      )
    );
  };
  const handleSectionIconChange = (sectionId: number) => {
    setIsSectionIconModalOpen(true);
    setSectionId(sectionId);
    setFieldIndexNumber(null);
  };
  const removeSection = (sectionId: number) =>
    setInfoSections(infoSections.filter((section) => section.id !== sectionId));

  useEffect(() => {
    if (responseSingle?.respondedData) {
      setData(responseSingle.respondedData);
      setDescription(responseSingle.respondedData.description);
      setShortDescription(responseSingle.respondedData.shortDescription);
      setInfoSections(responseSingle.respondedData.infoSections);
    }
  }, [responseSingle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.title) return openModal("Title is required.");
    if (!data.img) return openModal("Photo is required.");
    if (!data.parentCategory) return openModal("Parent is required.");

    const finalDescription = processContent(description);
    const finalShortDescription = processContent(shortDescription);
    const updatedData = {
      ...data,
      infoSections: infoSections,
      description: finalDescription,
      shortDescription: finalShortDescription,
    };

    try {
      openModal("Creating...");
      const response = await fetch(`${apiUrl}/subcategory/update/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-type": "Application/json",
        },
        body: JSON.stringify(updatedData),
      });
      const data = await response.json();
      if (response.ok) {
        muteSingle();
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
            {/* <div className="pt-4">
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
            </div> */}

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
                initialContent={description}
              />
            </div>
            <div className="mb-4">
              <p>Short Description</p>
              <Content
                onChange={(content: string) => {
                  setShortDescription(content);
                }}
                initialContent={shortDescription}
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
            <QnA data={data} setData={setData} />
          </div>
        </div>
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
