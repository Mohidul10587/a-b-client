"use client";

import { FC, useState } from "react";
import Image from "next/image";
import ReadMore from "@/components/ReadMore";
import ProductDiv from "@/components/ProductBox";
import { languages } from "@/app/shared/language";

const ClientComponent: FC<{
  writer: any;
  products: any[];
  categories: any[];
  publishers: any[];
}> = ({ writer, products, categories, publishers }) => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  // Handle category selection
  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategories(
      (prev) =>
        prev.includes(categoryId)
          ? prev.filter((id) => id !== categoryId) // Remove if already selected
          : [...prev, categoryId] // Add if not selected
    );
  };

  // Handle publisher selection
  const handlePublisherChange = (publisherId: string) => {
    setSelectedPublishers(
      (prev) =>
        prev.includes(publisherId)
          ? prev.filter((id) => id !== publisherId) // Remove if already selected
          : [...prev, publisherId] // Add if not selected
    );
  };
  // Handle publisher selection
  const handleLanguageChange = (language: string) => {
    setSelectedLanguages(
      (prev) =>
        prev.includes(language)
          ? prev.filter((id) => id !== language) // Remove if already selected
          : [...prev, language] // Add if not selected
    );
  };

  // Filter products by selected categories and publishers
  const filteredProducts = products.filter(
    (product) =>
      (selectedCategories.length === 0 ||
        selectedCategories.includes(product.category)) &&
      (selectedPublishers.length === 0 ||
        selectedPublishers.includes(product.publisher)) &&
      (selectedLanguages.length === 0 ||
        selectedLanguages.includes(product.language))
  );

  return (
    <div className="grid grid-cols-5">
      {/* Sidebar with filters */}
      <div className="col-span-1 bg-white border-r-2 mr-1 p-4 space-y-10">
        {/* Filter by category */}
        <div>
          <p className="font-semibold mb-2">Filter by category</p>
          <div className="space-y-2 max-h-[178px] overflow-y-auto">
            {categories.map((item: any) => (
              <div key={item._id} className="flex items-center">
                <input
                  type="checkbox"
                  id={item._id}
                  value={item._id}
                  onChange={() => handleCategoryChange(item._id)}
                  checked={selectedCategories.includes(item._id)}
                  className="mr-2"
                />
                <label htmlFor={item._id} className="cursor-pointer">
                  {item.title}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Filter by publisher */}
        <div>
          <p className="font-semibold mb-2">Filter by publisher</p>
          <div className="space-y-2 max-h-[178px] overflow-y-auto">
            {publishers.map((item: any) => (
              <div key={item._id} className="flex items-center">
                <input
                  type="checkbox"
                  id={item._id}
                  value={item._id}
                  onChange={() => handlePublisherChange(item._id)}
                  checked={selectedPublishers.includes(item._id)}
                  className="mr-2"
                />
                <label htmlFor={item._id} className="cursor-pointer">
                  {item.title}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Filter by category */}
        <div>
          <p className="font-semibold mb-2">Filter by Language</p>
          <div className="space-y-2 max-h-[178px] overflow-y-auto">
            {languages.map((item: any) => (
              <div key={item.code} className="flex items-center">
                <input
                  type="checkbox"
                  id={item.code}
                  value={item.code}
                  onChange={() => handleLanguageChange(item.code)}
                  checked={selectedLanguages.includes(item.code)}
                  className="mr-2"
                />
                <label htmlFor={item.code} className="cursor-pointer">
                  {item.name} ({item.nativeName})
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content area */}
      <div className="col-span-4">
        {/* Writer section */}
        <div className="flex justify-between mb-2">
          <div className="w-2/12">
            <div className="flex justify-center h-44 items-center">
              <Image
                src={writer.img}
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
