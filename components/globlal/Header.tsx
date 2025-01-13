import { fetchSettings } from "@/app/shared/fetchSettingsData";
import { apiUrl } from "@/app/shared/urls"; // Assuming you have apiUrl defined
import Image from "next/image";
import Link from "next/link";
import Search from "../Search";
import { ICategory, ISubcategory } from "@/types/category";
import CategoriesItems from "../CategoriesItems";
import ThirdPartOFHeader from "./ThirdPartOFHeader";
import SecondPartOfHeader from "./SecondPartOfHeader";
import FirstPartOfHeder from "./FirstPartOfHeder";

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
    <div className={` bg-sticky top-0 z-50`}>
      <div className="container">
        <FirstPartOfHeder />
        <SecondPartOfHeader />
        <ThirdPartOFHeader />
      </div>
    </div>
  );
};

export default Header;
