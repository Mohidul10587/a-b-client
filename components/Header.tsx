import { fetchSettings } from "@/app/shared/fetchSettingsData";
import { apiUrl } from "@/app/shared/urls"; // Assuming you have apiUrl defined
import Image from "next/image";
import Link from "next/link";
import Search from "./Search";
import { ICategory, ISubcategory } from "@/types/category";
import CategoriesItems from "./CategoriesItems";

// Assuming subcategories are part of ICategory

interface ICategoryWithSubcategories extends ICategory {
  subcategories: ISubcategory[];
}

async function fetchCategories(): Promise<ICategoryWithSubcategories[]> {
  try {
    const response = await fetch(`${apiUrl}/category/all`);
    if (!response.ok) {
      console.error(
        "Failed to fetch categories:",
        response.status,
        response.statusText
      );
      throw new Error("Failed to fetch categories");
    }
    const data = await response.json();
    return data.categories;
  } catch (error) {
    console.error("Error in fetchCategories:", error);
    throw error;
  }
}

const Header: React.FC = async () => {
  // Fetch settings and categories concurrently
  const [settings, categories] = await Promise.all([
    fetchSettings(),
    fetchCategories(),
  ]);

  return (
    <div className={`bg-main bg-sticky top-0 z-50`}>
      <div className="container">
        <div className="flex justify-between items-center py-1">
          <Link href={"/"} className="outline-none">
            <Image
              src={settings?.logo}
              width={200}
              height={50}
              quality={100}
              className="h-9 w-min"
              alt="Logo"
            />
          </Link>
          <Search />
          <div className="flex items-center justify-end relative">
            {/* Static Links */}
            <div className="flex items-center justify-end relative">
              {/* Static Links */}

              <CategoriesItems items={categories} />
              {/* Dropdown menu for categories and subcategories */}
            </div>

            <Link
              href="/writer"
              className="hidden md:block md:px-4 py-2 rounded-md text-white md:hover:text-orange-600 hover:bg-white md:hover:text-main transition-colors duration-200"
            >
              Writers
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
