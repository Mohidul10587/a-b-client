"use client";
import React, { useState } from "react";
import Content from "@/app/admin/components/Content";
import Photo from "@/app/admin/components/Photo2";
import { apiUrl } from "@/app/shared/urls";
import Modal from "@/app/admin/components/Modal"; // Adjust the import path as needed
import { fetchWithTokenRefresh } from "@/app/shared/fetchWithTokenRefresh";
import Meta from "@/app/admin/components/Meta";

const IndexPage: React.FC = () => {
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(""); // Start with an empty string
  const [tags, setTags] = useState<string[]>([]);
  const [metaValue, setMetaValue] = useState("");
  const [metaImageFile, setMetaImageFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    // Validate if content and photo are present

    if (!title) {
      openModal("Title is required.");
      return;
    }

    if (!photo) {
      openModal("Image is required.");
      return;
    }

    setIsSubmitting(true);
    openModal("Processing...");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("description", description);
    if (photo) {
      formData.append("photo", photo);
    }

    // Add new state values to FormData
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);

    // If selectedImage is not null, append it
    if (metaImageFile) {
      formData.append("metaImage", metaImageFile);
    }

    // Convert tags array to a comma-separated string
    formData.append("tags", tags.join(","));

    const token = localStorage.getItem("accessToken");

    try {
      const response = await fetchWithTokenRefresh(`${apiUrl}/writer/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        openModal("Writer added successfully!");
        // Reset form fields
        setTitle("");
        setDescription("");
        setPhoto(null);
        setIsContentValid(false); // Reset content validity
      } else {
        openModal("Failed to add writer.");
      }
    } catch (error) {
      openModal("An error occurred while submitting the form");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="container my-4">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3">
              <div className="mb-4">
                <p>Title</p>
                <input
                  type="text"
                  placeholder="title"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
                <Content onChange={(content) => setDescription(content)} />
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
                  type="submit"
                  className="bg-main flex items-center justify-center w-full text-white px-4 py-2 rounded-md"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Publishing..." : "Publish"}
                </button>
              </div>
              <div className="border-2 border-main border-dashed rounded-md p-2 my-8">
                <Photo title="Photo" img="" onImageChange={setPhoto} />
              </div>
            </div>
          </div>
        </form>
      </div>

      <Modal isOpen={modalIsOpen} onClose={closeModal} content={modalContent} />
    </>
  );
};

export default IndexPage;
