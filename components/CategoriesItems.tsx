"use client";
import React from "react";
import Link from "next/link";
import { ICategory } from "@/types/category";

// Define the types based on your structure

interface CategoriesProps {
  items: ICategory[];
}

const Categories: React.FC<CategoriesProps> = ({ items }) => {
  return (
    <div className="relative group">
      <Link
        className="hidden cursor-pointer md:block md:px-4 py-2 rounded-md  hover:text-orange-600 md:hover:bg-white md:group-hover:bg-white  md:hover:text-main transition-colors duration-200"
        href="/cat"
      >
        Categories
      </Link>
      <div className="group-hover:block right-0 hidden absolute top-10 w-48 bg-white rounded-md max-h-96 overflow-y-auto">
        {items.map((category) => (
          <div key={category._id} className="p-3">
            <Link
              href={`/cat/${category.slug}`}
              className="flex items-center font-bold text-gray-700 hover:text-gray-500"
            >
              {category.categoryName}
            </Link>
            {category.subCategories?.length > 0 && (
              <div className="pl-2">
                {category.subCategories.map((subcategory) => (
                  <Link
                    key={subcategory._id}
                    href={`/sub/${subcategory.slug}`}
                    className="py-1.5 block text-gray-600 hover:text-gray-500"
                  >
                    {subcategory.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
