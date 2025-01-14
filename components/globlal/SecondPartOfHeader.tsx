import { fetchSettings } from "@/app/shared/fetchSettingsData";
import Image from "next/image";
import Link from "next/link";
import Search from "../Search";
import CategoriesItems from "../CategoriesItems";
import { fetchCategories } from "@/app/shared/fetchData";

// Assuming subcategories are part of ICategory
const SecondPartOfHeader: React.FC = async () => {
  // Fetch settings and categories concurrently
  const [settings, categories] = await Promise.all([
    fetchSettings(),
    fetchCategories(),
  ]);

  return (
    <div className="flex justify-between items-center py-1 max-w-6xl m-auto">
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
          className="hidden md:block md:px-4 py-2 rounded-md  md:hover:text-orange-600  hover:bg-white md:hover:text-main transition-colors duration-200"
        >
          Writers
        </Link>
        <Link
          href="/cart"
          className="hidden md:block md:px-4 py-2 rounded-md  md:hover:text-orange-600 hover:bg-white md:hover:text-main transition-colors duration-200"
        >
          cart
        </Link>
      </div>
    </div>
  );
};

export default SecondPartOfHeader;
