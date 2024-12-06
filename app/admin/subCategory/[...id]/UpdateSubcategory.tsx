"use client";
import { useEffect, useState } from "react";
import { apiUrl } from "@/app/shared/urls";
import Content from "@/app/admin/components/Content";
import Modal from "@/app/admin/components/Modal";
import Image from "next/image";
import { fetchWithTokenRefresh } from "@/app/shared/fetchWithTokenRefresh";
import Meta from "@/app/admin/components/Meta";

const UpdateSubcategory: React.FC<{ id: string[] }> = ({ id }) => {
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [selectedMetaImage, setSelectedMetaImage] = useState<string | null>(""); // Start with an empty string
  const [tags, setTags] = useState<string[]>([]);
  const [metaValue, setMetaValue] = useState("");
  const [metaImageFile, setMetaImageFile] = useState<File | null>(null);

  const [title, setTitle] = useState(""); // State for the category name
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState(""); // State for the description
  const [photo, setPhoto] = useState<string | File | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [isContentValid, setIsContentValid] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  useEffect(() => {
    if (id) {
      // Split the id to use it in fetchCategoryData
      const idParts = id;
      fetchCategoryData(idParts[0], idParts[1]);
    }
  }, [id]); // Add dependency array

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setPhoto(file);
    }
  };

  const fetchCategoryData = async (
    categoryId: string,
    subCategoryId: string
  ) => {
    try {
      const response = await fetchWithTokenRefresh(
        `${apiUrl}/category/getSubcategory/${categoryId}/${subCategoryId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setSelectedMetaImage(data.metaImage);
        setMetaTitle(data.metaTitle);
        setMetaDescription(data.metaDescription);
        setTags(data.tags);
        setTitle(data.title);
        setSlug(data.slug);
        setDescription(data.description);
        setSelectedImage(data.photo);
      } else {
        throw new Error("Failed to fetch category data");
      }
    } catch (error: any) {
      setModalContent(error.message);
      setModalIsOpen(true);
    }
  };

  const openModal = (content: string) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title) {
      openModal("Category Name is required.");
      return;
    }

    const strippedDescription = description.replace(/(<([^>]+)>)/gi, "").trim();
    const finalDescription = strippedDescription.length > 0 ? description : "";
    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("description", finalDescription);
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
    const idParts = id; // Ensure correct ID structure here

    fetchWithTokenRefresh(
      `${apiUrl}/category/updateSubcategory/${idParts[0]}/${idParts[1]}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setModalIsOpen(true);
          setModalContent("Sorry, subcategory update failed.");
        } else {
          setModalIsOpen(true);
          setModalContent("Successfully updated subcategory.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <div className="container my-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <div className="mb-4">
              <p>Category Title</p>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
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
                initialContent={description}
              />
            </div>
          </div>

          <div className="md:w-1/3 w-full">
            <div>
              <label htmlFor="fileInput" className="block mb-2 font-bold">
                Upload Image
              </label>
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 mb-2 border rounded-md outline-none hidden"
              />
              {selectedImage ? (
                <div
                  className="mt-2 cursor-pointer"
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  <Image
                    src={selectedImage}
                    alt="Selected"
                    width={300}
                    height={300}
                    className="object-contain"
                  />
                </div>
              ) : (
                <button
                  onClick={() => document.getElementById("fileInput")?.click()}
                  className="w-full bg-main text-white py-2 rounded-md"
                >
                  Select Image
                </button>
              )}
            </div>
            <button
              onClick={handleSubmit}
              className="mt-2 w-full bg-main text-white py-2 rounded-md"
            >
              Update Sub Category
            </button>
          </div>
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
      <Modal
        isOpen={modalIsOpen}
        onClose={closeModal}
        content={modalContent}
      ></Modal>
    </>
  );
};

export default UpdateSubcategory;
