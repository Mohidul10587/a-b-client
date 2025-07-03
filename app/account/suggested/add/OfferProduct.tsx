"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IProduct } from "@/types/product";
import Modal from "../../account-comp/Modal";
import { apiUrl } from "@/app/shared/urls";
import { ICategory } from "@/types/category";

type OfferProductProps = {
  items: IProduct[];
  onRemove: (index: number) => void;
};

const OfferProduct: React.FC<OfferProductProps> = ({ items, onRemove }) => {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [subcategory, setSubcategory] = useState("");
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const [isContentValid, setIsContentValid] = useState(false);
  const products = items.map((item) => item._id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await fetch(
          `${apiUrl}/seller/getAllCategoriesForSeller`,
          {
            credentials: "include",
          }
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

    fetchData();
  }, []);

  const subcategories = categories.flatMap((category) =>
    category.subCategories.map((subcategory) => ({
      _id: subcategory._id,
      title: subcategory.title,
      parentName: category.title, // Add parent category name
    }))
  );

  const handleSubmit = async () => {
    // Validation: Ensure there's at least one product and a title
    if (!title.trim()) {
      setModalContent("Please provide a title ");
      setIsModalOpen(true);
      return;
    }

    if (products.length === 0) {
      setModalContent("Please  add at least one product.");
      setIsModalOpen(true);
      return;
    }

    const data = { title, products, slug, subcategory, description };

    try {
      setModalContent("Processing...");
      setIsModalOpen(true);

      const response = await fetch(`${apiUrl}/seller/createSuggestion`, {
        credentials: "include",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setModalContent("Data submitted successfully!");
      } else {
        setModalContent("Failed to submit data.");
      }
    } catch (error) {
      setModalContent("An error occurred while submitting data.");
    } finally {
      setIsModalOpen(true); // Show the modal with the response message
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
    <div>
      <div className="mb-4 grid gap-3 grid-cols-2 md:grid-cols-5 items-start">
        <div>
          <p>Suggested Titlesds</p>
          <input
            type="text"
            className="p-2 border outline-0 w-full"
            placeholder="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <p>Title slug</p>
          <input
            type="text"
            className="p-2 border outline-0 w-full"
            placeholder="slug"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
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
            className="w-full px-3 py-2 border rounded-md outline-0"
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
        <div>
          <p>Details</p>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border outline-0"
          />
        </div>
        <div>
          <p>Submit</p>
          <button
            onClick={handleSubmit}
            className="p-2 bg-main text-white rounded w-full"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="w-full max-h-96 overflow-y-auto">
        <div className="grid grid-cols-6 gap-4">
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
                  <p className="text-sm text-gray-600">{item.sellingPrice}</p>
                </div>
              </Link>
              <button
                onClick={() => onRemove(index)}
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
    </div>
  );
};

export default OfferProduct;
