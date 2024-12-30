"use client";
import React, { useState } from "react";
import Content from "@/app/admin/components/Content";
import Modal from "@/app/admin/components/Modal";
import Photo from "@/app/admin/components/Photo2";
import { apiUrl } from "@/app/shared/urls";
import { fetchWithTokenRefresh } from "@/app/shared/fetchWithTokenRefresh";
import Meta from "@/app/admin/components/Meta";

export interface InfoSection {
  id: number;
  sectionIcon: any;
  sectionTitle: string;
  fields: {
    fieldIcon: any;
    fieldTitle: string;
    content: string;
    display: boolean;
  }[];
}

const IndexPage: React.FC = () => {
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(""); // Start with an empty string
  const [tags, setTags] = useState<string[]>([]);
  const [metaValue, setMetaValue] = useState("");
  const [metaImageFile, setMetaImageFile] = useState<File | null>(null);
  const [categoryName, setCategoryName] = useState(""); // State for the category name
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState(""); // State for the description
  const [photo, setPhoto] = useState<File | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [isContentValid, setIsContentValid] = useState(false);

  const openModal = (content: string) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName) {
      openModal("Category Name is required.");
      return;
    }
    if (!slug) {
      openModal("Slug is required.");
      return;
    }
    if (!photo) {
      openModal("Photo is required.");
      return;
    }

    // Remove HTML tags from the description
    const strippedDescription = description.replace(/(<([^>]+)>)/gi, "").trim();
    const finalDescription = strippedDescription.length > 0 ? description : "";

    // Prepare FormData
    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("slug", slug);
    formData.append("description", finalDescription);
    formData.append("photo", photo);
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    if (metaImageFile) {
      formData.append("metaImage", metaImageFile);
    }
    formData.append("tags", tags.join(","));

    const token = localStorage.getItem("accessToken");

    try {
      openModal(" Category creating...");
      const response = await fetch(`${apiUrl}/category/create`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        openModal("Category added successfully!");
        // Optionally reset the form fields if needed
      } else {
        const errorData = await response.json();
        const errorMessage = errorData.message || "Failed to add category";
        openModal(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error("Error:", error);
      openModal("An unexpected error occurred. Please try again later.");
    }
  };
  console.log(photo);
  return (
    <>
      <div className="container my-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <div className="mb-4">
              <p>Category Name</p>
              <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category Name"
                className="p-2 mt-2 w-full outline-none rounded-md"
              />
            </div>
            <div className="mb-4">
              <p>Slug</p>
              <input
                type="text"
                placeholder="Slug"
                name="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="p-2 mt-2 w-full outline-none rounded-md"
              />
            </div>
            <div className="mb-4">
              <p>Description</p>
              <Content
                onChange={(content) => setDescription(content)}
                required
                setContentValidity={setIsContentValid}
              />
            </div>

            <Meta
              metaTitle={metaTitle}
              setMetaTitle={setMetaTitle}
              metaDescription={metaDescription}
              setMetaDescription={setMetaDescription}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
              tags={tags}
              setTags={setTags}
              metaValue={metaValue}
              setMetaValue={setMetaValue}
              setMetaImageFile={setMetaImageFile}
            />
          </div>
          <div className="w-full md:w-1/3">
            <div className="border-2 border-main border-dashed rounded-md p-2 my-8">
              <button
                onClick={handleSubmit}
                className="bg-main flex items-center justify-center w-full text-white px-4 py-2 rounded-md"
              >
                Publish
              </button>
            </div>
            <Photo title="Photo" img="" onImageChange={setPhoto} />
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onClose={closeModal}
          content={modalContent}
        />
      </div>
    </>
  );
};

export default IndexPage;
