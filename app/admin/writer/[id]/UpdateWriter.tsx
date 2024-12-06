"use client";
import React, { useEffect, useState } from "react";
import Content from "@/app/admin/components/Content";
import { apiUrl } from "@/app/shared/urls";
import Modal from "@/app/admin/components/Modal"; // Adjust the import path as needed
import Image from "next/image";
import { fetchWithTokenRefresh } from "@/app/shared/fetchWithTokenRefresh";
import Meta from "@/app/admin/components/Meta";
import { Props } from "@/types/pageProps";

interface WriterProps {
  writerId: string;
}

const UpdateWriter: React.FC<WriterProps> = ({ writerId }) => {
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [selectedMetaImage, setSelectedMetaImage] = useState<string | null>(""); // Start with an empty string
  const [tags, setTags] = useState<string[]>([]);
  const [metaValue, setMetaValue] = useState("");
  const [metaImageFile, setMetaImageFile] = useState<File | null>(null);

  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState<number | string>(3.5);
  const [photo, setPhoto] = useState<string | File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [isContentValid, setIsContentValid] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  useEffect(() => {
    const fetchWriter = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/writer/singleWriter/${writerId}`
        );
        if (response.ok) {
          const data = await response.json();
          setSelectedMetaImage(data.writer.metaImage);
          setMetaTitle(data.writer.metaTitle);
          setMetaDescription(data.writer.metaDescription);
          setTags(data.writer.tags);
          setId(data.writer._id);
          setTitle(data.writer.title);
          setSlug(data.writer.slug);
          setDescription(data.writer.description);
          setRating(data.writer.rating);
          setPhoto(data.writer.photo);
          setSelectedImage(data.writer.photo);
          setIsContentValid(data.writer.description.trim() !== ""); // Ensure initial content validity
        } else {
          alert("Failed to fetch writer");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchWriter();
  }, [writerId]);

  const openModal = (content: string) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setPhoto(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      openModal("Title is required.");
      return;
    }

    if (description.trim() == "") {
      openModal("Description is required.");
      return;
    }
    if (!rating) {
      openModal("Rating is required.");
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
    formData.append("rating", rating.toString());
    if (photo) {
      formData.append("photo", photo);
    }

    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);

    // If selectedImage is not null, append it
    if (metaImageFile) {
      formData.append("metaImage", metaImageFile);
    }

    // Convert tags array to a comma-separated string
    formData.append("tags", tags?.join(","));
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetchWithTokenRefresh(
        `${apiUrl}/writer/updateWriter/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        openModal("Writer updated successfully!");
      } else {
        openModal("Failed to update writer.");
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
                <Content
                  onChange={(content) => setDescription(content)}
                  required
                  setContentValidity={setIsContentValid}
                  initialContent={description} // Pass the initialContent prop here
                />
              </div>

              <div className="mb-4">
                <p className="md:w-60">Rating</p>
                <input
                  type="number"
                  placeholder="Rating"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  required
                />
              </div>

              <Meta
                metaTitle={metaTitle}
                setMetaTitle={setMetaTitle}
                metaDescription={metaDescription}
                setMetaDescription={setMetaDescription}
                selectedImage={selectedMetaImage}
                setSelectedImage={setSelectedMetaImage}
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
                <div className="w-full">
                  <p className="flex items-center justify-between">
                    <span>Choose photo</span>
                  </p>
                  <div className="flex flex-col items-center my-2 relative">
                    <label
                      htmlFor="photoInput"
                      className="cursor-pointer w-full flex items-center justify-center"
                    >
                      {selectedImage ? (
                        <Image
                          src={selectedImage}
                          alt="Selected"
                          className="bg-white p-2 max-w-full h-auto"
                          height={200}
                          width={400}
                        />
                      ) : (
                        <div className="p-4 bg-white w-full">
                          <div className="border-2 border-gray-500 text-gray-500 border-dashed flex flex-col items-center justify-center p-5 w-full">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="50"
                              height="50"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v12m-6-6h12"
                              />
                            </svg>
                            <p>Click to upload</p>
                          </div>
                        </div>
                      )}
                      <input
                        id="photoInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      <Modal isOpen={modalIsOpen} onClose={closeModal} content={modalContent} />
    </>
  );
};

export default UpdateWriter;
