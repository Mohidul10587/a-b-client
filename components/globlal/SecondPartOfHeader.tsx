"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoCartOutline, IoClose } from "react-icons/io5";
import { VscThreeBars } from "react-icons/vsc";
import {
  FaUserCircle,
  FaHome,
  FaBook,
  FaTabletAlt,
  FaLaptop,
} from "react-icons/fa";
import Search from "../Search";
import { useData } from "@/app/DataContext";
import DropdownMenu from "../UserDropdown";
import { MdExpandLess, MdExpandMore } from "react-icons/md";

const SecondPartOfHeader: React.FC = () => {
  const { user, sessionStatus, settings, numberOfCartProduct } = useData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpand = (key: string) => {
    setExpanded((prev) => (prev === key ? null : key));
  };

  return (
    <>
      <div className="flex items-center justify-between px-2 py-2 md:py-3 max-w-6xl mx-auto w-full">
        <button
          type="button"
          className="text-2xl md:hidden"
          onClick={() => setIsDrawerOpen(true)}
        >
          <VscThreeBars />
        </button>

        <Link href="/" className="flex-shrink-0">
          <Image
            src={settings?.logo || "/defaultLogo.png"}
            width={160}
            height={40}
            className="h-8 w-auto md:h-9"
            alt="Logo"
          />
        </Link>

        <div className="hidden md:flex flex-1 mx-4">
          <Search />
        </div>

        <div className="flex items-center gap-x-2">
          <div className="md:hidden">
            <Search />
          </div>

          <Link href="/cart" className="relative">
            <IoCartOutline className="text-2xl hover:text-blue-600" />
            {numberOfCartProduct > 0 && (
              <span className="absolute -top-1 -right-2 text-xs bg-red-500 text-white rounded-full px-1">
                {numberOfCartProduct}
              </span>
            )}
          </Link>

          {sessionStatus === "authenticated" ? (
            <DropdownMenu user={user} />
          ) : (
            <Link href="/auth">
              <button className="hidden md:flex items-center px-3 py-1.5 rounded-md text-black hover:bg-blue-600 hover:text-white transition">
                <FaUserCircle className="mr-2 text-lg" />
                <span>Sign in</span>
              </button>
              <button className="md:hidden px-3 py-1 text-sm rounded-md bg-blue-600 text-white">
                Sign in
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Side Drawer */}
      {isDrawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-40 z-40"
            onClick={() => setIsDrawerOpen(false)}
          ></div>

          <div className="fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 p-4 overflow-y-auto">
            {/* Logo + Close */}
            <div className="flex justify-between items-center mb-4">
              <Image
                src={settings?.logo || "/defaultLogo.png"}
                width={120}
                height={30}
                alt="Drawer Logo"
              />
              <button onClick={() => setIsDrawerOpen(false)}>
                <IoClose className="text-2xl" />
              </button>
            </div>

            {/* Menu Items */}
            <nav className="flex flex-col text-[15px] font-medium">
              <Link
                href="/"
                className="flex items-center gap-2 py-2 px-2 hover:bg-gray-100 rounded"
                onClick={() => setIsDrawerOpen(false)}
              >
                <FaHome /> হোম
              </Link>

              {/* Expandable: বই */}
              <div
                className="cursor-pointer flex items-center justify-between px-2 py-2 hover:bg-gray-100 rounded"
                onClick={() => toggleExpand("book")}
              >
                <div className="flex items-center gap-2">
                  <FaBook /> বই
                </div>
                {expanded === "book" ? <MdExpandLess /> : <MdExpandMore />}
              </div>
              {expanded === "book" && (
                <div className="pl-8 text-sm text-gray-700 space-y-1">
                  <Link href="/category/book1">বাংলা উপন্যাস</Link>
                  <Link href="/category/book2">ইতিহাস</Link>
                </div>
              )}

              {/* Expandable: ই-বই */}
              <div
                className="cursor-pointer flex items-center justify-between px-2 py-2 hover:bg-gray-100 rounded"
                onClick={() => toggleExpand("ebook")}
              >
                <div className="flex items-center gap-2">
                  <FaTabletAlt /> ই- বই
                </div>
                {expanded === "ebook" ? <MdExpandLess /> : <MdExpandMore />}
              </div>
              {expanded === "ebook" && (
                <div className="pl-8 text-sm text-gray-700 space-y-1">
                  <Link href="/category/ebook1">PDF উপন্যাস</Link>
                  <Link href="/category/ebook2">Academic</Link>
                </div>
              )}

              {/* Expandable: ইলেক্ট্রনিক্স */}
              <div
                className="cursor-pointer flex items-center justify-between px-2 py-2 hover:bg-gray-100 rounded"
                onClick={() => toggleExpand("electronics")}
              >
                <div className="flex items-center gap-2">
                  <FaLaptop /> ইলেক্ট্রনিক্স
                </div>
                {expanded === "electronics" ? (
                  <MdExpandLess />
                ) : (
                  <MdExpandMore />
                )}
              </div>
              {expanded === "electronics" && (
                <div className="pl-8 text-sm text-gray-700 space-y-1">
                  <Link href="/category/bestseller">Weekly Bestseller</Link>
                  <Link href="/category/science-kit">Science kit</Link>
                  <Link href="/category/smart-watch">Smart watch</Link>
                  <Link href="/category/mouse">Mouse</Link>
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default SecondPartOfHeader;
