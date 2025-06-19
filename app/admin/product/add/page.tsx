"use client";
import { apiUrl } from "@/app/shared/urls";
import Content from "@/app/admin/components/Content";
import Modal from "@/app/admin/components/Modal";
import { IWriter } from "@/types/writer";
import { ICategory } from "@/types/category";
import React, { useEffect, useState } from "react";
import { ISuggestion } from "@/types/suggestion";
import ImageGallery from "@/components/ImageGallery";
import { processContent } from "@/app/shared/processContent";
import Image from "next/image";
import { languages } from "@/app/shared/language";
const IndexPage: React.FC = () => {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imageType, setImageType] = useState("");
  const [publishers, setPublishers] = useState<any[]>([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [writers, setWriters] = useState<IWriter[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<any | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<any | null>(
    null
  );
  const [data, setData] = useState({
    publisher: "",
    summary: "",
    numberOfPage: 0,
    ISBN: "",
    edition: "",
    binding: "",
    productType: "",
    translatorName: "",
    language: "bn",
    orderType: "",
    metaTitle: "",
    metaDescription: "",
    tags: "",
    metaValue: "",
    title: "",
    titleEnglish: "",
    subTitle: "",
    description: "",
    shortDescription: "",
    category: "",
    price: 0,
    unprice: 0,
    stockStatus: "",
    writer: "",
    youtubeVideo: "",
    shippingInside: 50,
    shippingOutside: 50,
    img: "",
    suggestionId: "",
    metaImg: "",
    subcategory: "",
  });

  const openModal = (content: string) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setIsImageModalOpen(false);
  };

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/publishers/allForProductUploadPage`
        );
        if (response.ok) {
          const data = await response.json();

          setPublishers(data.publishers);
        } else {
          throw new Error("Failed to fetch brands");
        }
      } catch (error) {
        console.error(error);
      }
    };
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
        const response = await fetch(
          `${apiUrl}/category/allCategoryForProductAddPage`
        );
        if (response.ok) {
          const data = await response.json();
          setCategories(data.respondedData);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {}
    };
    fetchPublishers();
    fetchSuggestion();
    fetchWriters();
    fetchCategories();
  }, []);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = e.target.value;
    const category =
      categories.find((cat: any) => cat._id === categoryId) || null;
    setSelectedCategory(category);
    setSelectedSubcategory(null);

    setData({
      ...data,
      category: categoryId,
      subcategory: "",
    });
  };

  const handleSubcategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const subcategoryId = e.target.value;
    const subcategory =
      selectedCategory?.subcategories.find(
        (sub: any) => sub._id === subcategoryId
      ) || null;
    setSelectedSubcategory(subcategory);

    setData({ ...data, subcategory: subcategoryId });
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: name === "discount" || name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    openModal("Product uploading... ");

    const requiredFields = [
      { value: data.title, message: "Title is required" },
      { value: data.img, message: "Photo is required" },
      { value: data.category, message: "Category is required" },
      { value: data.writer, message: "Writer is required" },
    ];
    for (const field of requiredFields) {
      if (!field.value) {
        openModal(field.message);
        return; // Stop submission if a required field is missing
      }
    }

    const updatedData = {
      ...data,

      description: processContent(description),
      shortDescription: processContent(shortDescription),
    };

    try {
      let response = await fetch(`${apiUrl}/product/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-type": "Application/json",
        },
        body: JSON.stringify(updatedData),
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

  // Update slug whenever the title changes

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
                    value={data.title}
                    onChange={handleChange}
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
                    name="titleEnglish"
                    value={data.titleEnglish}
                    onChange={handleChange}
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
                    value={data.productType}
                    onChange={handleChange}
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
                    value={data.subTitle}
                    onChange={handleChange}
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
                      value={data.orderType}
                      onChange={handleChange}
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
                      htmlFor="language-selector"
                      className="block mb-2 font-medium"
                    >
                      Select Language:
                    </label>
                    <select
                      id="language-selector"
                      value={data.language}
                      name="language"
                      onChange={handleChange}
                      className="border rounded-lg p-2 w-full"
                    >
                      <option value="" disabled>
                        Choose a language
                      </option>
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name} ({lang.nativeName})
                        </option>
                      ))}
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
                      value={data.translatorName}
                      onChange={handleChange}
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
                      value={data.binding}
                      onChange={handleChange}
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
                      value={data.edition}
                      onChange={handleChange}
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
                      value={data.ISBN}
                      onChange={handleChange}
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
                      value={data.numberOfPage}
                      onChange={handleChange}
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
                      value={data.summary}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border rounded-md border-black"
                    />
                  </div>
                  <div className="mb-4">
                    <p>
                      Publisher<sup className="text-red-700">*</sup>
                    </p>
                    <select
                      className="mt-1 p-2 w-full border rounded-md border-black"
                      value={data.publisher}
                      name="publisher"
                      onChange={handleChange}
                      required
                    >
                      <option value="">-- Select a Publisher --</option>
                      {publishers.map((item) => (
                        <option key={item._id} value={item._id}>
                          {item.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mb-4">
                  <label htmlFor="category" className="block mb-2 font-medium">
                    Select Category
                  </label>
                  <select
                    id="category"
                    className="w-full p-2 border rounded"
                    onChange={handleCategoryChange}
                    value={selectedCategory?._id || ""}
                    required
                  >
                    <option value="">-- Select a Category --</option>
                    {categories.map((category: any) => (
                      <option key={category._id} value={category._id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>

                {selectedCategory &&
                  selectedCategory.subcategories.length > 0 && (
                    <div className="mb-4">
                      <label
                        htmlFor="subcategory"
                        className="block mb-2 font-medium"
                      >
                        Select Subcategory
                      </label>
                      <select
                        id="subcategory"
                        className="w-full p-2 border rounded"
                        onChange={handleSubcategoryChange}
                        value={selectedSubcategory?._id || ""}
                      >
                        <option value="">-- Select a Subcategory --</option>
                        {selectedCategory.subcategories.map(
                          (subcategory: any) => (
                            <option
                              key={subcategory._id}
                              value={subcategory._id}
                            >
                              {subcategory.title}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                  )}

                <div className="mb-4">
                  <p>Description</p>
                  <Content onChange={(content) => setDescription(content)} />
                </div>
                <div className="mb-4">
                  <p>Short Description</p>
                  <Content
                    onChange={(content) => setShortDescription(content)}
                  />
                </div>

                <div className="w-full "></div>
                <div className="w-full ">
                  <p>Photo gallery</p>
                </div>
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

                  <div className="mb-4">
                    <p>Unpriced</p>
                    <input
                      type="number"
                      placeholder="100"
                      value={data.unprice}
                      onChange={handleChange}
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
                      value={data.price}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border rounded-md border-black"
                    />
                  </div>
                  <div className="mb-4">
                    <p>In Stock</p>
                    <select
                      className="mt-1 p-2 w-full border rounded-md border-black"
                      value={data.stockStatus}
                      onChange={handleChange}
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
                      value={data.writer}
                      onChange={handleChange}
                      name="writer"
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
                      value={data.youtubeVideo}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border rounded-md border-black"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center">
                    <p className="md:w-60">Shipping Inside</p>
                    <input
                      type="number"
                      placeholder="title"
                      value={data.shippingInside}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border rounded-md border-black"
                    />
                  </div>
                  <div className="flex flex-col md:flex-row md:items-center">
                    <p className="md:w-60">Shipping Outside</p>
                    <input
                      type="number"
                      placeholder="title"
                      value={data.shippingOutside}
                      onChange={handleChange}
                      className="mt-1 p-2 w-full border rounded-md border-black"
                    />
                  </div>
                  <div className="mb-4">
                    <p>Suggestion</p>
                    <select
                      className="p-2 mt-2 w-full outline-none rounded-md"
                      value={data.suggestionId}
                      onChange={handleChange}
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
                </>
              </div>
            </div>
          </form>
          <Modal
            isOpen={modalIsOpen}
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
      </div>
    </>
  );
};
export default IndexPage;
