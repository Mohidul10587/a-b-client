"use client";

import Image from "next/image";
import Link from "next/link";
import Search from "../Search";
import { FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { useSettings } from "@/app/context/AppContext";
import { useData } from "@/app/DataContext";

// Assuming subcategories are part of ICategory
const SecondPartOfHeader: React.FC = () => {
  // Fetch settings and categories concurrently
  const settings = useSettings();
  const { user, sessionStatus } = useData();

  return (
    <div className="flex justify-between items-center py-1 max-w-6xl mx-auto">
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
      <div className="flex items-center justify-between  shadow w-56">
        {/* Sign-in Section */}
        {sessionStatus === "authenticated" ? (
          <Link href={"/account"} className="">
            <div>
              <div className="flex justify-center ">
                <Image
                  src={`${user.image}`}
                  width={30}
                  height={30}
                  alt={"User"}
                  className="rounded-full"
                />
              </div>
              <p className="text-center text-sm">{user.name}</p>
            </div>
          </Link>
        ) : (
          <Link href={"/auth"}>
            <button className="flex items-center px-4 py-2 text-black hover:text-white rounded-md hover:bg-blue-600">
              <FaUserCircle className="mr-2 text-lg" />
              <span>Hello, Sign in</span>
            </button>
          </Link>
        )}

        <Link href="/cart" className="mr-4     ">
          <FaShoppingCart className="text-2xl text-gray-700 hover:text-gray-900" />
        </Link>
      </div>
    </div>
  );
};

export default SecondPartOfHeader;
