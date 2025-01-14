"use client";
import React, { useEffect, useState } from "react";
import Content from "@/app/admin/components/Content";
import Modal from "@/app/admin/components/Modal";
import Photo from "@/app/admin/components/Photo2";
import { apiUrl } from "@/app/shared/urls";
import { fetchWithTokenRefresh } from "@/app/shared/fetchWithTokenRefresh";
import { ICategory } from "@/types/category";
import Meta from "@/app/admin/components/Meta";

const IndexPage: React.FC = () => {
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(""); // Start with an empty string
  const [tags, setTags] = useState<string[]>([]);
  const [metaValue, setMetaValue] = useState("");
  const [metaImageFile, setMetaImageFile] = useState<File | null>(null);

  const [title, setTitle] = useState(""); // State for the subcategory name
  const [slug, setSlug] = useState("");

  const [parentCategory, setParentCategory] = useState(""); // State for the selected parent category
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

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/category/all`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error: any) {
        setError(error.message);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!title) {
      openModal("Subcategory Name is required.");
      return;
    }
    if (!slug) {
      openModal("Slug  is required.");
      return;
    }

    if (!parentCategory) {
      openModal("Parent Category is required.");
      return;
    }

    if (!photo) {
      openModal("Photo is required.");
      return;
    }

    const strippedDescription = description.replace(/(<([^>]+)>)/gi, "").trim();
    const finalDescription = strippedDescription.length > 0 ? description : "";

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("description", finalDescription);
    formData.append("photo", photo);
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
    fetchWithTokenRefresh(
      `${apiUrl}/category/addSubCategory/${parentCategory}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Successfully added subcategory");
        } else {
          alert("Do not make subCategory");
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
              <p>Subcategory Title</p>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Subcategory Name"
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
              <p>Select Parent Category</p>
              <select
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
                className="p-2 mt-2 w-full outline-none rounded-md"
              >
                <option value="">Select Parent Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.categoryName}
                  </option>
                ))}
              </select>
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
                onClick={handleSubmit}
                className="bg-main flex items-center justify-center w-full text-white px-4 py-2 rounded-md"
              >
                Publish Subcategory
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
