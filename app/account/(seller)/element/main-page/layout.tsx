"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentPath = usePathname();
  return (
    <div className="flex flex-col container my-4">
      {/* Left Sidebar */}
      <div className="w-full">
        <nav className="flex items-center overflow-x-auto gap-2 nober">
          <Link href="/account/element/main-page/seller-home">
            <span
              className={`block py-2 my-1 px-4 rounded ${
                currentPath === "/account/element/main-page/seller-home"
                  ? "bg-main text-white"
                  : "text-gray-700 bg-white"
              }`}
            >
              Home
            </span>
          </Link>

          <Link href="/account/element/main-page/hot-deals">
            <span
              className={`block py-2 my-1 px-4 text-nowrap rounded ${
                currentPath === "/account/element/main-page/hot-deals"
                  ? "bg-main text-white"
                  : "text-gray-700 bg-white"
              }`}
            >
              Hot Deals
            </span>
          </Link>
          <Link href="/account/element/main-page/whats-new">
            <span
              className={`block py-2 my-1 px-4 text-nowrap rounded ${
                currentPath === "/account/element/main-page/whats-new"
                  ? "bg-main text-white"
                  : "text-gray-700 bg-white"
              }`}
            >
              Whats new
            </span>
          </Link>
          <Link href="/account/element/main-page/flash-sales">
            <span
              className={`block py-2 my-1 px-4 text-nowrap rounded ${
                currentPath === "/account/element/main-page/flash-sales"
                  ? "bg-main text-white"
                  : "text-gray-700 bg-white"
              }`}
            >
              Flash Sales
            </span>
          </Link>
        </nav>
      </div>

      {/* Main Content Area */}
      <main>{children}</main>
    </div>
  );
};

export default RootLayout;
