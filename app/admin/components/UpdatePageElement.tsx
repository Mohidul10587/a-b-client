"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { fetchWithTokenRefresh } from "@/app/shared/fetchWithTokenRefresh";
import { apiUrl } from "@/app/shared/urls";
import { IBanner } from "@/types/banner";
import { ICategory, ISubcategory } from "@/types/category";
interface PageProps {
  data: any;
}

const UpdatePageElement: React.FC<PageProps> = ({ data }) => {
  const [formData, setFormData] = useState({
    sectionTitle: "",
    page: "", // Page select feature
    position: 0,
    selectionType: "banner", // Default selection type
    isBanner: false,
    isCategory: false,
    isSubCategory: false, // Track the selected type
    banner: "",
    category: "",
    subCategory: "", // New subcategory field
    status: "On",
  });

  const [banners, setBanners] = useState<IBanner[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);

  // Flatmap to get subcategories from all categories
  const allSubCategories = categories?.flatMap((category) =>
    category.subCategories.map((subCat) => ({
      _id: subCat._id,
      title: subCat.title,
      parenttitle: category.title,
    }))
  );

  // Fetch existing page element details and prepopulate the form
  useEffect(() => {
    const fetchData = async () => {
      try {
        const bannersResponse = await fetch(`${apiUrl}/banner/all`);
        const categoriesResponse = await fetch(`${apiUrl}/category/all`);

        if (bannersResponse.ok && categoriesResponse.ok) {
          const bannersData = await bannersResponse.json();
          const categoriesData = await categoriesResponse.json();
          const elementData = data;

          setBanners(bannersData);
          setCategories(categoriesData.categories);

          // Prepopulate the form with existing page element data
          setFormData({
            sectionTitle: elementData.sectionTitle,
            page: elementData.page,
            position: elementData.position,
            selectionType: elementData.selectionType,
            isBanner: elementData.selectionType === "banner",
            isCategory: elementData.selectionType === "category",
            isSubCategory: elementData.selectionType === "subCategory",
            banner: elementData.banner || "",
            category: elementData.category || "",
            subCategory: elementData.subCategory || "",
            status: elementData.status || "On",
          });
        } else {
          console.error("Failed to fetch banners, categories, or page element");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [data]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // Handle radio button selection to set the selection type
    if (type === "radio") {
      setFormData((prevData) => ({
        ...prevData,
        selectionType: value,
        isBanner: value === "banner",
        isCategory: value === "category",
        isSubCategory: value === "subCategory",
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  // Handle form submission for updating page element
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetchWithTokenRefresh(
        `${apiUrl}/element/update-page-element/${data._id}`, // Update endpoint
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
      } else {
        console.error("Failed to update data");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-md mt-4"
    >
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">
          Section Title
        </label>
        <input
          type="text"
          name="sectionTitle"
          value={formData.sectionTitle}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Page Select */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Page</label>
        <select
          name="page"
          value={formData.page}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        >
          <option value="">Select a Page</option>
          {["home", "category", "writer"].map((page) => (
            <option key={page} value={page}>
              {page.charAt(0).toUpperCase() + page.slice(1)}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Position</label>
        <input
          type="number"
          name="position"
          value={formData.position}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          required
        />
      </div>

      {/* Radio buttons for selecting Banner, Category, or Subcategory */}
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
            <span className="ml-2 text-gray-700">Banner</span>
          </label>

          <label className="inline-flex items-center">
            <input
              type="radio"
              name="selectionType"
              value="category"
              checked={formData.selectionType === "category"}
              onChange={handleChange}
              className="form-radio h-5 w-5"
            />
            <span className="ml-2 text-gray-700">Category</span>
          </label>

          <label className="inline-flex items-center">
            <input
              type="radio"
              name="selectionType"
              value="subCategory"
              checked={formData.selectionType === "subCategory"}
              onChange={handleChange}
              className="form-radio h-5 w-5"
            />
            <span className="ml-2 text-gray-700">SubCategory</span>
          </label>
        </div>
      </div>

      {/* Conditionally render the Banner select if "banner" is selected */}
      {formData.selectionType === "banner" && (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Banner</label>
          <select
            name="banner"
            value={formData.banner}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a Banner</option>
            {banners?.map((banner) => (
              <option key={banner._id} value={banner._id}>
                {banner.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Conditionally render the Category select if "category" is selected */}
      {formData.selectionType === "category" && (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Category
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a Category</option>
            {categories?.map((category) => (
              <option key={category._id} value={category._id}>
                {category.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Conditionally render the SubCategory select if "subCategory" is selected */}
      {formData.selectionType === "subCategory" && (
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            SubCategory
          </label>
          <select
            name="subCategory"
            value={formData.subCategory}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a SubCategory</option>
            {allSubCategories?.map((subCategory) => (
              <option key={subCategory._id} value={subCategory._id}>
                {subCategory.title} ({subCategory.parenttitle})
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="On">On</option>
          <option value="Off">Off</option>
        </select>
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white py-2 px-4 rounded-md"
      >
        Update
      </button>
    </form>
  );
};

export default UpdatePageElement;
