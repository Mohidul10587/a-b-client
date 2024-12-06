// Cat.tsx

import Image from "next/image";
import Link from "next/link";
import { apiUrl } from "@/app/shared/urls";
import { ICategory, ISubcategory } from "@/types/category";

interface CatProps {
  width: number;
  height: number;
}

async function fetchCategories(): Promise<ICategory[]> {
  const response = await fetch(`${apiUrl}/category/all`, {
    next: { revalidate: 100 }, // This ensures revalidation every 100 seconds
  });

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data = await response.json();
  return data.categories;
}

const CatWithSubcategories = async ({ width, height }: CatProps) => {
  const categories = await fetchCategories();

  return (
    <div className="">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category, index) => (
          <div key={index}>
            <div className="flex items-center space-x-2">
              <Image
                src={category.photoUrl}
                width={40}
                height={30}
                alt={category.categoryName}
              />
              <Link href={`/cat/${category.slug}`} className="hover:underline">
                <h2 className="font-semibold text-lg">
                  {category.categoryName}
                </h2>
              </Link>{" "}
            </div>

            <ul className="ml-6 mt-2">
              {category.subCategories.map((subCat, subIndex) => (
                <li key={subIndex}>
                  <div className="flex items-center space-x-2">
                    <Image
                      src={subCat.photo}
                      width={30}
                      height={30}
                      alt={subCat.title}
                    />
                    <Link
                      href={`/sub/${subCat.slug}`}
                      className="hover:underline"
                    >
                      {subCat.title}
                    </Link>{" "}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CatWithSubcategories;
