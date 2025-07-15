"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiUrl } from "@/app/shared/urls";
import Image from "next/image";

// Interface for category and subcategory data
interface ISubCategory {
  _id: string;
  title: string;
  slug: string;
  photo?: string;
}

interface ICategory {
  _id: string;
  title: string;
  slug: string;
  photoUrl?: string; // Add photoUrl as optional
  subCategories: ISubCategory[];
}

// Fetch categories data
const fetchCategories = async (): Promise<ICategory[]> => {
  try {
    const response = await fetch(
      `${apiUrl}/category/allCategoryWithSubCategoryForNavbar`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }
    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const CategoriesHome: React.FC<{
  categories?: ICategory[];
  menuWithCategories?: any[] | undefined;
}> = ({ categories: cats, menuWithCategories }) => {
  const [categories, setCategories] = useState<ICategory[]>(cats || []);

  useEffect(() => {
    const getCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    };
    getCategories();
  }, []);

  return (
    <div className="bg-white h-full w-full relative">
      {menuWithCategories?.slice(0, 10).map((menu) => (
        <div key={menu._id} className="group">
          <Link
            href="/"
            className="w-full flex items-center text-sm gap-1 p-2 text-gray-700 hover:bg-gray-100"
          >
            <Image
              src={menu.img || "/default.jpg"}
              width={40}
              height={40}
              alt={menu.title}
              loading="lazy"
              className="w-5 h-5 object-cover rounded"
              quality={100}
            />
            <p>{menu.title}</p>
          </Link>
          <div className="absolute left-full h-full overflow-y-auto text-sm top-0 hidden group-hover:block bg-white p-2 z-50 w-[730px]">
            <div className="columns-3 gap-2">
              {menu?.categories.map((category: ICategory) => (
                <div key={category._id} className="w-full break-inside-avoid">
                  <Link
                    href={`/category/${category.slug}`}
                    className="w-full flex items-center gap-1 mb-1 font-bold px-2 py-1 border-b text-gray-700 hover:text-gray-500"
                  >
                    <Image
                      src={category.photoUrl || "/default.jpg"}
                      width={100}
                      height={100}
                      alt={category.title}
                      loading="lazy"
                      className="w-min h-6 object-cover"
                      quality={100}
                    />
                    {category.title}
                  </Link>
                  {category.subCategories?.length > 0 && (
                    <div className="">
                      {category.subCategories
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map((subcategory) => (
                          <Link
                            key={subcategory._id}
                            href={`/sub/${subcategory.slug}`}
                            className="py-1 px-2 flex items-center gap-1 text-gray-600 hover:text-gray-500"
                          >
                            <Image
                              src={subcategory.photo || "/default.jpg"}
                              width={100}
                              height={100}
                              alt={category.title}
                              loading="lazy"
                              className="w-min h-4 object-cover"
                              quality={100}
                            />
                            {subcategory.title}
                          </Link>
                        ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      <Link
        className="flex items-center space-x-2 text-main text-sm px-2"
        href="/category"
      >
        More Categories
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m10 17l5-5m0 0l-5-5"
          />
        </svg>
      </Link>
    </div>
  );
};

export default CategoriesHome;
