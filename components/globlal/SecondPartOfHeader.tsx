"use client";

import Image from "next/image";
import Link from "next/link";
import Search from "../Search";
import { FaUserCircle } from "react-icons/fa";
import { IoCartOutline } from "react-icons/io5";
import { useData } from "@/app/DataContext";
import DropdownMenu from "../UserDropdown";

// Assuming subcategories are part of ICategory
const SecondPartOfHeader: React.FC = () => {
  // Fetch settings and categories concurrently

  const { user, sessionStatus, settings, numberOfCartProduct } = useData();
  console.log(numberOfCartProduct);
  return (
    <div className="flex justify-between items-center py-1 max-w-6xl mx-auto">
      <Link href={"/"} className="outline-none">
        <Image
          src={settings?.logo || "/defaultLogo.png"}
          width={200}
          height={50}
          quality={100}
          className="h-9 w-min"
          alt="Logo"
        />
      </Link>
      <Search />
      <div className=" flex items-center justify-between  shadow w-56">
        {/* Sign-in Section */}
        {sessionStatus === "authenticated" ? (
          <DropdownMenu user={user} />
        ) : (
          <Link href={"/auth"}>
            <button className="flex items-center px-4 py-2 text-black hover:text-white rounded-md hover:bg-blue-600">
              <FaUserCircle className="mr-2 text-lg" />
              <span>Hello, Sign in</span>
            </button>
          </Link>
        )}

        <Link href="/cart" className="mr-1 flex">
          <IoCartOutline className="text-2xl hover:text-blue-600 font-bold" />
          <sub>{numberOfCartProduct}</sub>
        </Link>
      </div>
    </div>
  );
};

export default SecondPartOfHeader;
