"use client";
import React from "react";
import Link from "next/link";

// Define the types based on your structure

interface Props {
  items: any;
}

const BrandsItems: React.FC<Props> = ({ items }) => {
  return (
    <div className="relative group">
      <Link
        className="hidden font-bold cursor-pointer md:block md:px-4 py-2 rounded-md text-white hover:text-orange-600 md:hover:bg-white md:group-hover:bg-white md:group-hover:text-black md:hover:text-main transition-colors duration-200"
        href="/brand"
      >
        Brands
      </Link>
      <div className="group-hover:block right-0 hidden absolute top-10 w-52 p-2 bg-white rounded-md max-h-96 overflow-y-auto">
        {items.map((brand: any) => (
          <div key={brand._id}>
            <Link
              href={`/brand/${brand.slug}`}
              className="flex items-center font-bold mb-0.5 text-gray-700 hover:text-gray-500"
            >
              {brand.title}
            </Link>

            {brand.attachedSubCategories?.length > 0 && (
              <div className="pl-2">
                {brand.attachedSubCategories.map((subcategory: any) => (
                  <Link
                    key={subcategory._id}
                    href={`/sub/${subcategory.slug}`}
                    className="pb-0.5 block text-gray-600 hover:text-gray-500"
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

export default BrandsItems;
