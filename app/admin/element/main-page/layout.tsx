"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const RootLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const currentPath = usePathname(); // Get the current path

  return (
    <div className="flex flex-col container my-4">
      {/* Left Sidebar */}
      <div className="w-full">
        <nav className="flex items-center gap-2">
          <Link href="/admin/element/main-page/home-main">
            <span
              className={`block py-2 my-1 px-4 rounded ${
                currentPath === "/admin/element/main-page/home-main"
                  ? "bg-main text-white"
                  : "text-gray-700 bg-white"
              }`}
            >
              Home
            </span>
          </Link>
          <Link href="/admin/element/main-page/category-main">
            <span
              className={`block py-2 my-1 px-4 rounded ${
                currentPath === "/admin/element/main-page/category-main"
                  ? "bg-main text-white"
                  : "text-gray-700 bg-white"
              }`}
            >
              Category
            </span>
          </Link>
          <Link href="/admin/element/main-page/subcategory-main">
            <span
              className={`block py-2 my-1 px-4 rounded ${
                currentPath === "/admin/element/main-page/subcategory-main"
                  ? "bg-main text-white"
                  : "text-gray-700 bg-white"
              }`}
            >
              Subcategory
            </span>
          </Link>
          <Link href="/admin/element/main-page/brand-main">
            <span
              className={`block py-2 my-1 px-4 rounded ${
                currentPath === "/admin/element/main-page/brand-main"
                  ? "bg-main text-white"
                  : "text-gray-700 bg-white"
              }`}
            >
              Brand
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
