"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { apiUrl } from "@/app/shared/urls";
import Content from "@/app/admin/components/Content";
import Modal from "@/app/admin/components/Modal";
import Image from "next/image";
import { fetchWithTokenRefresh } from "@/app/shared/fetchWithTokenRefresh";
import Meta from "@/app/admin/components/Meta";

interface IFieldIcon {
  id: number;
  fieldIndex: number;
  sectionIndex: number;
  file: File;
}
interface ISectionIcon {
  id: number;
  sectionIndex: number;
  file: File;
}

const UpdateCategory: React.FC<{
  id: string;
}> = ({ id }) => {
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [selectedMetaImage, setSelectedMetaImage] = useState<string | null>(""); // Start with an empty string
  const [tags, setTags] = useState<string[]>([]);
  const [metaValue, setMetaValue] = useState("");
  const [metaImageFile, setMetaImageFile] = useState<File | null>(null);

  const [categoryName, setCategoryName] = useState(""); // State for the category name
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState(""); // State for the description
  const [display, setDisplay] = useState(false);
  const [displayPositionOfHomePage, setDisplayPositionOfHomePage] = useState(0);

  const [photo, setPhoto] = useState<string | File | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [isContentValid, setIsContentValid] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [newFieldIcons, setNewFieldIcons] = useState<IFieldIcon[]>([]); // Store files for newly created fields
  const [newSectionIcons, setNewSectionIcons] = useState<ISectionIcon[]>([]); // Store files for newly created sections

  const sortFieldIconData = (data: IFieldIcon[]) => {
    return data.sort((a, b) => {
      if (a.sectionIndex === b.sectionIndex) {
        return a.fieldIndex - b.fieldIndex;
      }
      return a.sectionIndex - b.sectionIndex;
    });
  };

  const sortSectionIconData = (data: ISectionIcon[]) => {
    return data.sort((a, b) => a.sectionIndex - b.sectionIndex);
  };

  // Call the function and get sorted data
  const sortedFieldIconData = sortFieldIconData(newFieldIcons);
  const sortedSectionIconData = sortSectionIconData(newSectionIcons);

  useEffect(() => {
    if (id) {
      fetchCategoryData(id as string);
    }
  }, [id]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setPhoto(file);
    }
  };

  const fetchCategoryData = async (categoryId: string) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(`${apiUrl}/category/${categoryId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setSelectedMetaImage(data.metaImage);
        setMetaTitle(data.metaTitle);
        setMetaDescription(data.metaDescription);
        setTags(data.tags);
        setCategoryName(data.categoryName);

        setSlug(data.slug);
        setDescription(data.description);
        setDisplay(data.display);
        setDisplayPositionOfHomePage(data.displayPositionOfHomePage);
        // Set isNew flag to false for all fetched sections and fields

        setSelectedImage(data.photoUrl);
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

  // Function to handle fieldIcon change

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName) {
      openModal("Category Name is required.");
      return;
    }

    const strippedDescription = description.replace(/(<([^>]+)>)/gi, "").trim();
    const finalDescription = strippedDescription.length > 0 ? description : "";
    const formData = new FormData();
    formData.append("categoryName", categoryName);
    formData.append("slug", slug);
    formData.append("description", finalDescription);
    formData.append("display", String(display));
    formData.append(
      "displayPositionOfHomePage",
      String(displayPositionOfHomePage)
    );

    if (photo) {
      formData.append("photo", photo);
    }

    sortedFieldIconData.forEach((field: IFieldIcon) => {
      if (field) {
        formData.append("fieldIcons", field.file);
      }
    });

    sortedSectionIconData.forEach((field) => {
      if (field) {
        formData.append("sectionIcons", field.file);
      }
    });
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);

    // If selectedImage is not null, append it
    if (metaImageFile) {
      formData.append("metaImage", metaImageFile);
    }

    // Convert tags array to a comma-separated string
    formData.append("tags", tags.join(","));

    fetchWithTokenRefresh(`${apiUrl}/category/update/${id}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          setModalIsOpen(true);
          setModalContent("Sorry category update failed");
        } else {
          setModalIsOpen(true);
          setModalContent("Successfully updated category");
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
                initialContent={description}
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

          <div className="md:w-1/3 w-full">
            <div>
              <label htmlFor="fileInput" className="block mb-2 font-bold">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-4 py-2 mb-2 border rounded-md outline-none"
              />
              {selectedImage && (
                <div className="mt-2">
                  <Image
                    src={selectedImage}
                    alt="Selected"
                    width={300}
                    height={300}
                    className="object-contain"
                  />
                </div>
              )}
            </div>
            <button
              onClick={handleSubmit}
              className="mt-2 w-full bg-main text-white py-2 rounded-md"
            >
              Update Category
            </button>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onClose={closeModal}
        content={modalContent}
      ></Modal>
    </>
  );
};

export default UpdateCategory;
