"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useData } from "@/app/DataContext";

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
  photoUrl?: string;
  subCategories: ISubCategory[];
}

const CategoriesItems: React.FC<{
  categories?: ICategory[];
  menuWithCategories?: any[] | undefined;
}> = ({ categories, menuWithCategories }) => {
  const { settings } = useData();

  const [isPopupOpen, setIsPopupOpen] = useState(false); // State to manage popup visibility
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null); // State to track expanded category

  const toggleSubCategories = (categoryId: string) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  const closePopup = () => setIsPopupOpen(false);

  const whatsappUrl = `https://wa.me/${settings?.whatsapp}?text=Hello ! I want to talk with you about your product`;

  return (
    <div>
      <button
        className="mr-2 cursor-pointer md:hidden block transition-colors duration-200"
        onClick={() => setIsPopupOpen(true)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z"
          />
        </svg>
      </button>

      {/* Popup container */}
      {isPopupOpen && (
        <div className="fixed left-0 top-0 bottom-0 bg-white w-80 z-50 overflow-y-auto">
          <div className="flex items-center justify-between p-2 border-b mb-2">
            <Link href="/" className="outline-none">
              <Image
                src={settings?.logo}
                unoptimized
                width={200}
                height={50}
                quality={100}
                className="h-8 w-min"
                alt="Logo"
              />
            </Link>
            <button onClick={() => setIsPopupOpen(false)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 16 16"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="m7.116 8l-4.558 4.558l.884.884L8 8.884l4.558 4.558l.884-.884L8.884 8l4.558-4.558l-.884-.884L8 7.116L3.442 2.558l-.884.884z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>

          <div className="block divide-y border-b mb-4">
            <Link
              href="/account"
              onClick={closePopup}
              className="flex items-center p-2 hover:bg-gray-200"
            >
              <svg
                stroke="currentColor"
                className="mr-1"
                fill="none"
                strokeWidth="2"
                viewBox="0 0 24 24"
                strokeLinecap="round"
                height="25"
                width="25"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              My Account
            </Link>
            <Link
              href="/account/chat"
              onClick={closePopup}
              className="flex items-center p-2 hover:bg-gray-200"
            >
              <svg
                className="mr-1"
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 256 256"
              >
                <path
                  fill="currentColor"
                  d="M138 128a10 10 0 1 1-10-10a10 10 0 0 1 10 10m-54-10a10 10 0 1 0 10 10a10 10 0 0 0-10-10m88 0a10 10 0 1 0 10 10a10 10 0 0 0-10-10m58-54v128a14 14 0 0 1-14 14H82.23l-33.16 28.64l-.06.05A13.87 13.87 0 0 1 40 238a14.1 14.1 0 0 1-5.95-1.33A13.88 13.88 0 0 1 26 224V64a14 14 0 0 1 14-14h176a14 14 0 0 1 14 14m-12 0a2 2 0 0 0-2-2H40a2 2 0 0 0-2 2v160a2 2 0 0 0 3.26 1.55l34.82-30.08A6 6 0 0 1 80 194h136a2 2 0 0 0 2-2Z"
                />
              </svg>
              Chating
            </Link>
            <Link
              href="/account/wishlist"
              onClick={closePopup}
              className="flex items-center p-2 hover:bg-gray-200"
            >
              <svg
                className="mr-1"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="m8.962 18.91l.464-.588zM12 5.5l-.54.52a.75.75 0 0 0 1.08 0zm3.038 13.41l.465.59zm-8.037-2.49a.75.75 0 0 0-.954 1.16zm-4.659-3.009a.75.75 0 1 0 1.316-.72zm.408-4.274c0-2.15 1.215-3.954 2.874-4.713c1.612-.737 3.778-.541 5.836 1.597l1.08-1.04C10.1 2.444 7.264 2.025 5 3.06C2.786 4.073 1.25 6.425 1.25 9.137zM8.497 19.5c.513.404 1.063.834 1.62 1.16s1.193.59 1.883.59v-1.5c-.31 0-.674-.12-1.126-.385c-.453-.264-.922-.628-1.448-1.043zm7.006 0c1.426-1.125 3.25-2.413 4.68-4.024c1.457-1.64 2.567-3.673 2.567-6.339h-1.5c0 2.198-.9 3.891-2.188 5.343c-1.315 1.48-2.972 2.647-4.488 3.842zM22.75 9.137c0-2.712-1.535-5.064-3.75-6.077c-2.264-1.035-5.098-.616-7.54 1.92l1.08 1.04c2.058-2.137 4.224-2.333 5.836-1.596c1.659.759 2.874 2.562 2.874 4.713zm-8.176 9.185c-.526.415-.995.779-1.448 1.043s-.816.385-1.126.385v1.5c.69 0 1.326-.265 1.883-.59c.558-.326 1.107-.756 1.62-1.16zm-5.148 0c-.796-.627-1.605-1.226-2.425-1.901l-.954 1.158c.83.683 1.708 1.335 2.45 1.92zm-5.768-5.63a7.25 7.25 0 0 1-.908-3.555h-1.5c0 1.638.42 3.046 1.092 4.275z"
                />
              </svg>
              Saved Items
            </Link>
            <Link
              href="/category"
              onClick={closePopup}
              className="flex items-center p-2 hover:bg-gray-200"
            >
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
                width="28"
                height="28"
              >
                <path
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              Categories
            </Link>
            <Link
              href="/brand"
              onClick={closePopup}
              className="flex items-center p-2 hover:bg-gray-200"
            >
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2"
                width="28"
                height="28"
              >
                <path
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
              Brands
            </Link>
            <Link
              href="/seller"
              onClick={closePopup}
              className="flex items-center p-2 hover:bg-gray-200"
            >
              <svg
                className="mr-2"
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
              >
                <g
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                >
                  <path d="M21.25 9.944a3.08 3.08 0 0 1-2.056 2.899a2.9 2.9 0 0 1-1.027.185a3.08 3.08 0 0 1-2.899-2.056a2.9 2.9 0 0 1-.185-1.028c.003.351-.06.7-.185 1.028A3.08 3.08 0 0 1 12 13.028a3.08 3.08 0 0 1-2.898-2.056a2.9 2.9 0 0 1-.185-1.028c.002.351-.06.7-.185 1.028a3.08 3.08 0 0 1-2.899 2.056c-.35.002-.7-.06-1.027-.185A3.08 3.08 0 0 1 2.75 9.944l.462-1.623l1.11-3.166a2.06 2.06 0 0 1 1.943-1.377h11.47a2.06 2.06 0 0 1 1.942 1.377l1.11 3.166z" />
                  <path d="M19.194 12.843v5.324a2.056 2.056 0 0 1-2.055 2.055H6.86a2.055 2.055 0 0 1-2.056-2.055v-5.324m4.113 4.296h6.166" />
                </g>
              </svg>
              Seller
            </Link>
            <Link
              href="/trade-in"
              onClick={closePopup}
              className="flex items-center p-2 hover:bg-gray-200"
            >
              <svg
                className="mr-2"
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M7 21.5a4.5 4.5 0 1 1 0-9a4.5 4.5 0 0 1 0 9m10-10a4.5 4.5 0 1 1 0-9a4.5 4.5 0 0 1 0 9m-10 8a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5m10-10a2.5 2.5 0 1 0 0-5a2.5 2.5 0 0 0 0 5M3 8a5 5 0 0 1 5-5h3v2H8a3 3 0 0 0-3 3v3H3zm18 5h-2v3a3 3 0 0 1-3 3h-3v2h3a5 5 0 0 0 5-5z"
                />
              </svg>
              Trade In
            </Link>
          </div>
          <div className="w-full relative">
            {categories?.map((category) => (
              <div key={category._id} className="group w-full">
                <div className="flex items-center justify-between px-2 py-1.5">
                  <Link
                    href={`/category/${category.slug}`}
                    onClick={closePopup}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-500"
                  >
                    <Image
                      src={category.photoUrl || "/default.jpg"}
                      width={40}
                      height={40}
                      alt={category.title}
                      loading="lazy"
                      className="w-5 h-5 object-cover rounded"
                      quality={100}
                    />
                    {category.title}
                  </Link>
                  {category.subCategories.length > 0 && (
                    <button
                      className="text-gray-500 hover:text-gray-700"
                      onClick={() => toggleSubCategories(category._id)}
                    >
                      {expandedCategory === category._id ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="m19 15l-7-6l-1.75 1.5M5 15l2.333-2"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="25"
                          height="25"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1.5"
                            d="m19 9l-7 6l-1.75-1.5M5 9l2.333 2"
                          />
                        </svg>
                      )}
                    </button>
                  )}
                </div>
                {expandedCategory === category._id &&
                  category.subCategories?.length > 0 && (
                    <div className="ml-2">
                      {category.subCategories
                        .sort((a, b) => a.title.localeCompare(b.title))
                        .map((subcategory) => (
                          <Link
                            key={subcategory._id}
                            href={`/sub/${subcategory.slug}`}
                            onClick={closePopup}
                            className="py-1 px-2 flex items-center gap-2 text-gray-600 hover:text-gray-500"
                          >
                            <Image
                              src={subcategory.photo || "/default.jpg"}
                              width={30}
                              height={30}
                              alt={subcategory.title}
                              loading="lazy"
                              className="w-5 h-5 object-cover rounded"
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
          <div className="block divide-y border-t mt-4">
            <Link
              href="/support"
              onClick={closePopup}
              className="p-2 hover:bg-gray-200 block"
            >
              Help Center
            </Link>
            <Link
              href="/order-policies"
              onClick={closePopup}
              className="p-2 hover:bg-gray-200 block"
            >
              Order Policies
            </Link>
            <Link
              href="/privacy-policies"
              onClick={closePopup}
              className="p-2 hover:bg-gray-200 block"
            >
              Privacy Policies
            </Link>
            <Link
              href="/terms-and-conditions"
              onClick={closePopup}
              className="p-2 hover:bg-gray-200 block"
            >
              Terms and Conditions
            </Link>
            <Link
              href="/store"
              onClick={closePopup}
              className="p-2 hover:bg-gray-200 block"
            >
              Store Locator
            </Link>
            <div className="p-3 border-t">
              <Link
                href={whatsappUrl}
                onClick={closePopup}
                target="_blank"
                className="bg-main flex items-center justify-center gap-1 font-bold uppercase shadow-[0_4px_8px_0_rgba(0,0,0,.2)] text-white text-center w-full py-2 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                >
                  <path
                    fill="currentColor"
                    d="M3 5v18h5v5.078L14.352 23H29V5zm2 2h22v14H13.648L10 23.918V21H5zm5 5a1.999 1.999 0 1 0 0 4a1.999 1.999 0 1 0 0-4m6 0a1.999 1.999 0 1 0 0 4a1.999 1.999 0 1 0 0-4m6 0a1.999 1.999 0 1 0 0 4a1.999 1.999 0 1 0 0-4"
                  />
                </svg>
                Live Chat
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesItems;
