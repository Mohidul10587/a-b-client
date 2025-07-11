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
import { IProduct } from "@/types/product";
import { req } from "@/app/shared/request";
import { useData } from "@/app/DataContext";

const Form: React.FC<Props<IProduct>> = ({
  id,
  initialData,
  pagePurpose = "add",
}) => {
  const { showModal } = useData();
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
  const [data, setData] = useState(initialData);

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
      [name]:
        name === "discount" || name === "sellingPrice" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    showModal("Product uploading... ");

    const requiredFields = [
      { value: data.titleEn, message: "Title is  required" },
      { value: data.img, message: "Photo is  required" },
      { value: data.category, message: "Category is  required" },
      { value: data.writer, message: "Writer is  required" },
    ];
    for (const field of requiredFields) {
      if (!field.value) {
        showModal(field.message, "info");
        return; // Stop submission if a  field is missing
      }
    }

    const updatedData = {
      ...data,
      description: processContent(description),
      shortDescription: processContent(shortDescription),
    };

    const url =
      pagePurpose === "add" ? "product/create" : `product/update/${id}`;
    const method = pagePurpose === "add" ? "POST" : `PUT`;
    try {
      const { res, data: resData } = await req(url, method, updatedData);
      showModal(resData.message, res.ok ? "success" : "error");
    } catch (error) {
      showModal("Failed to upload product due to an unexpected error", "error");
    } finally {
    }
  };

  // Update slug whenever the title changes

  return (
    <>
      <div className="container md:p-4 p-2 flex justify-center">
        <div className="w-11/12">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full">
                <div className="mb-4">
                  <p>
                    Title English<sup className="text-red-700">*</sup>
                  </p>
                  <input
                    type="text"
                    placeholder="title"
                    name="titleEn"
                    value={data.titleEn}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md border-black"
                    required
                  />
                </div>
                <div className="mb-4">
                  <p>
                    Title Bangla <sup className="text-red-700">*</sup>
                  </p>
                  <input
                    type="text"
                    placeholder="title"
                    name="titleBn"
                    value={data.titleBn}
                    onChange={handleChange}
                    className="mt-1 p-2 w-full border rounded-md border-black"
                    required
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
                    <div className={"rounded"}>
                      <Image
                        src={data.img || "/default.jpg"}
                        width={200}
                        height={150}
                        alt="Image"
                        className="border border-black rounded"
                        onClick={() => {
                          setIsImageModalOpen(true);
                          setImageType("img");
                        }}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <p>Unpriced</p>
                    <input
                      type="number"
                      placeholder="100"
                      value={data.regularPrice}
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
                      value={data.sellingPrice}
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
                      value={data.suggestion}
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
                        className="border border-black rounded"
                        onClick={() => {
                          setIsImageModalOpen(true);
                          setImageType("metaImg");
                        }}
                      />
                    </div>
                  </div>
                </>
              </div>
            </div>
          </form>

          <ImageGallery
            isOpen={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
            img={imageType}
            setData={setData}
            data={data}
          />
        </div>
      </div>
    </>
  );
};
export default Form;
