"use client";

import { apiUrl } from "@/app/shared/urls";
import { fetchWithTokenRefresh } from "@/app/shared/fetchWithTokenRefresh";
import Content from "@/app/admin/components/Content";
import Modal from "@/app/admin/components/Modal";
import Photo from "@/app/admin/components/Photo2";
import { IWriter } from "@/types/writer";
import { ICategory, InfoSection } from "@/types/category";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Meta from "@/app/admin/components/Meta";
import { ISuggestion } from "@/types/suggestion";
const IndexPage: React.FC = () => {
  const [publisher, setSupplier] = useState("");
  const [summary, setSummary] = useState("");
  const [numberOfPage, setNumberOfPage] = useState("");
  const [ISBN, setISBN] = useState("");
  const [edition, setEdition] = useState("");
  const [binding, setBinding] = useState("");
  const [productType, setProductType] = useState("");
  const [translatorName, setTranslatorName] = useState("");
  const [language, setLanguage] = useState("");
  const [orderType, setOrderType] = useState("");
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [metaValue, setMetaValue] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [title, setTitle] = useState("");
  const [titleEnglish, setTitleEnglish] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [isContentValid, setIsContentValid] = useState(false);
  const [category, setCategory] = useState("");

  const [price, setPrice] = useState(0);
  const [unprice, setunPrice] = useState(0);
  const [stockStatus, setStockStatus] = useState("In Stock");
  const [writerId, setWriterId] = useState("");
  const [youtubeVideo, setYoutubeVideo] = useState("");
  const [shippingInside, setShippingInside] = useState(50);
  const [shippingOutside, setShippingOutside] = useState(100);
  const [writers, setWriters] = useState<IWriter[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  const [photo, setPhoto] = useState<File | null>(null);
  const [metaImageFile, setMetaImageFile] = useState<File | null>(null);
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [filePreviews, setFilePreviews] = useState<(string | ArrayBuffer)[]>(
    []
  );
  const [selectedImage, setSelectedImage] = useState<string | null>("");
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);
  const [suggestionId, setSuggestionId] = useState("");
  // varity section end here

  const openModal = (content: string) => {
    setModalContent(content);
    setModalIsOpen(true);
  };
  const [subCategory, setSubCategory] = useState("");

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const response = await fetch(`${apiUrl}/suggestion`);
        if (response.ok) {
          const data = await response.json();

          setSuggestions(data.suggestions);
        } else {
          throw new Error("Failed to fetch brands");
        }
      } catch (error) {
        console.error(error);
      }
    };
    const fetchWriters = async () => {
      try {
        const response = await fetch(`${apiUrl}/writer/all`);
        if (response.ok) {
          const data = await response.json();
          setWriters(data.writers);
        } else {
          throw new Error("Failed to fetch writers");
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/category/all`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
          setCategory(data.categories[0]._id);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSuggestion();
    fetchWriters();
    fetchCategories();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const newPreviews: (string | ArrayBuffer)[] = [];
      const maxFiles = 8;

      if (selectedFiles.length + filePreviews.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed.`);
        return;
      } else {
        setError(null);
      }

      const filesArray = Array.from(selectedFiles);
      setAttachedFiles((prevFiles) => [...prevFiles, ...filesArray]);
      filesArray.forEach((file) => {
        const reader = new FileReader();

        reader.onload = () => {
          if (file.type.startsWith("image/")) {
            newPreviews.push(reader.result as string);
          } else {
            newPreviews.push(file.name);
          }

          setFilePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
        };

        reader.readAsDataURL(file);
      });
    }
  };

  const handleCancelClick = (index: number) => {
    const newPreviews = [...filePreviews];
    newPreviews.splice(index, 1);
    setFilePreviews(newPreviews);
    setAttachedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    openModal("Product uploading... ");

    const requiredFields = [
      { value: title, message: "Title is required" },
      { value: photo, message: "Photo is required" },
      { value: category, message: "Category is required" },
      { value: writerId, message: "Writer is required" },
    ];
    for (const field of requiredFields) {
      if (!field.value) {
        openModal(field.message);
        return; // Stop submission if a required field is missing
      }
    }

    const strippedDescription = description.replace(/(<([^>]+)>)/gi, "").trim();
    const finalDescription = strippedDescription.length > 0 ? description : "";

    const strippedShortDescription = shortDescription
      .replace(/(<([^>]+)>)/gi, "")
      .trim();
    const finalShortDescription =
      strippedShortDescription.length > 0 ? shortDescription : "";

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("description", finalDescription);
    formData.append("shortDescription", finalShortDescription);
    formData.append("category", category);
    formData.append("subCategory", subCategory);
    formData.append("price", String(price));
    formData.append("unprice", String(unprice));
    formData.append("stockStatus", stockStatus);
    formData.append("writer", writerId);
    formData.append("youtubeVideo", youtubeVideo.replace(/\s+/g, ""));
    formData.append("shippingInside", String(shippingInside));
    formData.append("shippingOutside", String(shippingOutside));
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);
    formData.append("tags", tags.join(","));
    formData.append("publisher", publisher);
    formData.append("summary", summary);
    formData.append("numberOfPage", numberOfPage);
    formData.append("ISBN", ISBN);
    formData.append("edition", edition);
    formData.append("binding", binding);
    formData.append("productType", productType);
    formData.append("translatorName", translatorName);
    formData.append("language", language);
    formData.append("orderType", orderType);
    formData.append("titleEnglish", titleEnglish);
    formData.append("subTitle", subTitle);
    formData.append("suggestion", suggestionId);

    if (photo) {
      formData.append("photo", photo);
    }
    attachedFiles.forEach((file) => {
      formData.append("attachedFiles", file);
    });
    if (metaImageFile) {
      formData.append("metaImage", metaImageFile);
    }

    // Convert tags array to a comma-separated string

    let token = localStorage.getItem("accessToken");

    try {
      let response = await fetchWithTokenRefresh(`${apiUrl}/product/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        openModal("Product uploaded successfully");
      } else {
        openModal(`Failed to upload product`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      openModal("Failed to upload product due to an unexpected error");
    }
  };
  // Function to generate a slug from the title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "") // Remove special characters except dashes
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/--+/g, "-") // Replace multiple dashes with a single dash
      .trim();
  };

  // Update slug whenever the title changes
  useEffect(() => {
    setSlug(generateSlug(title));
  }, [title]);
  return (
    <>
      <div className="container my-4 flex justify-center">
        <div className="w-11/12">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full">
                <div className="mb-4">
                  <p>
                    Title Bangla<sup className="text-red-700">*</sup>
                  </p>
                  <input
                    type="text"
                    placeholder="title"
                    name="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md border-black"
                  />
                </div>
                <div className="mb-4">
                  <p>
                    Title English<sup className="text-red-700">*</sup>
                  </p>
                  <input
                    type="text"
                    placeholder="title"
                    name="title"
                    value={titleEnglish}
                    onChange={(e) => setTitleEnglish(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md border-black"
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
                    className="mt-1 p-2 w-full border rounded-md border-black"
                  />
                </div>

                <div className="mb-4 ">
                  <label
                    htmlFor="productType"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Book type:
                  </label>

                  <select
                    id="productType"
                    name="productType"
                    value={productType}
                    onChange={(e) => setProductType(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md border-black"
                    required
                  >
                    <option value="Fiction">Fiction</option>
                    <option value="Non_Fiction">Non Fiction. </option>
                    <option value="religion">Religion</option>

                    {/* Add more options as needed */}
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="subTitle"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Sub Title:
                  </label>
                  <input
                    type="text"
                    id="subTitle"
                    name="subTitle"
                    value={subTitle}
                    onChange={(e) => setSubTitle(e.target.value)}
                    className="mt-1 p-2 w-full border rounded-md border-black"
                    required
                  />
                </div>

                <div className="w-full">
                  <div className="mb-4">
                    <label
                      htmlFor="orderType"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Order type:
                    </label>
                    <select
                      id="orderType"
                      name="orderType"
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md border-black"
                      required
                    >
                      <option value="buyNow">Buy now </option>
                      <option value="preOrder">Pre Order</option>

                      {/* Add more options as needed */}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="language"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Language:
                    </label>
                    <select
                      id="language"
                      name="language"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md border-black"
                      required
                    >
                      <option value="english">English</option>
                      <option value="spanish">Spanish</option>
                      <option value="french">French</option>
                      <option value="german">German</option>
                      <option value="italian">Italian</option>
                      <option value="chinese">Chinese</option>
                      <option value="japanese">Japanese</option>
                      <option value="korean">Korean</option>
                      {/* Add more options as needed */}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="translatorName"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Translator Name:
                    </label>
                    <input
                      type="text"
                      id="translatorName"
                      name="translatorName"
                      value={translatorName}
                      onChange={(e) => setTranslatorName(e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md border-black"
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="binding"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Binding:
                    </label>

                    <select
                      id="binding"
                      name="binding"
                      value={binding}
                      onChange={(e) => setBinding(e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md border-black"
                      required
                    >
                      <option value="Hardcover">Hardcover</option>
                      <option value="Paperback">Paperback</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="edition"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Edition:
                    </label>
                    <select
                      id="edition"
                      name="edition"
                      value={edition}
                      onChange={(e) => setEdition(e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md border-black"
                      required
                    >
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                      <option value="4">Four</option>
                      {/* Add more options as needed */}
                    </select>
                  </div>{" "}
                </div>
                <div className="w-full">
                  <div className="mb-4">
                    <label
                      htmlFor="ISBN"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ISBN:
                    </label>
                    <input
                      type="text"
                      id="ISBN"
                      name="ISBN"
                      value={ISBN}
                      onChange={(e) => setISBN(e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md border-black"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="numberOfPage"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Number Of Page:
                    </label>
                    <input
                      type="number"
                      id="numberOfPage"
                      name="numberOfPage"
                      value={numberOfPage}
                      onChange={(e) => setNumberOfPage(e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md border-black"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="summary"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Summary:
                    </label>
                    <input
                      type="text"
                      id="summary"
                      name="summary"
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md border-black"
                    />
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="publisher"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Publisher:
                    </label>
                    <input
                      type="text"
                      id="publisher"
                      name="publisher"
                      value={publisher}
                      onChange={(e) => setSupplier(e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md border-black"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <p>
                    Category<sup className="text-red-700">*</sup>
                  </p>
                  <select
                    className="mt-1 p-2 w-full border rounded-md border-black"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.categoryName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-4">
                  <p>
                    Subcategory<sup className="text-red-700">*</sup>
                  </p>
                  <select
                    className="mt-1 p-2 w-full border rounded-md border-black"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                  >
                    {categories
                      .find((cat) => cat._id === category)
                      ?.subCategories.map((subCat) => (
                        <option key={subCat._id} value={subCat._id}>
                          {subCat.title}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="mb-4">
                  <p>Description</p>
                  <Content
                    onChange={(content) => setDescription(content)}
                    required
                    setContentValidity={setIsContentValid}
                  />
                </div>
                <div className="mb-4">
                  <p>Short Description</p>
                  <Content
                    onChange={(content) => setShortDescription(content)}
                    required
                    setContentValidity={setIsContentValid}
                  />
                </div>

                <div className="w-full ">
                  <Photo
                    title="Photo (600px * 600px)"
                    img=""
                    onImageChange={setPhoto}
                    requiredSing={true}
                  />
                </div>
                <div className="w-full ">
                  <p>Photo gallery</p>
                  <div className="flex flex-col items-start">
                    <label
                      htmlFor="fileInput"
                      className="cursor-pointer flex items-center bg-white mt-2 px-3 py-2 space-x-2"
                    >
                      <span>Attach Files</span>
                      <input
                        id="fileInput"
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        multiple
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="1em"
                        height="1em"
                        viewBox="0 0 15 15"
                      >
                        <path
                          fill="currentColor"
                          fillRule="evenodd"
                          d="M7.318.975a3.328 3.328 0 1 1 4.707 4.707l-5.757 5.757A1.914 1.914 0 1 1 3.56 8.732l5.585-5.586l.708.708l-5.586 5.585a.914.914 0 1 0 1.293 1.293l5.757-5.757a2.328 2.328 0 1 0-3.293-3.293L2.096 7.611a3.743 3.743 0 0 0 5.293 5.293l5.757-5.758l.708.708l-5.758 5.757A4.743 4.743 0 0 1 1.39 6.904z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </label>

                    {error && <div className="text-red-500">{error}</div>}

                    {filePreviews.length > 0 && (
                      <div className="text-sm text-gray-600 w-full mt-4 mb-8">
                        <b>File Previews:</b>
                        <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
                          {filePreviews.map((preview, index) => (
                            <div
                              key={index}
                              className="flex items-center relative justify-center bg-gray-100 p-1"
                            >
                              {typeof preview === "string" ? (
                                preview.startsWith("data:image") ? (
                                  <Image
                                    src={preview as string}
                                    width={50}
                                    height={50}
                                    alt="Preview"
                                    className="h-24 w-full object-cover"
                                  />
                                ) : (
                                  <span>{preview}</span>
                                )
                              ) : (
                                <span>{String(preview)}</span>
                              )}
                              <p
                                onClick={() => handleCancelClick(index)}
                                className="absolute text-red-500 right-1 top-1 cursor-pointer"
                              >
                                X
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
              <div className="w-full">
                <>
                  <div className="border-2 border-main border-dashed rounded-md p-2 my-8">
                    <button
                      type="submit"
                      className="bg-main flex items-center justify-center w-full text-white px-4 py-2 rounded-md"
                    >
                      Publish
                    </button>
                  </div>
                  <div className="mb-4">
                    <p>Unpriced</p>
                    <input
                      type="number"
                      placeholder="100"
                      value={unprice}
                      onChange={(e) => setunPrice(Number(e.target.value))}
                      className="mt-1 p-2 w-full border rounded-md border-black"
                    />
                  </div>
                  <div className="mb-4">
                    <p>
                      Price <sup className="text-red-700">*</sup>
                    </p>
                    <input
                      type="number"
                      placeholder="100"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="mt-1 p-2 w-full border rounded-md border-black"
                    />
                  </div>
                  <div className="mb-4">
                    <p>In Stock</p>
                    <select
                      className="mt-1 p-2 w-full border rounded-md border-black"
                      value={stockStatus}
                      onChange={(e) => setStockStatus(e.target.value)}
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <p>
                      Writer<sup className="text-red-700">*</sup>
                    </p>
                    <select
                      value={writerId}
                      onChange={(e) => setWriterId(e.target.value)}
                      className="p-2 w-full outline-none rounded-md"
                    >
                      <option value="" disabled>
                        Select writer
                      </option>
                      {writers.map((writer) => (
                        <option key={writer._id} value={writer._id}>
                          {writer.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mb-4">
                    <p>YouTube Video</p>
                    <input
                      type="text"
                      placeholder="example: 123,546,879"
                      value={youtubeVideo}
                      onChange={(e) => setYoutubeVideo(e.target.value)}
                      className="mt-1 p-2 w-full border rounded-md border-black"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center">
                    <p className="md:w-60">Shipping Inside</p>
                    <input
                      type="number"
                      placeholder="title"
                      value={shippingInside}
                      onChange={(e) =>
                        setShippingInside(Number(e.target.value))
                      }
                      className="mt-1 p-2 w-full border rounded-md border-black"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center">
                    <p className="md:w-60">Shipping Outside</p>
                    <input
                      type="number"
                      placeholder="title"
                      value={shippingOutside}
                      onChange={(e) =>
                        setShippingOutside(Number(e.target.value))
                      }
                      className="mt-1 p-2 w-full border rounded-md border-black"
                    />
                  </div>
                  <div className="mb-4">
                    <p>Suggestion</p>
                    <select
                      className="p-2 mt-2 w-full outline-none rounded-md"
                      value={suggestionId}
                      onChange={(e) => setSuggestionId(e.target.value)}
                    >
                      {" "}
                      <option value="" disabled>
                        Add Suggestion products
                      </option>
                      {suggestions?.map((suggestion) => (
                        <option key={suggestion._id} value={suggestion._id}>
                          {suggestion.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              </div>
            </div>
          </form>
          <Modal
            isOpen={modalIsOpen}
            onClose={closeModal}
            content={modalContent}
          />
        </div>
      </div>
    </>
  );
};
export default IndexPage;
interface section {
  img: File | null;
  title: string;
  variantPrice: string;
}
