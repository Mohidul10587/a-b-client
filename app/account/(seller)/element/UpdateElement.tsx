"use client";
import React, { useState, useEffect, FC } from "react";
import { apiUrl } from "@/app/shared/urls";
import { IBanner } from "@/types/banner";

import Image from "next/image";
import { ICategory } from "@/types/category";

import Modal from "@/components/admin/Modal";
import { ISuggestion } from "@/types/suggestion";
import { IFormData } from "@/types/element";
import { useData } from "@/app/DataContext";
import { IBrand } from "@/app/admin/publishers/[id]/page";

interface PageProps {
  id: string;
  onClose: () => void;
  setChange: React.Dispatch<React.SetStateAction<boolean>>;
  change: boolean;
}

const UpdateElement: FC<PageProps> = ({ id, onClose, setChange, change }) => {
  const { user } = useData();
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
    selectionType: "",
    bannerId: [],
    suggestionId: [],
    productSectionId: [],
    width: 20,
    height: 20,
    images: [],
    sellerId: "",
    selectedOption: "",
    isSellerElementStatus: false,
    suggestion: "",
  });
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);
  const [banners, setBanners] = useState<IBanner[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [modalMessage, setModalMessage] = useState<string>("");
  const [modalType, setModalType] = useState(false);
  const closeModal = () => {
    setModalType(false);
  };

  const handleSelectionChange = (
    selection: "" | "category" | "subcategory" | "brand"
  ) => {
    setFormData({ ...formData, selectedOption: selection });
    // Reset the productSectionId when changing between category, subcategory, and brand
    setFormData((prevFormData) => ({
      ...prevFormData,
      productSectionId: [], // Clear productSectionId when switching options
    }));
  };

  // Fetch data effect (unchanged)
  useEffect(() => {
    if (formData.selectionType === "banner") {
      setFormData({
        ...formData,
        productSectionId: [],
        suggestionId: [],
      });
      setFormData({ ...formData, selectedOption: "" });
    }
    if (formData.selectionType === "productSection") {
      setFormData({
        ...formData,
        bannerId: [],
        suggestionId: [],
      });
    }
    if (formData.selectionType === "suggestionSection") {
      setFormData({
        ...formData,
        productSectionId: [],
        bannerId: [],
      });
      setFormData({ ...formData, selectedOption: "" });
    }
  }, [formData.selectionType]);
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
          fetch(`${apiUrl}/category/allForAdminInElementPage`),
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
        const suggestionResponse = await fetch(
          `${apiUrl}/suggestion/forSellerForAddProductPage`,
          {
            credentials: "include",
          }
        );
        if (suggestionResponse.ok) {
          const data = await suggestionResponse.json();
          setSuggestions(data);
        } else {
          console.error("Failed to fetch suggestion");
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

    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  // Handle image click to trigger file selection for replacement

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

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

      formDataToSubmit.append("desktopGrid", String(formData.desktopGrid));
      formDataToSubmit.append("mobileGrid", String(formData.mobileGrid));
      formDataToSubmit.append("margin", String(formData.margin));
      formDataToSubmit.append("padding", String(formData.padding));
      formDataToSubmit.append("width", String(formData.width));
      formDataToSubmit.append("height", String(formData.height));
      formDataToSubmit.append("position", String(formData.position));
      formDataToSubmit.append("postLimit", String(formData.postLimit));

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

      formDataToSubmit.append("display", formData.display);
      formDataToSubmit.append(
        "imagePosition",
        formData.imagePosition as string
      );
      formDataToSubmit.append("page", formData.page);

      formDataToSubmit.append("selectionType", formData.selectionType);
      formDataToSubmit.append("selectedOption", formData.selectedOption);
      formDataToSubmit.append(
        "isSellerElementStatus",
        String(formData.isSellerElementStatus)
      );

      formDataToSubmit.append("sellerSlug", user.slug);
      if (formData.selectionType === "banner") {
        formData.bannerId.forEach((field: any, index: number) => {
          formDataToSubmit.append(`fields[${index}][title]`, field.title);
          formDataToSubmit.append(`fields[${index}][id]`, field.id);
          if (field.photo instanceof File || typeof field.photo === "string") {
            formDataToSubmit.append(`fields[${index}][photo]`, field.photo);
          }
        });
      }
      if (formData.selectionType === "productSection") {
        formData.productSectionId.forEach((field: any, index: number) => {
          formDataToSubmit.append(`fields[${index}][title]`, field.title);
          formDataToSubmit.append(`fields[${index}][id]`, field.id);
          if (field.photo instanceof File || typeof field.photo === "string") {
            formDataToSubmit.append(`fields[${index}][photo]`, field.photo);
          }
        });
      }
      if (formData.selectionType === "suggestionSection") {
        formData.suggestionId.forEach((field: any, index: number) => {
          formDataToSubmit.append(`fields[${index}][title]`, field.title);
          formDataToSubmit.append(`fields[${index}][id]`, field.id);
          if (field.photo instanceof File || typeof field.photo === "string") {
            formDataToSubmit.append(`fields[${index}][photo]`, field.photo);
          }
        });
      }

      // Append existing images (URLs) if they are in string form
      formData.images.forEach((img, index) => {
        if (img instanceof File || typeof img === "string") {
          formDataToSubmit.append(`images[${index}]`, img);
        }
      });

      formDataToSubmit.append("allImages", JSON.stringify(formData.images));
      const response = await fetch(`${apiUrl}/seller/updateElement/${id}`, {
        method: "PUT", // Use PUT for updating
        credentials: "include",
        body: formDataToSubmit,
      });

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
  const handleRemoveFieldFromBannerSection = (
    selectionType: string,
    index: number
  ) => {
    if (selectionType === "banner") {
      const updatedBannerId = formData.bannerId.filter(
        (_: any, idx: number) => idx != index
      );
      setFormData({
        ...formData,
        bannerId: updatedBannerId,
      });
    }
    if (selectionType === "productSection") {
      const updatedBannerId = formData.productSectionId.filter(
        (_: any, idx: number) => idx != index
      );
      setFormData({
        ...formData,
        productSectionId: updatedBannerId,
      });
    }
    if (selectionType === "suggestionSection") {
      const updatedBannerId = formData.suggestionId.filter(
        (_: any, idx: number) => idx != index
      );
      setFormData({
        ...formData,
        suggestionId: updatedBannerId,
      });
    }
  };

  // selectionType: "banner" | "productSection" | "suggestionSection";
  const handleAddFieldInBannerSection = (selectionType: string) => {
    const newField = { photo: null, title: "", id: "" };

    if (selectionType === "banner") {
      setFormData({
        ...formData,
        bannerId: [...formData.bannerId, newField],
      });
    }
    if (selectionType === "productSection") {
      setFormData({
        ...formData,
        productSectionId: [...formData.productSectionId, newField],
      });
    }
    if (selectionType === "suggestionSection") {
      setFormData({
        ...formData,
        suggestionId: [...formData.suggestionId, newField],
      });
    }
  };
  return (
    <>
      <div className="flex justify-center h-full max-w-3xl mx-auto rounded-md overflow-hidden">
        <div className="bg-white p-4 w-full h-full relative overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between mb-2">
              <h2 className="text-xl">Update page</h2>
              <button type="button" onClick={onClose}>
                <svg
                  className="text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  width="35"
                  height="35"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"
                  />
                </svg>
              </button>
            </div>
            <>
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
                    <label className="block">Title color</label>
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
                      <option value="both">Both</option>
                      <option value="desktop">Desktop</option>
                      <option value="mobile">Mobile</option>
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

              <div>
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
                          checked={
                            formData.selectionType === "suggestionSection"
                          }
                          onChange={handleChange}
                          className="form-radio h-5 w-5"
                        />
                        <span className="ml-2 text-gray-700">
                          Add A Suggestion Section
                        </span>
                      </label>
                    </div>
                  </div>
                  <div>
                    {formData.selectionType === "banner" && (
                      <div>
                        {formData.bannerId.map((field: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 mb-2"
                          >
                            <label
                              htmlFor={`photoInput-${index}`} // Unique id for each input
                              className="cursor-pointer w-full flex items-center justify-center"
                            >
                              {field.photo ? (
                                <Image
                                  src={
                                    field.photo instanceof File
                                      ? URL.createObjectURL(field.photo)
                                      : field.photo
                                  }
                                  width={60}
                                  height={60}
                                  alt="Selected"
                                  className="bg-white p-2 w-full h-10 object-contain"
                                />
                              ) : (
                                <div className="bg-white h-10 w-full">
                                  <div className="border-2 h-10 border-gray-200 text-gray-500 border-dashed flex flex-col items-center justify-center p-1 w-full">
                                    <p>Click to upload</p>
                                  </div>
                                </div>
                              )}
                              <input
                                id={`photoInput-${index}`} // Unique id for each input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  if (e.target && e.target.files) {
                                    const file = e.target.files[0];
                                    if (file) {
                                      const updatedBannerId =
                                        formData.bannerId.map(
                                          (item: any, idx: number) =>
                                            idx === index
                                              ? { ...item, photo: file }
                                              : item
                                        );

                                      setFormData({
                                        ...formData,
                                        bannerId: updatedBannerId,
                                      });
                                    } else {
                                      const updatedBannerId =
                                        formData.bannerId.map(
                                          (item: any, idx: number) =>
                                            idx === index
                                              ? { ...item, photo: null }
                                              : item
                                        );
                                      setFormData({
                                        ...formData,
                                        bannerId: updatedBannerId,
                                      });
                                    }
                                  }
                                }}
                              />
                            </label>
                            <input
                              type="text"
                              className="border p-2 rounded outline-0 w-full"
                              value={field.title}
                              onChange={(e) => {
                                const updatedBannerId = formData.bannerId.map(
                                  (item: any, idx: number) =>
                                    idx === index
                                      ? { ...item, title: e.target.value }
                                      : item
                                );
                                setFormData({
                                  ...formData,
                                  bannerId: updatedBannerId,
                                });
                              }}
                              placeholder={`Title for Field`}
                            />

                            <select
                              name="bannerId"
                              value={formData.bannerId[index].id} // Set the value based on formData
                              onChange={(e) => {
                                const updatedBannerId = formData.bannerId.map(
                                  (item: any, idx: number) =>
                                    idx === index
                                      ? { ...item, id: e.target.value }
                                      : item
                                );
                                setFormData({
                                  ...formData,
                                  bannerId: updatedBannerId,
                                });
                              }}
                              className="w-full px-3 py-2 border rounded-md outline-0"
                              required
                            >
                              <option value=""> Select a banner</option>
                              {banners.map((banner) => (
                                <option key={banner._id} value={banner._id}>
                                  {banner.title}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                              onClick={() =>
                                handleRemoveFieldFromBannerSection(
                                  "banner",
                                  index
                                )
                              }
                            >
                              X
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          className="bg-purple-500 my-2 text-white px-4 py-2 rounded hover:bg-purple-600"
                          onClick={() =>
                            handleAddFieldInBannerSection("banner")
                          }
                        >
                          Add Field
                        </button>
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
                              checked={formData.selectedOption === "category"}
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
                              checked={
                                formData.selectedOption === "subcategory"
                              }
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
                              checked={formData.selectedOption === "brand"}
                              className="form-radio h-5 w-5"
                            />
                            <span className="ml-2 text-gray-700">Brand</span>
                          </label>
                        </div>
                      </div>
                    )}
                    {formData.selectionType === "suggestionSection" && (
                      <>
                        {" "}
                        <div>
                          {formData.suggestionId.map(
                            (field: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center gap-2 mb-2"
                              >
                                <label
                                  htmlFor={`photoInput-${index}`}
                                  className="cursor-pointer w-full flex items-center justify-center"
                                >
                                  {field.photo ? (
                                    <Image
                                      src={
                                        field.photo instanceof File
                                          ? URL.createObjectURL(field.photo)
                                          : field.photo
                                      }
                                      width={60}
                                      height={60}
                                      alt="Selected"
                                      className="bg-white p-2 w-full h-10 object-contain"
                                    />
                                  ) : (
                                    <div className="bg-white h-10 w-full">
                                      <div className="border-2 h-10 border-gray-200 text-gray-500 border-dashed flex flex-col items-center justify-center p-1 w-full">
                                        <p>Click to upload</p>
                                      </div>
                                    </div>
                                  )}
                                  <input
                                    id={`photoInput-${index}`} // Unique id for each input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                      // hello gpt why the index alaws 0 here

                                      if (e.target && e.target.files) {
                                        const file = e.target.files[0];
                                        if (file) {
                                          const updatedSuggestionId =
                                            formData.suggestionId.map(
                                              (item: any, idx: number) =>
                                                idx === index
                                                  ? { ...item, photo: file }
                                                  : item
                                            );

                                          setFormData({
                                            ...formData,
                                            suggestionId: updatedSuggestionId,
                                          });
                                        } else {
                                          const updatedSuggestionId =
                                            formData.suggestionId.map(
                                              (item: any, idx: number) =>
                                                idx === index
                                                  ? { ...item, photo: null }
                                                  : item
                                            );
                                          setFormData({
                                            ...formData,
                                            suggestionId: updatedSuggestionId,
                                          });
                                        }
                                      }
                                    }}
                                  />
                                </label>
                                <input
                                  type="text"
                                  className="border p-2 rounded outline-0 w-full"
                                  value={field.title}
                                  onChange={(e) => {
                                    const updatedSuggestionId =
                                      formData.suggestionId.map(
                                        (item: any, idx: number) =>
                                          idx === index
                                            ? { ...item, title: e.target.value }
                                            : item
                                      );
                                    setFormData({
                                      ...formData,
                                      suggestionId: updatedSuggestionId,
                                    });
                                  }}
                                  placeholder={`Title for Field`}
                                />

                                <select
                                  name="suggestionId"
                                  value={formData.suggestionId[index].id} // Set the value based on formData
                                  onChange={(e) => {
                                    const updatedBannerId =
                                      formData.suggestionId.map(
                                        (item: any, idx: number) =>
                                          idx === index
                                            ? { ...item, id: e.target.value }
                                            : item
                                      );
                                    setFormData({
                                      ...formData,
                                      suggestionId: updatedBannerId,
                                    });
                                  }}
                                  className="w-full px-3 py-2 border rounded-md outline-0"
                                >
                                  {/* Placeholder */}
                                  <option value=""> Select a suggestion</option>
                                  {suggestions.map((suggestion) => (
                                    <option
                                      key={suggestion._id}
                                      value={suggestion._id}
                                    >
                                      {suggestion.title}{" "}
                                      {/* Adjust this based on your banner object structure */}
                                    </option>
                                  ))}
                                </select>

                                <button
                                  type="button"
                                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                  onClick={() =>
                                    handleRemoveFieldFromBannerSection(
                                      "suggestionSection",
                                      index
                                    )
                                  }
                                >
                                  X
                                </button>
                              </div>
                            )
                          )}
                          <button
                            type="button"
                            className="bg-purple-500 my-2 text-white px-4 py-2 rounded hover:bg-purple-600"
                            onClick={() =>
                              handleAddFieldInBannerSection("suggestionSection")
                            }
                          >
                            Add Field
                          </button>
                        </div>{" "}
                      </>
                    )}
                  </div>
                </>
                <>
                  {formData.selectedOption === "category" && (
                    <div>
                      {formData.productSectionId.map(
                        (field: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 mb-2"
                          >
                            <label
                              htmlFor={`photoInput-${index}`} // Unique id for each input
                              className="cursor-pointer w-full flex items-center justify-center"
                            >
                              {field.photo ? (
                                <Image
                                  src={
                                    field.photo instanceof File
                                      ? URL.createObjectURL(field.photo)
                                      : field.photo
                                  }
                                  width={60}
                                  height={60}
                                  alt="Selected"
                                  className="bg-white p-2 w-full h-10 object-contain"
                                />
                              ) : (
                                <div className="bg-white h-10 w-full">
                                  <div className="border-2 h-10 border-gray-200 text-gray-500 border-dashed flex flex-col items-center justify-center p-1 w-full">
                                    <p>Click to upload</p>
                                  </div>
                                </div>
                              )}
                              <input
                                id={`photoInput-${index}`} // Unique id for each input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  // hello gpt why the index alaws 0 here

                                  if (e.target && e.target.files) {
                                    const file = e.target.files[0];
                                    if (file) {
                                      const updated =
                                        formData.productSectionId.map(
                                          (item: any, idx: number) =>
                                            idx === index
                                              ? { ...item, photo: file }
                                              : item
                                        );

                                      setFormData({
                                        ...formData,
                                        productSectionId: updated,
                                      });
                                    } else {
                                      const updated =
                                        formData.productSectionId.map(
                                          (item: any, idx: number) =>
                                            idx === index
                                              ? { ...item, photo: null }
                                              : item
                                        );
                                      setFormData({
                                        ...formData,
                                        productSectionId: updated,
                                      });
                                    }
                                  }
                                }}
                              />
                            </label>
                            <input
                              type="text"
                              className="border p-2 rounded outline-0 w-full"
                              value={field.title}
                              onChange={(e) => {
                                const updated = formData.productSectionId.map(
                                  (item: any, idx: number) =>
                                    idx === index
                                      ? { ...item, title: e.target.value }
                                      : item
                                );
                                setFormData({
                                  ...formData,
                                  productSectionId: updated,
                                });
                              }}
                              placeholder={`Title for Field`}
                            />

                            <select
                              name="productSectionId"
                              value={formData.productSectionId[index].id} // Set the value based on formData
                              onChange={(e) => {
                                const updated = formData.productSectionId.map(
                                  (item: any, idx: number) =>
                                    idx === index
                                      ? { ...item, id: e.target.value }
                                      : item
                                );
                                setFormData({
                                  ...formData,
                                  productSectionId: updated,
                                });
                              }}
                              className="w-full px-3 py-2 border rounded-md outline-0"
                              required
                            >
                              {" "}
                              <option value=""> Select a category</option>
                              {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                  {category.title}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                              onClick={() =>
                                handleRemoveFieldFromBannerSection(
                                  "productSection",
                                  index
                                )
                              }
                            >
                              X
                            </button>
                          </div>
                        )
                      )}
                      <button
                        type="button"
                        className="bg-purple-500 my-2 text-white px-4 py-2 rounded hover:bg-purple-600"
                        onClick={() =>
                          handleAddFieldInBannerSection("productSection")
                        }
                      >
                        Add Field
                      </button>
                    </div>
                  )}

                  {formData.selectedOption === "subcategory" && (
                    <div>
                      {formData.productSectionId.map(
                        (field: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 mb-2"
                          >
                            <label
                              htmlFor={`photoInput-${index}`} // Unique id for each input
                              className="cursor-pointer w-full flex items-center justify-center"
                            >
                              {field.photo ? (
                                <Image
                                  src={
                                    field.photo instanceof File
                                      ? URL.createObjectURL(field.photo)
                                      : field.photo
                                  }
                                  width={60}
                                  height={60}
                                  alt="Selected"
                                  className="bg-white p-2 w-full h-10 object-contain"
                                />
                              ) : (
                                <div className="bg-white h-10 w-full">
                                  <div className="border-2 h-10 border-gray-200 text-gray-500 border-dashed flex flex-col items-center justify-center p-1 w-full">
                                    <p>Click to upload</p>
                                  </div>
                                </div>
                              )}
                              <input
                                id={`photoInput-${index}`} // Unique id for each input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  // hello gpt why the index alaws 0 here

                                  if (e.target && e.target.files) {
                                    const file = e.target.files[0];
                                    if (file) {
                                      const updated =
                                        formData.productSectionId.map(
                                          (item: any, idx: number) =>
                                            idx === index
                                              ? { ...item, photo: file }
                                              : item
                                        );

                                      setFormData({
                                        ...formData,
                                        productSectionId: updated,
                                      });
                                    } else {
                                      const updated =
                                        formData.productSectionId.map(
                                          (item: any, idx: number) =>
                                            idx === index
                                              ? { ...item, photo: null }
                                              : item
                                        );
                                      setFormData({
                                        ...formData,
                                        productSectionId: updated,
                                      });
                                    }
                                  }
                                }}
                              />
                            </label>
                            <input
                              type="text"
                              className="border p-2 rounded outline-0 w-full"
                              value={field.title}
                              onChange={(e) => {
                                const updated = formData.productSectionId.map(
                                  (item: any, idx: number) =>
                                    idx === index
                                      ? { ...item, title: e.target.value }
                                      : item
                                );
                                setFormData({
                                  ...formData,
                                  productSectionId: updated,
                                });
                              }}
                              placeholder={`Title for Field`}
                            />

                            <select
                              name="productSectionId"
                              value={formData.productSectionId[index].id} // Set the value based on formData
                              onChange={(e) => {
                                const updated = formData.productSectionId.map(
                                  (item: any, idx: number) =>
                                    idx === index
                                      ? { ...item, id: e.target.value }
                                      : item
                                );
                                setFormData({
                                  ...formData,
                                  productSectionId: updated,
                                });
                              }}
                              className="w-full px-3 py-2 border rounded-md outline-0"
                              required
                            >
                              {" "}
                              <option value=""> Select a subcategory</option>
                              {subcategories.map((subcategory) => (
                                <option
                                  key={subcategory._id}
                                  value={subcategory._id}
                                >
                                  {subcategory.title}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                              onClick={() =>
                                handleRemoveFieldFromBannerSection(
                                  "productSection",
                                  index
                                )
                              }
                            >
                              X
                            </button>
                          </div>
                        )
                      )}
                      <button
                        type="button"
                        className="bg-purple-500 my-2 text-white px-4 py-2 rounded hover:bg-purple-600"
                        onClick={() =>
                          handleAddFieldInBannerSection("productSection")
                        }
                      >
                        Add Field
                      </button>
                    </div>
                  )}

                  {formData.selectedOption === "brand" && (
                    <div>
                      {formData.productSectionId.map(
                        (field: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 mb-2"
                          >
                            <label
                              htmlFor={`photoInput-${index}`} // Unique id for each input
                              className="cursor-pointer w-full flex items-center justify-center"
                            >
                              {field.photo ? (
                                <Image
                                  src={
                                    field.photo instanceof File
                                      ? URL.createObjectURL(field.photo)
                                      : field.photo
                                  }
                                  width={60}
                                  height={60}
                                  alt="Selected"
                                  className="bg-white p-2 w-full h-10 object-contain"
                                />
                              ) : (
                                <div className="bg-white h-10 w-full">
                                  <div className="border-2 h-10 border-gray-200 text-gray-500 border-dashed flex flex-col items-center justify-center p-1 w-full">
                                    <p>Click to upload</p>
                                  </div>
                                </div>
                              )}
                              <input
                                id={`photoInput-${index}`} // Unique id for each input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => {
                                  // hello gpt why the index alaws 0 here

                                  if (e.target && e.target.files) {
                                    const file = e.target.files[0];
                                    if (file) {
                                      const updated =
                                        formData.productSectionId.map(
                                          (item: any, idx: number) =>
                                            idx === index
                                              ? { ...item, photo: file }
                                              : item
                                        );

                                      setFormData({
                                        ...formData,
                                        productSectionId: updated,
                                      });
                                    } else {
                                      const updated =
                                        formData.productSectionId.map(
                                          (item: any, idx: number) =>
                                            idx === index
                                              ? { ...item, photo: null }
                                              : item
                                        );
                                      setFormData({
                                        ...formData,
                                        productSectionId: updated,
                                      });
                                    }
                                  }
                                }}
                              />
                            </label>
                            <input
                              type="text"
                              className="border p-2 rounded outline-0 w-full"
                              value={field.title}
                              onChange={(e) => {
                                const updated = formData.productSectionId.map(
                                  (item: any, idx: number) =>
                                    idx === index
                                      ? { ...item, title: e.target.value }
                                      : item
                                );
                                setFormData({
                                  ...formData,
                                  productSectionId: updated,
                                });
                              }}
                              placeholder={`Title for Field`}
                            />

                            <select
                              name="productSectionId"
                              value={formData.productSectionId[index].id} // Set the value based on formData
                              onChange={(e) => {
                                const updated = formData.productSectionId.map(
                                  (item: any, idx: number) =>
                                    idx === index
                                      ? { ...item, id: e.target.value }
                                      : item
                                );
                                setFormData({
                                  ...formData,
                                  productSectionId: updated,
                                });
                              }}
                              className="w-full px-3 py-2 border rounded-md outline-0"
                              required
                            >
                              <option value=""> Select a brand</option>
                              {brands.map((brand) => (
                                <option key={brand._id} value={brand._id}>
                                  {brand.title}
                                </option>
                              ))}
                            </select>

                            <button
                              type="button"
                              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                              onClick={() =>
                                handleRemoveFieldFromBannerSection(
                                  "productSection",
                                  index
                                )
                              }
                            >
                              X
                            </button>
                          </div>
                        )
                      )}
                      <button
                        type="button"
                        className="bg-purple-500 my-2 text-white px-4 py-2 rounded hover:bg-purple-600"
                        onClick={() =>
                          handleAddFieldInBannerSection("productSection")
                        }
                      >
                        Add Field
                      </button>
                    </div>
                  )}
                </>
              </div>
            </>

            <h2 className="text-xl my-2 text-center">Update Images</h2>
            <>
              {/* Add New Image Button */}
              <div className="w-full flex justify-center">
                <label
                  htmlFor="addNewImage"
                  className="cursor-pointer bg-gray-200 border-dashed border-2 rounded-lg w-full max-w-lg p-6 flex flex-col items-center justify-center hover:border-gray-400 transition duration-200"
                >
                  <p className="text-gray-500 group-hover:text-gray-600 transition duration-200">
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

              <div className="w-full grid grid-cols-3 md:grid-cols-5 gap-6 bg-gray-50 my-4">
                {formData.images.map((img, index) => (
                  <div
                    key={index}
                    className="bg-white shadow-md rounded-md flex flex-col items-center relative"
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
                            loading="lazy"
                            className="bg-white rounded-md object-cover w-full max-h-40 shadow-lg group-hover:opacity-80 transition duration-200"
                          />
                        ) : (
                          <div className="w-full h-40 border-dashed border-2 rounded-md flex flex-col items-center justify-center bg-white p-4 group-hover:border-gray-400">
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
                      className="absolute top-0 right-0 bg-red-500 text-white px-2 py-1 text-sm hover:bg-red-600 transition duration-200"
                      onClick={() => handleRemoveImage(index)}
                    >
                      X
                    </button>
                  </div>
                ))}
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
