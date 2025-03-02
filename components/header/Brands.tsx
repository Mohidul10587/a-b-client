"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiUrl } from "@/app/shared/urls"; // Import apiUrl

// Interface for brand and subcategory data
interface ISubCategory {
  _id: string;
  title: string;
  slug: string;
}

interface IBrand {
  _id: string;
  title: string;
  slug: string;
  photo?: string; // Updated to use "photo" instead of "logoUrl"
  attachedSubCategories?: ISubCategory[];
}

// Fetch brands data
const fetchBrands = async (): Promise<IBrand[]> => {
  try {
    const response = await fetch(`${apiUrl}/brand/allForNavbar`);
    if (!response.ok) {
      throw new Error("Failed to fetch brands");
    }
    const data = await response.json();
    return data.enrichedBrands; // Assuming enrichedBrands contains the desired data
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

const Brands: React.FC = () => {
  const [brands, setBrands] = useState<IBrand[]>([]);

  useEffect(() => {
    const getBrands = async () => {
      const fetchedBrands = await fetchBrands();

      setBrands(fetchedBrands);
    };
    getBrands();
  }, []);

  return (
    <div className="relative group">
      <Link
        className="hidden font-bold cursor-pointer md:block md:px-4 py-1.5 rounded text-main border border-main transition-colors duration-200"
        href="/brand"
      >
        Brands
      </Link>
      <div className="group-hover:block hidden absolute top-10 right-0 w-60 p-2 bg-white rounded max-h-[400px] overflow-y-auto">
        {brands.map((brand) => (
          <div key={brand._id} className="relative flex flex-col">
            <div className="flex items-center space-x-2">
              {/* Brand Image */}
              <Image
                src={brand.photo || "/default.jpg"} // Using "photo" property
                width={20}
                height={20}
                alt={brand.title}
                loading="lazy"
                className="w-5 h-5 object-cover rounded-md"
                quality={100}
              />
              <Link
                href={`/brand/${brand.slug}`}
                className="flex items-center font-bold mb-0.5 text-gray-700 hover:text-gray-500"
              >
                {brand.title}
              </Link>
            </div>
            {brand.attachedSubCategories &&
              brand.attachedSubCategories.length > 0 && (
                <>
                  {brand.attachedSubCategories.map((subcategory) => (
                    <Link
                      key={subcategory._id}
                      href={`/sub/${subcategory.slug}`}
                      className="block pb-0.5 text-gray-600 hover:text-gray-500"
                    >
                      {subcategory.title}
                    </Link>
                  ))}
                </>
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Brands;
