"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { IProduct } from "@/types/product";

import { apiUrl } from "@/app/shared/urls";
import Modal from "@/app/admin/admin/Modal";
import Link from "next/link";
import { ICategory } from "@/types/category";
import { useData } from "@/app/DataContext";

const ProductList: React.FC<{ productsS: IProduct[]; id: string }> = ({
  productsS,
  id,
}) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");
  const [items, setItems] = useState<IProduct[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const { settings } = useData();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch(
          `${apiUrl}/seller/getAllCategoriesForSeller`
        );
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          setCategories(categoriesData.categories);
        } else {
          console.error("Failed to fetch categories");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    const fetchSuggestion = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/suggestion/getSingleSuggestion/${id}`
        );
        if (response.ok) {
          const data = await response.json();
          setItems(data.products);
          setTitle(data.title);
          setSlug(data.slug);
          setDescription(data.description);
          setSubcategory(data.subcategory);
        } else {
          console.error("Failed to fetch suggestion");
        }
      } catch (error) {
        console.error("Error fetching suggestion:", error);
      }
    };

    if (id) {
      fetchCategories();
      fetchSuggestion();
    }
  }, [id]);

  const filteredProducts = productsS.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !items.some((item) => item._id === product._id) // Exclude already added items
  );

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(10);
  }, [searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading &&
        visibleCount < filteredProducts.length
      ) {
        setLoading(true);
        setTimeout(() => {
          setVisibleCount((prevCount) => prevCount + 10);
          setLoading(false);
        }, 1000);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, visibleCount, filteredProducts.length]);

  const handleAddItem = (newItem: IProduct) => {
    if (!items.some((item) => item._id === newItem._id)) {
      setItems((prevItems) => [...prevItems, newItem]);
    }
  };

  const handleRemoveItem = (index: number) => {
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };
  const subcategories = categories.flatMap((category) =>
    category.subCategories.map((subcategory) => ({
      _id: subcategory._id,
      title: subcategory.title,
      parentName: category.title, // Add parent category name
    }))
  );
  const handleUpdateData = async () => {
    const updatedData = {
      title,
      products: items.map((item) => item._id),
      slug,
      description,
      subcategory,
    };

    try {
      const response = await fetch(
        `${apiUrl}/suggestion/updateSuggestion/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );
      const data = await response.json();

      if (data.success) {
        setModalContent(data.message);
        setIsModalOpen(true);
      } else {
        console.error("Failed to update suggestion");
        setModalContent("Failed to update data.");
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error updating suggestion:", error);
      setModalContent("An error occurred while updating data.");
      setIsModalOpen(true);
    }
  };

  return (
    <div className="container my-4">
      <div className="grid gap-3 grid-cols-2 md:grid-cols-5 items-start w-full">
        <div className="w-full">
          <h1>Suggested Title</h1>
          <input
            type="text"
            className="p-2 border outline-0 w-full"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="w-full">
          <p>slug</p>
          <input
            type="text"
            className="p-2 border outline-0 w-full"
            placeholder="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </div>

        <div className="w-full">
          <p>Details</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="outline-0 border w-full"
          />
        </div>
        <div>
          <label className="block" htmlFor="subcategorySelect">
            Select Subcategory
          </label>
          <select
            id="subcategorySelect"
            value={subcategory} // Set the value to an empty string if nothing is selected
            onChange={(e) => setSubcategory(e.target.value)}
            className="w-full px-3 py-2 border rounded outline-0"
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
        <div className="w-full">
          <p>Submit</p>
          <button
            onClick={handleUpdateData}
            className="p-2 w-full bg-main text-white rounded"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="w-full max-h-96 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="border p-2 flex items-center justify-between bg-white relative"
            >
              <Link href={"/"} className="flex items-center space-x-2">
                <Image
                  src={item.img}
                  alt={item.title}
                  width={50}
                  height={50}
                  className="object-cover"
                  loading="lazy"
                />
                <div>
                  <h2 className="text-sm line-clamp-1">{item.title}</h2>
                  <p className="text-sm text-gray-600">
                    {settings?.currencySymbol}{" "}
                    {new Intl.NumberFormat().format(item.sellingPrice)}
                  </p>
                </div>
              </Link>
              <button
                onClick={() => handleRemoveItem(index)}
                className="bg-red-500 text-white p-1 rounded"
              >
                X
              </button>
            </div>
          ))}
        </div>
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          content={modalContent}
        />
      </div>

      <div className="mt-2">
        <h2 className="text-sm mb-2">Add Product List</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded outline-0 w-full mb-2"
          />
          <div className="w-full md:overflow-y-auto">
            {displayedProducts.map((product, index) => (
              <div
                key={index}
                className="flex items-center bg-white justify-between p-2 border mb-2 rounded"
              >
                <div className="flex items-center">
                  <Image
                    src={product.img}
                    alt={product.title}
                    width={50}
                    height={50}
                    className="object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="text-sm line-clamp-1">{product.title}</h3>
                    <p className="text-sm text-gray-600">
                      {settings?.currencySymbol}{" "}
                      {new Intl.NumberFormat().format(product.sellingPrice)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddItem(product)}
                  className="bg-main text-white px-4 py-2 ml-4 rounded"
                >
                  Add
                </button>
              </div>
            ))}
            {loading && (
              <div className="text-center py-2 text-gray-500">Loading...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
