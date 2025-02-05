"use client";

import { FC, useState } from "react";
import Image from "next/image";
import ReadMore from "@/components/ReadMore";
import ProductDiv from "@/components/ProductBox";
import { languages } from "@/app/shared/language";

const ClientComponent: FC<{
  products: any[];
  category: any;
  publishers: any[];
  writers: any[];
}> = ({ products, category, publishers, writers }) => {
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    []
  );
  const [selectedWriters, setSelectedWriters] = useState<string[]>([]);

  // Handle publisher selection
  const handlePublisherChange = (publisherId: string) => {
    setSelectedPublishers(
      (prev) =>
        prev.includes(publisherId)
          ? prev.filter((id) => id !== publisherId) // Remove if already selected
          : [...prev, publisherId] // Add if not selected
    );
  };

  // Handle subcategory selection
  const handleSubcategoryChange = (subcategoryId: string) => {
    setSelectedSubcategories(
      (prev) =>
        prev.includes(subcategoryId)
          ? prev.filter((id) => id !== subcategoryId) // Remove if already selected
          : [...prev, subcategoryId] // Add if not selected
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

  // Handle publisher selection
  const handleWriterChange = (writerId: string) => {
    setSelectedWriters(
      (prev) =>
        prev.includes(writerId)
          ? prev.filter((id) => id !== writerId) // Remove if already selected
          : [...prev, writerId] // Add if not selected
    );
  };

  // Filter products by selected categories and publishers
  const filteredProducts = products.filter(
    (product) =>
      (selectedPublishers.length === 0 ||
        selectedPublishers.includes(product.publisher)) &&
      (selectedLanguages.length === 0 ||
        selectedLanguages.includes(product.language)) &&
      (selectedSubcategories.length === 0 ||
        selectedSubcategories.includes(product.subcategory)) &&
      (selectedWriters.length === 0 || selectedWriters.includes(product.writer))
  );

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-5">
        {/* Sidebar with filters */}
        <div className="col-span-1 bg-white border-r-2 mr-1 p-4 space-y-10">
          {/* Filter by category */}
          <div>
            <p className="font-semibold mb-2">Filter by subcategory</p>
            <div className="space-y-2 max-h-[178px] overflow-y-auto">
              {category.subcategories.map((item: any) => (
                <div key={item._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={item._id}
                    value={item._id}
                    onChange={() => handleSubcategoryChange(item._id)}
                    checked={selectedSubcategories.includes(item._id)}
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

          {/* Filter by Writer */}
          <div>
            <p className="font-semibold mb-2">Filter by Writer</p>
            <div className="space-y-2 max-h-[178px] overflow-y-auto">
              {writers.map((item: any) => (
                <div key={item._id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={item._id}
                    value={item._id}
                    onChange={() => handleWriterChange(item._id)}
                    checked={selectedWriters.includes(item._id)}
                    className="mr-2"
                  />
                  <label htmlFor={item._id} className="cursor-pointer">
                    {item.title}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Filter by Language */}
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
        <div className="col-span-4">
          <div className="flex justify-between mb-2">
            <div className="w-2/12">
              <div className="flex justify-center h-44 items-center">
                <Image
                  src={category?.img || "/default.jpg"}
                  alt="Author Image"
                  width={100}
                  height={94}
                  className="rounded-full "
                />
              </div>
            </div>
            <div className="w-10/12">
              <span className="font-semibold text-2xl">{category.title}</span>

              <ReadMore height="h-24">
                {category && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: category.description,
                    }}
                  ></div>
                )}
              </ReadMore>
            </div>
          </div>

          <ProductDiv products={filteredProducts} />
        </div>
      </div>
    </div>
  );
};

export default ClientComponent;
