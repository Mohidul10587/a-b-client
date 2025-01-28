"use client";

import { FC, useState } from "react";
import Image from "next/image";
import ReadMore from "@/components/ReadMore";
import ProductDiv from "@/components/ProductBox";

const ClientComponent: FC<{
  writer: any;
  products: any[];
  categories: any[];
}> = ({ writer, products, categories }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(
      (prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId) // Remove if already selected
          : [...prev, categoryId] // Add if not selected
    );
  };

  // Filter products by selected categories
  const filteredProducts = selectedCategories.length
    ? products.filter((product) =>
        selectedCategories.includes(product.category)
      )
    : products; // Show all products if no category selected

  return (
    <div className="grid grid-cols-5">
      {/* Sidebar with category filter */}
      <div className="col-span-1 bg-white border-r-2  mr-1 p-4">
        <p className=" font-semibold mb-2">Filter by category</p>
        <div className="space-y-2">
          {categories.map((category: any) => (
            <div key={category._id} className="flex items-center">
              <input
                type="checkbox"
                id={category._id}
                value={category._id}
                onChange={() => handleCategoryChange(category._id)}
                checked={selectedCategories.includes(category._id)}
                className="mr-2"
              />
              <label htmlFor={category._id} className=" cursor-pointer">
                {category.title}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="col-span-4">
        {/* Writer section */}
        <div className="flex justify-between mb-2">
          <div className="w-2/12">
            <div className="flex justify-center h-44 items-center">
              <Image
                src={writer.photo}
                alt="Author Image"
                width={100}
                height={94}
                className="rounded-full"
              />
            </div>
          </div>
          <div className="w-10/12">
            <span className="font-semibold text-2xl">{writer.title}</span>
            <ReadMore height="h-24">
              {writer && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: writer.description,
                  }}
                ></div>
              )}
            </ReadMore>
          </div>
        </div>

        {/* Products section */}
        <ProductDiv products={filteredProducts} />
      </div>
    </div>
  );
};

export default ClientComponent;
