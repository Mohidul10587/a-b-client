"use client";
import React, { useState, useEffect } from "react";
import { apiUrl } from "@/app/shared/urls";
import { IBanner } from "@/types/banner";
import { IFormData } from "@/types/element";
import Image from "next/image";
import { ICategory } from "@/types/category";
import { IWriter } from "../../../types/writer";

// import { ISuggestion } from "@/types/suggestion";

interface PageProps {
  onClose: () => void;
  page: string;
  id: string;
  loadData: boolean;
  setLoadData: React.Dispatch<React.SetStateAction<boolean>>;
}
const PageBuilder: React.FC<PageProps> = ({
  onClose,
  page,
  id,
  loadData,
  setLoadData,
}) => {
  const [formData, setFormData] = useState<IFormData>({
    targetedPageId: id,
    sectionTitle: "",
    link: "",
    status: true,
    titleLink: "",
    titleAlignment: "left",
    isTitle: true,
    desktopGrid: 4,
    mobileGrid: 1,
    margin: 0,
    padding: 0,
    titleBackgroundColor: "#ffffff",
    sectionBackgroundColor: "#ffffff",
    boxText: "#ffffff",
    boxBg: "#ffffff",
    gridStyle: "1",
    productStyle: "1",
    postLimit: 10,
    display: "both",
    imagePosition: "left",
    page: page,
    position: 0,
    selectionType: "banner",
    bannerId: "",
    suggestion: "",
    productSectionId: "",
    suggestionId: "",
    sellerId: "",
    images: [],
    width: 20,
    height: 20,
    selectedOption: "",
    isSellerElementStatus: true,
  });

  const [banners, setBanners] = useState<IBanner[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]); // State for selected images
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalType, setModalType] = useState<
    "success" | "error" | "pending" | null
  >(null);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IWriter[]>([]);
  const [selectedOption, setSelectedOption] = useState(""); // Tracks whether category or brand is selected

  // Fetch banners, categories, and brands when the component mounts
  // const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch banners
        const bannersResponse = await fetch(`${apiUrl}/banner/all`);
        if (bannersResponse.ok) {
          const bannersData = await bannersResponse.json();
          setBanners(bannersData);
        } else {
          console.error("Failed to fetch banners");
        }

        // Fetch categories
        const categoriesResponse = await fetch(`${apiUrl}/category/all`);
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData.categories);
        } else {
          console.error("Failed to fetch categories");
        }

        // // Fetch brands
        // const brandsResponse = await fetch(`${apiUrl}/brand/all`);
        // if (brandsResponse.ok) {
        //   const brandsData = await brandsResponse.json();
        //   setBrands(brandsData.brands);
        // } else {
        //   console.error("Failed to fetch brands");
        // }

        // // Fetch brands
        // const suggestionResponse = await fetch(`${apiUrl}/suggestion`);
        // if (suggestionResponse.ok) {
        //   const data = await suggestionResponse.json();
        //   setSuggestions(data);
        // } else {
        //   console.error("Failed to fetch brands");
        // }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  const subcategories = categories.flatMap((category) =>
    category.subCategories.map((subcategory) => ({
      _id: subcategory._id,
      title: subcategory.title,
      parentName: category.title, // Add parent category name
    }))
  );

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;

    // For selecting category or brand, update the productSectionId
    if (name === "productSectionId") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        productSectionId: value, // Set either categoryId or brandId
      }));
    } else if (name === "suggestion") {
      setSelectedOption("");
      setFormData((prevFormData) => ({
        ...prevFormData,
        productSectionId: value, // Set either categoryId or brandId
      }));
    } else {
      setSelectedOption("");
      // Handle other form inputs normally
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    setModalMessage("Element creating...!");
    setModalType("pending");
    event.preventDefault();
    if (formData.selectionType === "banner" && !formData.bannerId) {
      setModalMessage("Select a banner please");
      setModalType("error");
      return; // Exit the function early
    }
    if (
      formData.selectionType === "productSection" &&
      !formData.productSectionId
    ) {
      setModalMessage("Select a category or subcategory or a brand please");
      setModalType("error");
      return; // Exit the function early
    }
    if (
      formData.selectionType === "suggestionSection" &&
      !formData.suggestion
    ) {
      setModalMessage("Select a suggestion please");
      setModalType("error");
      return; // Exit the function early
    }
    try {
      const formDataToSubmit = new FormData();
      formDataToSubmit.append(
        "targetedPageId",
        formData.targetedPageId as string
      );
      formDataToSubmit.append("sectionTitle", formData.sectionTitle as string);
      formDataToSubmit.append("status", formData.status ? "true" : "false");

      formDataToSubmit.append("titleLink", formData.titleLink as string);
      formDataToSubmit.append(
        "titleAlignment",
        formData.titleAlignment as string
      );
      formDataToSubmit.append("isTitle", formData.isTitle ? "true" : "false");
      formDataToSubmit.append("desktopGrid", formData.desktopGrid.toString());
      formDataToSubmit.append("mobileGrid", formData.mobileGrid.toString());
      formDataToSubmit.append("margin", formData.margin.toString());
      formDataToSubmit.append("padding", formData.padding.toString());
      formDataToSubmit.append("width", formData.width.toString());
      formDataToSubmit.append("height", formData.height.toString());
      formDataToSubmit.append(
        "titleBackgroundColor",
        formData.titleBackgroundColor
      );
      formDataToSubmit.append(
        "sectionBackgroundColor",
        formData.sectionBackgroundColor
      );
      formDataToSubmit.append("boxText", formData.boxText);
      formDataToSubmit.append("boxBg", formData.boxBg);
      formDataToSubmit.append("gridStyle", formData.gridStyle);
      formDataToSubmit.append("productStyle", formData.productStyle);
      formDataToSubmit.append("postLimit", formData.postLimit.toString());
      formDataToSubmit.append("display", formData.display);
      formDataToSubmit.append("imagePosition", formData.imagePosition);
      formDataToSubmit.append("page", formData.page);
      formDataToSubmit.append("position", formData.position.toString());
      formDataToSubmit.append("selectionType", formData.selectionType);
      formDataToSubmit.append("bannerId", formData.bannerId);
      formDataToSubmit.append("productSectionId", formData.productSectionId);
      formDataToSubmit.append("suggestion", "");

      // Append images
      formData.images.forEach((image, index) => {
        formDataToSubmit.append("images", image);
      });

      const response = await fetch(`${apiUrl}/element/create-page-element`, {
        method: "POST",
        credentials: "include",
        body: formDataToSubmit, // No need for Content-Type here, browser sets it automatically
      });

      if (response.ok) {
        // Display success modal
        setModalMessage("Element created successfully!");
        setModalType("success");
        onClose();
        setLoadData(!loadData);
      } else {
        // Display error modal
        setModalMessage("Failed to create element. Please try again.");
        setModalType("error");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setModalMessage("An error occurred. Please try again.");
      setModalType("error");
    }
  };
  const handleRemoveImage = (index: number) => {
    // Remove the image from both selectedImages and formData.images
    setSelectedImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: prevFormData.images.filter((_, i) => i !== index),
    }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files; // Get the selected files
    if (files) {
      const newSelectedImages: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const reader = new FileReader();
        reader.onloadend = () => {
          newSelectedImages.push(reader.result as string); // Add the image data URL
          if (newSelectedImages.length === files.length) {
            setSelectedImages((prevImages) => [
              ...prevImages,
              ...newSelectedImages,
            ]); // Update the state with all selected images
          }
        };
        reader.readAsDataURL(file);
      }

      // Also add the files to the formData for submission if needed
      setFormData((prevFormData) => ({
        ...prevFormData,
        images: [...prevFormData.images, ...Array.from(files)],
      }));
    }
  };
  const handleBannerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBannerId = event.target.value; // Get selected banner ID
    setFormData((prevFormData) => ({
      ...prevFormData,
      bannerId: selectedBannerId, // Update the bannerId in formData
    }));
  };

  const handleSuggestionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedSuggestionId = event.target.value; // Get selected banner ID
    setFormData((prevFormData) => ({
      ...prevFormData,
      suggestion: selectedSuggestionId, // Update the bannerId in formData
    }));
  };
  function capitalizeFirstLetter(word: string) {
    if (!word) return ""; // return an empty string if no word is provided
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  const closeModal = () => {
    setModalMessage(null);
    setModalType(null);
  };

  const handleSelectionChange = (selection: string) => {
    setSelectedOption(selection);
    // Reset the productSectionId when changing between category, subcategory, and brand
    setFormData((prevFormData) => ({
      ...prevFormData,
      productSectionId: "", // Clear productSectionId when switching options
    }));
  };

  return (
    <>
      <div className="flex justify-center items-center h-full max-w-3xl mx-auto overflow-y-auto">
        <div className="bg-white p-4 w-full relative">
          {/* Form */}

          {/* here is my form  */}
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between">
              <h2 className="text-xl">
                Create Element for{" "}
                <span className="  underline">
                  {capitalizeFirstLetter(page)}
                </span>{" "}
                Page
              </h2>
              <button onClick={onClose} className="text-red-500 font-bold">
                Close
              </button>
            </div>
            <>
              <div className="flex items-center mb-2">
                <div className="w-full">
                  <label className="block text-gray-700 font-medium mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    name="sectionTitle"
                    value={formData.sectionTitle}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border outline-0"
                    required
                  />
                </div>
                {/* Title On/Off */}
                <div className="ml-2">
                  <div className="flex flex-col items-center">
                    <label className="block">Hidden</label>
                    <input
                      type="checkbox"
                      name="showTitle"
                      checked={formData.isTitle || false}
                      onChange={(e: any) =>
                        setFormData({
                          ...formData,
                          isTitle: e.target.checked,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                <div>
                  <label className="block">Position</label>
                  <input
                    type="number"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border outline-0"
                    required
                  />
                </div>
                <div>
                  <label className="block">Post Limit</label>
                  <input
                    type="number"
                    name="postLimit"
                    value={formData.postLimit}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border outline-0"
                    required
                  />
                </div>
                {/* Desktop and Mobile Grids */}
                <div>
                  <label className="block">Desktop Grid</label>
                  <input
                    type="number"
                    name="desktopGrid"
                    value={formData.desktopGrid || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border outline-0"
                    placeholder="Enter number of grid columns"
                  />
                </div>
                <div>
                  <label className="block">Mobile Grid</label>
                  <input
                    type="number"
                    name="mobileGrid"
                    value={formData.mobileGrid || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border outline-0"
                    placeholder="Enter number of grid columns"
                  />
                </div>
              </div>
              <div className="flex items-center mb-2 gap-4">
                {/* Conditionally render the Banner select */}
                <div className="w-1/2">
                  <label className="block">Link</label>
                  <input
                    type="text"
                    name="link"
                    value={formData.link}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border outline-0"
                  />
                </div>
                {/* Subtitle */}
                {/* Title Alignment */}
                <div className="w-1/2">
                  <label className="block">Title Alignment</label>
                  <select
                    name="titleAlignment"
                    value={formData.titleAlignment || "left"}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border outline-0"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </div>

              {/* Margin & Padding */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Margin
                  </label>
                  <input
                    type="number"
                    name="margin"
                    value={formData.margin || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mt-2">
                    Padding
                  </label>
                  <input
                    type="number"
                    name="padding"
                    value={formData.padding || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Width
                  </label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mt-2">
                    Height
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                {/* Background Colors */}
                <div>
                  <label className="block">Title BG color</label>
                  <input
                    type="color"
                    name="titleBackgroundColor"
                    value={formData.titleBackgroundColor || "#ffffff"}
                    onChange={handleChange}
                    className="w-full h-8 border"
                  />
                </div>
                <div>
                  <label className="block">Title text color</label>
                  <input
                    type="color"
                    name="sectionBackgroundColor"
                    value={formData.sectionBackgroundColor || "#ffffff"}
                    onChange={handleChange}
                    className="w-full h-8 border"
                  />
                </div>
                {/* Background Colors */}
                <div>
                  <label className="block">Box Color</label>
                  <input
                    type="color"
                    name="boxText"
                    value={formData.boxText || "#ffffff"}
                    onChange={handleChange}
                    className="w-full h-8 border"
                  />
                </div>
                <div>
                  <label className="block">Box Bg</label>
                  <input
                    type="color"
                    name="boxBg"
                    value={formData.boxBg || "#ffffff"}
                    onChange={handleChange}
                    className="w-full h-8 border"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-2">
                {/* Grid & Product Styles */}
                <div>
                  <label className="block">Grid Style</label>
                  <select
                    name="gridStyle"
                    value={formData.gridStyle || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border"
                  >
                    <option value="1">Slider</option>
                    <option value="2">Grid</option>
                  </select>
                </div>
                <div>
                  <label className="block">Product Style</label>
                  <select
                    name="productStyle"
                    value={formData.productStyle || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border"
                  >
                    <option value="1">Box Style 1</option>
                    <option value="2">Box Style 2</option>
                  </select>
                </div>
                {/* Display Option */}
                <div>
                  <label className="block">Display On</label>
                  <select
                    name="display"
                    value={formData.display || "both"}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border"
                  >
                    <option value="both">Both</option>
                    <option value="desktop">Desktop</option>
                    <option value="mobile">Mobile</option>
                  </select>
                </div>
              </div>
            </>
            <>
              {/* Radio buttons for selecting Banner or Product Section */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Select Type
                </label>
                <div className="flex space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="selectionType"
                      value="banner"
                      checked={formData.selectionType === "banner"}
                      onChange={handleChange}
                      className="form-radio h-5 w-5"
                    />
                    <span className="ml-2 text-gray-700">Add A Banner</span>
                  </label>

                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="selectionType"
                      value="productSection"
                      checked={formData.selectionType === "productSection"}
                      onChange={handleChange}
                      className="form-radio h-5 w-5"
                    />
                    <span className="ml-2 text-gray-700">
                      Add A Product Section
                    </span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="selectionType"
                      value="suggestionSection"
                      checked={formData.selectionType === "suggestionSection"}
                      onChange={handleChange}
                      className="form-radio h-5 w-5"
                    />
                    <span className="ml-2 text-gray-700">
                      Add A Suggestion Section
                    </span>
                  </label>
                </div>
              </div>
              <div className="h-32">
                {formData.selectionType === "banner" && (
                  <div className="mb-4 ">
                    <label className="block text-gray-700 font-medium mb-2">
                      Select Banner
                    </label>
                    <select
                      name="bannerId"
                      value={formData.bannerId} // Set the value based on formData
                      onChange={handleBannerChange} // Use the new handler for banner selection
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="" disabled>
                        Select a banner
                      </option>{" "}
                      {/* Placeholder */}
                      {banners.map((banner) => (
                        <option key={banner._id} value={banner._id}>
                          {banner.title}{" "}
                          {/* Adjust this based on your banner object structure */}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {formData.selectionType === "productSection" && (
                  <div className="flex space-x-4">
                    <div className="flex space-x-4 mb-4 items-center">
                      <div>
                        <label className="block text-gray-700 font-medium">
                          Select Query Type
                        </label>
                      </div>

                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="selection"
                          value="category"
                          onChange={() => handleSelectionChange("category")} // Use a function to handle selection change
                          checked={selectedOption === "category"}
                          className="form-radio h-5 w-5"
                        />
                        <span className="ml-2 text-gray-700">Category</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="selection"
                          value="subcategory"
                          onChange={() => handleSelectionChange("subcategory")} // Use a function to handle selection change
                          checked={selectedOption === "subcategory"}
                          className="form-radio h-5 w-5"
                        />
                        <span className="ml-2 text-gray-700">Subcategory</span>
                      </label>
                      <label className="inline-flex items-center">
                        <input
                          type="radio"
                          name="selection"
                          value="brand"
                          onChange={() => handleSelectionChange("brand")} // Use a function to handle selection change
                          checked={selectedOption === "brand"}
                          className="form-radio h-5 w-5"
                        />
                        <span className="ml-2 text-gray-700">Brand</span>
                      </label>
                    </div>
                  </div>
                )}

                <>
                  {selectedOption === "category" && (
                    <div>
                      <label className="block" htmlFor="categorySelect">
                        Select Category
                      </label>
                      <select
                        id="categorySelect"
                        value={formData.productSectionId || ""} // Set the value to an empty string if nothing is selected
                        onChange={(e) =>
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            productSectionId: e.target.value, // Update productSectionId in formData
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="" disabled>
                          Choose a category
                        </option>
                        {categories.map((category) => (
                          <option key={category._id} value={category._id}>
                            {category.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedOption === "subcategory" && (
                    <div>
                      <label className="block" htmlFor="subcategorySelect">
                        Select Subcategory
                      </label>
                      <select
                        id="subcategorySelect"
                        value={formData.productSectionId || ""} // Set the value to an empty string if nothing is selected
                        onChange={(e) =>
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            productSectionId: e.target.value, // Update productSectionId in formData
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="" disabled>
                          Choose a subcategory
                        </option>
                        {subcategories.map((subcategory) => (
                          <option key={subcategory._id} value={subcategory._id}>
                            {subcategory.parentName}- {subcategory.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {selectedOption === "brand" && (
                    <div>
                      <label className="block" htmlFor="brandSelect">
                        Select Brand
                      </label>
                      <select
                        id="brandSelect"
                        value={formData.productSectionId || ""} // Set the value to an empty string if nothing is selected
                        onChange={(e) =>
                          setFormData((prevFormData) => ({
                            ...prevFormData,
                            productSectionId: e.target.value, // Update productSectionId in formData
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="" disabled>
                          Choose a brand
                        </option>
                        {brands.map((brand) => (
                          <option key={brand._id} value={brand._id}>
                            {brand.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              </div>
            </>

            <>
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  Upload Images
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer w-full px-3 py-2 border border-gray-300 rounded-md text-center bg-blue-500 text-white"
                >
                  Choose Images
                </label>
              </div>

              {/* Display the selected images */}
              {selectedImages.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-bold">Selected Images:</h3>
                  <div className="grid grid-cols-6 gap-4 mt-2">
                    {selectedImages.map((image, index) => (
                      <div key={index} className="relative w-full h-20">
                        <Image
                          src={image}
                          alt={`Selected ${index + 1}`}
                          width={100}
                          height={100}
                          unoptimized
                          className="rounded border border-green-500"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="absolute top-0 right-[8px] bg-red-500 text-white rounded-full px-1 hover:bg-red-600"
                          aria-label={`Remove image ${index + 1}`}
                        >
                          x
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
            {/* Submit button */}
            <button
              type="submit"
              className="bg-main text-white px-4 py-2 rounded-md w-full"
            >
              Submit
            </button>
          </form>
          {modalMessage && modalType && (
            <Modal
              message={modalMessage}
              type={modalType}
              onClose={closeModal}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default PageBuilder;

const Modal = ({
  message,
  type,
  onClose,
}: {
  message: string;
  type: "success" | "error" | "pending";
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2
          className={`text-lg font-medium mb-4 ${
            type === "success" && "text-green-600"
          } ${type === "error" && "text-red-600"} ${
            type === "pending" && "text-yellow-600"
          }`}
        >
          {type === "success" && "Success"}
          {type === "error" && "Error"}
          {type === "pending" && "Creating"}
        </h2>
        <p className="mb-4">{message}</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};
