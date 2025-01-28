"use client";
import React, { useState, useEffect, FC } from "react";
import { apiUrl } from "@/app/shared/urls";
import { IBanner } from "@/types/banner";
import { IFormData } from "@/types/element";
import Image from "next/image";
import { ICategory } from "@/types/category";

import { fetchWithTokenRefresh } from "@/app/shared/fetchWithTokenRefresh";
import Modal from "@/app/admin/components/Modal";
import { ISuggestion } from "@/types/suggestion";
import { IWriter } from "@/types/writer";

interface PageProps {
  id: string;
  onClose: () => void;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
  change: boolean;
}

const UpdateElement: FC<PageProps> = ({ id, onClose, setChange, change }) => {
  const [selectedOption, setSelectedOption] = useState(""); // Tracks whether category or brand is selected
  const handleBannerChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBannerId = event.target.value; // Get selected banner ID
    setFormData((prevFormData) => ({
      ...prevFormData,
      bannerId: selectedBannerId, // Update the bannerId in formData
    }));
  };
  // Fetch banners, categories, and brands when the component mounts

  const [formData, setFormData] = useState<IFormData>({
    targetedPageId: "id",
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
    page: "page",
    position: 0,
    selectionType: "banner",
    bannerId: "",
    productSectionId: "",
    images: [],
    width: 20,
    height: 20,
    suggestionId: "",
  });
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IWriter[]>([]);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalType, setModalType] = useState(false);
  const closeModal = () => {
    setModalType(false);
  };

  const handleSelectionChange = (selection: string) => {
    setSelectedOption(selection);
    // Reset the productSectionId when changing between category, subcategory, and brand
    setFormData((prevFormData) => ({
      ...prevFormData,
      productSectionId: "", // Clear productSectionId when switching options
    }));
  };

  // Fetch data effect (unchanged)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch banners
        const bannersResponse = await fetch(`${apiUrl}/banner/all`);
        if (bannersResponse.ok) {
          const bannersData = await bannersResponse.json();
          setBanners(bannersData);
        }

        // Fetch categories and brands in parallel
        const [categoriesResponse, brandsResponse] = await Promise.all([
          fetch(`${apiUrl}/category/all`),
          fetch(`${apiUrl}/brand/all`),
        ]);

        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData.categories); // Set categories
        }

        if (brandsResponse.ok) {
          const brandsData = await brandsResponse.json();
          setBrands(brandsData.brands); // Set brands
        }

        // Fetch brands
        const suggestionResponse = await fetch(`${apiUrl}/suggestion`);
        if (suggestionResponse.ok) {
          const data = await suggestionResponse.json();
          setSuggestions(data);
        } else {
          console.error("Failed to fetch brands");
        }
        // Now fetch the element details after categories and brands are fetched
        const elementResponse = await fetch(
          `${apiUrl}/element/singleElementForUpdate/${id}`
        );
        if (elementResponse.ok) {
          const { data } = await elementResponse.json();
          const element = data;
          setFormData(element);
        } else {
          console.error("Failed to fetch element data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  // Use categories and brands here since they are already fetched
  const matchingCategory = categories.find(
    (category) => category._id === formData.productSectionId
  );
  const matchingBrand = brands.find(
    (brand) => brand._id === formData.productSectionId
  );
  useEffect(() => {
    if (matchingCategory) {
      setSelectedOption("category");
    }
  }, [matchingCategory]);
  useEffect(() => {
    if (matchingBrand) {
      setSelectedOption("brand");
    }
  }, [matchingBrand]);

  const subcategories = categories.flatMap((category) =>
    category.subCategories.map((subcategory) => ({
      _id: subcategory._id,
      title: subcategory.title,
      parentName: category.title, // Add parent category name
    }))
  );
  const matchingSubcategories = subcategories.find(
    (subcategory) => subcategory._id === formData.productSectionId
  );
  useEffect(() => {
    if (matchingSubcategories) {
      setSelectedOption("subcategory");
    }
  }, [matchingSubcategories]);

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

    if (formData.selectionType === "productSection") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        bannerId: null,
        suggestionId: null,
      }));
    }

    if (formData.selectionType === "banner") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        productSectionId: "",
        suggestionId: null,
      }));
    }
    if (formData.selectionType === "suggestionSection") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        productSectionId: "",
        bannerId: null,
      }));
    }
  };

  const handleSuggestionChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedSuggestionId = event.target.value; // Get selected banner ID
    setFormData((prevFormData) => ({
      ...prevFormData,
      suggestionId: selectedSuggestionId, // Update the bannerId in formData
    }));
  };

  // Handle image click to trigger file selection for replacement

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (formData.selectionType === "productSection") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        bannerId: null,
        suggestionId: null,
      }));
    }

    if (formData.selectionType === "banner") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        productSectionId: "",
        suggestionId: null,
      }));
    }
    if (formData.selectionType === "suggestionSection") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        productSectionId: "",
        bannerId: null,
      }));
    }
    if (formData.selectionType === "banner" && !formData.bannerId) {
      setModalMessage("Select a banner please");
      setModalType(true);
      return; // Exit the function early
    }
    if (
      formData.selectionType === "productSection" &&
      !formData.productSectionId
    ) {
      setModalMessage("Select a category or subcategory or a brand please");
      setModalType(true);
      return; // Exit the function early
    }
    if (
      formData.selectionType === "suggestionSection" &&
      !formData.suggestionId
    ) {
      setModalMessage("Select a suggestion please");
      setModalType(true);
      return; // Exit the function early
    }
    try {
      setModalMessage("Updating the element ...");
      setModalType(true);
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
      formDataToSubmit.append(
        "imagePosition",
        formData.imagePosition as string
      );
      formDataToSubmit.append("page", formData.page);

      formDataToSubmit.append("position", formData.position.toString());
      formDataToSubmit.append("selectionType", formData.selectionType);
      formDataToSubmit.append("bannerId", formData.bannerId);
      formDataToSubmit.append("productSectionId", formData.productSectionId);
      // formDataToSubmit.append("suggestionId", formData.suggestionId);

      // Append existing images (URLs) if they are in string form
      const images: (File | string)[] = [];
      formData.images.forEach((img) => {
        if (img instanceof File) {
          formDataToSubmit.append(`images`, img);
        }
        images.push(img instanceof File ? `imgUrl` : img);
      });
      formDataToSubmit.append("images", JSON.stringify(images));

      const response = await fetchWithTokenRefresh(
        `${apiUrl}/element/updateElement/${id}`,
        {
          method: "PUT", // Use PUT for updating
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formDataToSubmit,
        }
      );

      if (response.ok) {
        setModalMessage("Element updated successfully!");
        setModalType(true);
        onClose();
        setChange(!change);
      } else {
        alert("Failed to update element. Please try again.");
        setModalType(true);
      }
    } catch (error) {
      console.error("Error updating form:", error);
      setModalMessage("An error occurred. Please try again.");
      setModalType(true);
    }
  };

  // Handle file input change
  const handleImageChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const updatedImages = [...formData.images]; // Copy current images array
      updatedImages[index] = file; // Replace the image at the specific index

      setFormData((prevFormData) => ({
        ...prevFormData,
        images: updatedImages,
      }));
    }
  };

  // Handle adding a new image
  const handleAddImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        images: [...prevFormData.images, file], // Add new image
      }));
    }
  };

  // Handle image removal
  const handleRemoveImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData((prevFormData) => ({
      ...prevFormData,
      images: updatedImages,
    }));
  };

  return (
    <>
      <div className="flex justify-center h-full max-w-3xl mx-auto rounded-md overflow-hidden">
        <div className="bg-white p-4 w-full h-full relative overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between">
              <h2 className="text-xl">Update Element Page</h2>
              <button
                type="button"
                className="text-red-500 font-bold"
                onClick={onClose}
              >
                Close
              </button>
            </div>
            {/* hello chat gpt here is my other code  */}
            <>
              {/* Targeted Page ID */}
              <>
                <div className="flex mb-2">
                  <div className="w-full">
                    <label className="block font-medium mb-2">Title</label>
                    <input
                      type="text"
                      name="sectionTitle"
                      value={formData.sectionTitle}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md outline-0"
                      placeholder="Enter the Section Title"
                    />
                  </div>
                  {/* Show Title Checkbox */}
                  <div className="flex flex-col items-center">
                    <label className="block mb-2" htmlFor="showTitle">
                      Hidden
                    </label>
                    <div>
                      <input
                        id="showTitle"
                        type="checkbox"
                        className="w-10 h-10 border outline-0"
                        checked={formData.isTitle}
                        onChange={() =>
                          setFormData({
                            ...formData,
                            isTitle: !formData.isTitle,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                  {/* Position */}
                  <div>
                    <label>Position</label>
                    <input
                      type="number"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border outline-0"
                      placeholder="Enter the position value"
                    />
                  </div>
                  <div>
                    <label>Post Limit</label>
                    <input
                      type="number"
                      name="postLimit"
                      value={formData.postLimit}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border outline-0"
                      placeholder="Enter the position value"
                    />
                  </div>
                  {/* Desktop Grid */}
                  <div>
                    <label className="block">Desktop Grid</label>
                    <input
                      type="number"
                      name="desktopGrid"
                      value={formData.desktopGrid}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border outline-0"
                      placeholder="Enter the number of grid columns for desktop"
                    />
                  </div>

                  {/* Mobile Grid */}
                  <div>
                    <label className="block">Mobile Grid</label>
                    <input
                      type="number"
                      name="mobileGrid"
                      value={formData.mobileGrid}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border outline-0"
                      placeholder="Enter the number of grid columns for mobile"
                    />
                  </div>
                </div>
                {/* Title Link */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                  <div>
                    <label className="block">Title Link</label>
                    <input
                      type="text"
                      name="titleLink"
                      value={formData.titleLink}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border outline-0"
                      placeholder="Enter the Title Link"
                    />
                  </div>
                  {/* Title Alignment */}
                  <div>
                    <label className="block">Title Alignments</label>
                    <select
                      name="titleAlignment"
                      value={formData.titleAlignment}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border outline-0"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                  {/* Margin */}
                  <div>
                    <label className="block">Margin</label>
                    <input
                      type="number"
                      name="margin"
                      value={formData.margin}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border outline-0"
                      placeholder="Enter the margin value"
                    />
                  </div>

                  {/* Padding */}
                  <div>
                    <label className="block">Padding</label>
                    <input
                      type="number"
                      name="padding"
                      value={formData.padding}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border outline-0"
                      placeholder="Enter the padding value"
                    />
                  </div>

                  {/* Width */}
                  <div>
                    <label className="block">Width</label>
                    <input
                      type="number"
                      name="width"
                      value={formData.width}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border outline-0"
                      placeholder="Enter the width value"
                    />
                  </div>

                  {/* Height */}
                  <div>
                    <label className="block">Height</label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border outline-0"
                      placeholder="Enter the height value"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                  {/* Title Background Color */}
                  <div className="mb-4">
                    <label className="block">Title text color</label>
                    <input
                      type="color"
                      name="titleBackgroundColor"
                      value={formData.titleBackgroundColor}
                      onChange={handleChange}
                      className="w-full border h-8 outline-0"
                    />
                  </div>
                  {/* Section Background Color */}
                  <div>
                    <label className="block">Title BG color</label>
                    <input
                      type="color"
                      name="sectionBackgroundColor"
                      value={formData.sectionBackgroundColor}
                      onChange={handleChange}
                      className="w-full border h-8 outline-0"
                    />
                  </div>
                  {/* Title Background Color */}
                  <div>
                    <label className="block">Box Color</label>
                    <input
                      type="color"
                      name="boxText"
                      value={formData.boxText}
                      onChange={handleChange}
                      className="w-full border h-8 outline-0"
                    />
                  </div>

                  {/* Section Background Color */}
                  <div>
                    <label className="block">Box Bg</label>
                    <input
                      type="color"
                      name="boxBg"
                      value={formData.boxBg}
                      onChange={handleChange}
                      className="w-full border h-8 outline-0"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                  {/* Grid Style */}
                  <div>
                    <label className="block">Grid Style</label>
                    <input
                      type="text"
                      name="gridStyle"
                      value={formData.gridStyle}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border outline-0"
                      placeholder="Enter the grid style"
                    />
                  </div>

                  {/* Product Style */}
                  <div>
                    <label className="block">Product Style</label>
                    <input
                      type="text"
                      name="productStyle"
                      value={formData.productStyle}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border outline-0"
                      placeholder="Enter the product style"
                    />
                  </div>
                  {/* Display Option */}
                  <div>
                    <label className="block">Display</label>
                    <select
                      name="display"
                      value={formData.display}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border outline-0"
                    >
                      <option value="block">Block</option>
                      <option value="none">None</option>
                    </select>
                  </div>
                  {/* Image Position */}
                  <div>
                    <label className="block">Image Position</label>
                    <select
                      name="imagePosition"
                      value={formData.imagePosition}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border outline-0"
                    >
                      <option value="left">Left</option>
                      <option value="center">Center</option>
                      <option value="right">Right</option>
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
                        value={formData.bannerId || ""} // Set the value based on formData
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
                            onChange={() =>
                              handleSelectionChange("subcategory")
                            } // Use a function to handle selection change
                            checked={selectedOption === "subcategory"}
                            className="form-radio h-5 w-5"
                          />
                          <span className="ml-2 text-gray-700">
                            Subcategory
                          </span>
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
                  {formData.selectionType === "suggestionSection" && (
                    <div className="mb-4 ">
                      <label className="block text-gray-700 font-medium mb-2">
                        Select suggestion
                      </label>
                      <select
                        name="suggestionId"
                        value={formData.suggestionId || ""} // Set the value based on formData
                        onChange={handleSuggestionChange} // Use the new handler for banner selection
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="" disabled>
                          Select a suggestion
                        </option>{" "}
                        {/* Placeholder */}
                        {suggestions.map((suggestion) => (
                          <option key={suggestion._id} value={suggestion._id}>
                            {suggestion.title}{" "}
                            {/* Adjust this based on your banner object structure */}
                          </option>
                        ))}
                      </select>
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
                            <option
                              key={subcategory._id}
                              value={subcategory._id}
                            >
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
            </>

            <h2 className="text-xl mb-4">Update Images</h2>

            <>
              <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50">
                {formData.images.map((img, index) => (
                  <div
                    key={index}
                    className="bg-white p-4 shadow-md rounded-md flex flex-col items-center relative"
                  >
                    <div className="w-full flex flex-col items-center relative">
                      <label
                        htmlFor={`photoInput_${index}`}
                        className="cursor-pointer group"
                      >
                        {img ? (
                          <Image
                            src={
                              img instanceof File
                                ? URL.createObjectURL(img)
                                : img
                            }
                            width={600}
                            height={600}
                            alt="Banner"
                            unoptimized
                            className="bg-white rounded-md object-cover w-full max-h-40 shadow-lg group-hover:opacity-80 transition duration-200"
                          />
                        ) : (
                          <div className="w-full h-40 border-dashed border-2 border-gray-300 rounded-md flex flex-col items-center justify-center bg-white p-4 group-hover:border-gray-400">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="40"
                              height="40"
                              viewBox="0 0 24 24"
                              className="text-gray-400 group-hover:text-gray-500 transition duration-200"
                            >
                              <path
                                fill="none"
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 6v12m-6-6h12"
                              />
                            </svg>
                            <p className="text-gray-500 mt-2 group-hover:text-gray-600 transition duration-200">
                              Click to upload
                            </p>
                          </div>
                        )}
                        <input
                          id={`photoInput_${index}`}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleImageChange(index, e)}
                        />
                      </label>
                    </div>

                    {/* Remove Image Button */}
                    <button
                      type="button"
                      className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm hover:bg-red-600 transition duration-200"
                      onClick={() => handleRemoveImage(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Image Button */}
              <div className="w-full p-6 flex justify-center">
                <label
                  htmlFor="addNewImage"
                  className="cursor-pointer bg-white border-dashed border-2 border-gray-300 rounded-lg w-full max-w-lg p-6 flex flex-col items-center justify-center hover:border-gray-400 transition duration-200"
                >
                  <p className="text-gray-500 mt-3 group-hover:text-gray-600 transition duration-200">
                    Click to add a new image
                  </p>
                  <input
                    id="addNewImage"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAddImage}
                  />
                </label>
              </div>
            </>

            <button
              type="submit"
              className="bg-main text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
          </form>
        </div>

        <Modal isOpen={modalType} onClose={closeModal} content={modalMessage} />
      </div>
    </>
  );
};

export default UpdateElement;
