"use client";
import React, { useState, useEffect } from "react";
import { apiUrl } from "@/app/shared/urls";
import { IBanner } from "@/types/banner";
import Image from "next/image";
import { ICategory } from "@/types/category";
import { ISuggestion } from "@/types/suggestion";
import { useData } from "@/app/DataContext";
import { IFormData } from "@/types/element";
import { IBrand } from "@/app/admin/publishers/[id]/page";

interface PageProps {
  onClose: () => void;
  page: string;
  id: string;
  loadData: boolean;
  setLoadData: React.Dispatch<React.SetStateAction<boolean>>;
}
type Field = {
  id: number;
  photo: File | null;
  title: string;
};

const PageBuilder: React.FC<PageProps> = ({
  onClose,
  page,
  id,
  loadData,
  setLoadData,
}) => {
  const { user } = useData();
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
    bannerId: [],
    suggestionId: [],
    productSectionId: [],
    images: [],
    width: 20,
    height: 20,
    sellerId: "",
    selectedOption: "",
    isSellerElementStatus: false,
    suggestion: "",
  });

  const [banners, setBanners] = useState<IBanner[]>([]);
  const [selectedImages, setSelectedImages] = useState<string[]>([]); // State for selected images
  const [modalMessage, setModalMessage] = useState<string | null>(null);
  const [modalType, setModalType] = useState<
    "success" | "error" | "pending" | null
  >(null);

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [brands, setBrands] = useState<IBrand[]>([]);
  const [selectedOption, setSelectedOption] = useState(""); // Tracks whether category or brand is selected

  // Fetch banners, categories, and brands when the component mounts
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);

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
        const categoriesResponse = await fetch(
          `${apiUrl}/category/allForAdminForPageBuilder`
        );
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData.categories);
        } else {
          console.error("Failed to fetch categories");
        }

        // Fetch brands
        const brandsResponse = await fetch(`${apiUrl}/brand/all`);
        if (brandsResponse.ok) {
          const brandsData = await brandsResponse.json();
          setBrands(brandsData.brands);
        } else {
          console.error("Failed to fetch all brands");
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
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (formData.selectionType === "banner") {
      setFormData({
        ...formData,
        productSectionId: [],
        suggestionId: [],
      });
      setSelectedOption("");
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
      setSelectedOption("");
    }
  }, [formData.selectionType]);
  const handleSubmit = async (event: React.FormEvent) => {
    setModalMessage("Element creating...!");
    setModalType("pending");
    event.preventDefault();
    if (formData.selectionType === "banner" && formData.bannerId.length === 0) {
      setModalMessage("Select a banner please");
      setModalType("error");
      return; // Exit the function early
    }
    if (
      formData.selectionType === "productSection" &&
      formData.productSectionId.length === 0
    ) {
      setModalMessage("Select a category or subcategory or a brand please");
      setModalType("error");
      return; // Exit the function early
    }
    if (
      formData.selectionType === "suggestionSection" &&
      formData.suggestionId.length === 0
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
      formDataToSubmit.append("imagePosition", formData.imagePosition);
      formDataToSubmit.append("page", formData.page);
      formDataToSubmit.append("selectionType", formData.selectionType);
      formDataToSubmit.append("selectedOption", selectedOption);
      formDataToSubmit.append(
        "isSellerElementStatus",
        String(formData.isSellerElementStatus)
      );

      // Append images
      formData.images.forEach((image, index) => {
        formDataToSubmit.append("images", image);
      });
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
      formDataToSubmit.append("sellerSlug", user.slug);
      const response = await fetch(`${apiUrl}/seller/create-page-element`, {
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

  function capitalizeFirstLetter(word: string) {
    if (!word) return ""; // return an empty string if no word is provided
    return word.charAt(0).toUpperCase() + word.slice(1);
  }

  const closeModal = () => {
    setModalMessage(null);
    setModalType(null);
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

  const handleSelectionChange = (selection: string) => {
    setSelectedOption(selection);
    // Reset the productSectionId when changing between category, subcategory, and brand
    setFormData((prevFormData) => ({
      ...prevFormData,
      productSectionId: [], // Clear productSectionId when switching options
    }));
  };

  return (
    <>
      <div className="flex justify-center h-full max-w-3xl mx-auto rounded-md overflow-hidden">
        <div className="bg-white p-4 w-full h-full relative overflow-y-auto">
          <form onSubmit={handleSubmit}>
            <div className="flex justify-between mb-2">
              <h2 className="text-xl">
                Create for{" "}
                <span className="text-main font-bold">
                  {capitalizeFirstLetter(page)}
                </span>{" "}
                page
              </h2>
              <button onClick={onClose}>
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
              <div className="flex mb-2">
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
                    <label className="block mb-2">Hidden</label>
                    <input
                      type="checkbox"
                      name="showTitle"
                      className="w-10 h-10"
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
                    Gap
                  </label>
                  <input
                    type="number"
                    name="margin"
                    value={formData.margin || ""}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md outline-0"
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
                    className="w-full px-3 py-2 border rounded-md outline-0"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Width
                  </label>
                  <input
                    type="number"
                    name="width"
                    value={formData.width || "200"}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md outline-0"
                  />
                </div>
                <div>
                  <label className="block text-gray-700 font-medium mt-2">
                    Height
                  </label>
                  <input
                    type="number"
                    name="height"
                    value={formData.height || "200"}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md outline-0"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
                {/* Background Colors */}
                <div>
                  <label className="block">Title color</label>
                  <input
                    type="color"
                    name="titleBackgroundColor"
                    value={formData.titleBackgroundColor || "#ffffff"}
                    onChange={handleChange}
                    className="w-full h-8 border"
                  />
                </div>
                <div>
                  <label className="block">Title BG color</label>
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
                  <input
                    type="number"
                    name="gridStyle"
                    value={formData.gridStyle || "1"}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md outline-0"
                  />
                </div>
                <div>
                  <label className="block">Product Style</label>
                  <input
                    type="number"
                    name="productStyle"
                    value={formData.productStyle || "1"}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md outline-0"
                  />
                </div>
                {/* Display Option */}
                <div>
                  <label className="block">Display On</label>
                  <select
                    name="display"
                    value={formData.display || "both"}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border outline-0"
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
                      {" "}
                      Add A Suggestion Section
                    </span>
                  </label>
                </div>
              </div>
              <div>
                {formData.selectionType === "banner" && (
                  <div>
                    {formData.bannerId.map((field: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <label
                          htmlFor={`photoInput-${index}`} // Unique id for each input
                          className="cursor-pointer w-full flex items-center justify-center"
                        >
                          {field.photo ? (
                            <Image
                              src={
                                field.photo instanceof File
                                  ? URL.createObjectURL(field.photo)
                                  : "/default.jpg"
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
                                  const updatedBannerId = formData.bannerId.map(
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
                                  const updatedBannerId = formData.bannerId.map(
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
                          required
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
                          <option value={""} disabled>
                            Select a banner
                          </option>
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
                            handleRemoveFieldFromBannerSection("banner", index)
                          }
                        >
                          X
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="bg-purple-500 my-2 text-white px-4 py-2 rounded hover:bg-purple-600"
                      onClick={() => handleAddFieldInBannerSection("banner")}
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
                                      : "/default.jpg"
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
                              required
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
                              <option value={""} disabled>
                                Select a Suggestion
                              </option>
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
              {selectedOption === "category" && (
                <div>
                  {formData.productSectionId.map(
                    (field: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <label
                          htmlFor={`photoInput-${index}`} // Unique id for each input
                          className="cursor-pointer w-full flex items-center justify-center"
                        >
                          {field.photo ? (
                            <Image
                              src={
                                field.photo instanceof File
                                  ? URL.createObjectURL(field.photo)
                                  : "/default.jpg"
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
                                  const updated = formData.productSectionId.map(
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
                                  const updated = formData.productSectionId.map(
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
                          required
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
                          <option value={""} disabled>
                            Select a category
                          </option>
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

              {selectedOption === "subcategory" && (
                <div>
                  {formData.productSectionId.map(
                    (field: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <label
                          htmlFor={`photoInput-${index}`} // Unique id for each input
                          className="cursor-pointer w-full flex items-center justify-center"
                        >
                          {field.photo ? (
                            <Image
                              src={
                                field.photo instanceof File
                                  ? URL.createObjectURL(field.photo)
                                  : "/default.jpg"
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
                                  const updated = formData.productSectionId.map(
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
                                  const updated = formData.productSectionId.map(
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
                          required
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
                          <option value={""} disabled>
                            Select a sub category
                          </option>
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

              {selectedOption === "brand" && (
                <div>
                  {formData.productSectionId.map(
                    (field: any, index: number) => (
                      <div key={index} className="flex items-center gap-2 mb-2">
                        <label
                          htmlFor={`photoInput-${index}`} // Unique id for each input
                          className="cursor-pointer w-full flex items-center justify-center"
                        >
                          {field.photo ? (
                            <Image
                              src={
                                field.photo instanceof File
                                  ? URL.createObjectURL(field.photo)
                                  : "/default.jpg"
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
                                  const updated = formData.productSectionId.map(
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
                                  const updated = formData.productSectionId.map(
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
                          required
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
                          <option value={""} disabled>
                            Select a Brand
                          </option>
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
                          loading="lazy"
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
          className="px-4 py-2 bg-main text-white rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};
