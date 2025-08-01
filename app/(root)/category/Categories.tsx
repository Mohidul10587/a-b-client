// Cat.tsx

import Image from "next/image";
import Link from "next/link";
import { apiUrl } from "@/app/shared/urls";
import { ICategory } from "@/types/category";

interface CatProps {
  width: number;
  height: number;
}

async function fetchCategories() {
  const response = await fetch(
    `${apiUrl}/category/getAllCategoriesForCatMainPage`,
    {
      next: { revalidate: 100 }, // This ensures revalidation every 100 seconds
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await response.json();
  return data.respondedData;
}

const Categories = async ({ width, height }: CatProps) => {
  const categories = await fetchCategories();

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
      {categories.map((item: any, index: number) => (
        <Link
          href={`/category/${item.slug}`}
          key={index}
          className="group flex items-center justify-center flex-col p-2 border font-bold bg-white"
        >
          <Image
            src={item.img || "/default.jpg"}
            width={width}
            height={height}
            alt={item.title}
          />
          {item.title && (
            <h2 className="text-sm group-hover:text-main mt-1">{item.title}</h2>
          )}
          <p className="font-normal text-sm">{item.categoryProducts}</p>
        </Link>
      ))}
    </div>
  );
};

export default Categories;
