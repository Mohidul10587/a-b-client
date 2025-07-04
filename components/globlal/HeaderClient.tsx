"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoCartOutline, IoClose } from "react-icons/io5";
import { VscThreeBars } from "react-icons/vsc";
import {
  FaUserCircle,
  FaHome,
  FaBook,
  FaTabletAlt,
  FaLaptop,
} from "react-icons/fa";
import { MdExpandLess, MdExpandMore } from "react-icons/md";
import Search from "../Search";
import DropdownMenu from "../UserDropdown";
import { useData } from "@/app/DataContext";

const HeaderClient = ({
  categories,
  writers,
  publishers,
}: {
  categories: any[];
  writers: any[];
  publishers: any[];
}) => {
  const { user, sessionStatus, settings, numberOfCartProduct } = useData();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpand = (key: string) => {
    setExpanded((prev) => (prev === key ? null : key));
  };

  return (
    <div className="bg-sticky top-0 z-50 w-full md:mt-0 mt-1">
      {/* First Part */}
      <div className="bg-main hidden md:block">
        <div className="max-w-6xl mx-auto">
          <Image src="/add.webp" height={800} width={1400} alt="ad banner" />
        </div>
      </div>

      {/* Second Part */}
      <div className="flex items-center justify-between px-2  md:py-1 max-w-6xl mx-auto w-full">
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
        <div className="md:hidden">
          <Search />
        </div>
        <div className="flex items-center gap-x-4">
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

      {/* Mega Menu */}
      <div className="hidden md:flex items-center py-4 bg-white max-w-6xl mx-auto">
        <MegaMenu
          categories={categories}
          writers={writers}
          publishers={publishers}
        />
      </div>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity duration-300 ${
          isDrawerOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 p-4 overflow-y-auto transform transition-transform duration-300 ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
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

        {/* Drawer Menu */}
        <nav className="flex flex-col text-[15px] font-medium">
          <Link
            href="/"
            className="flex items-center gap-2 py-2 px-2 hover:bg-gray-100 rounded"
            onClick={() => setIsDrawerOpen(false)}
          >
            <FaHome /> হোম
          </Link>

          <ExpandableItem
            title="বিষয়"
            icon={<FaBook />}
            isOpen={expanded === "categories"}
            onClick={() => toggleExpand("categories")}
            links={categories.map((cat) => ({
              label: cat.title,
              href: `/category/${cat.slug}`,
            }))}
          />

          <ExpandableItem
            title="লেখক"
            icon={<FaUserCircle />}
            isOpen={expanded === "writers"}
            onClick={() => toggleExpand("writers")}
            links={writers.map((writer) => ({
              label: writer.title,
              href: `/writer/${writer.slug}`,
            }))}
          />

          <ExpandableItem
            title="প্রকাশনী"
            icon={<FaLaptop />}
            isOpen={expanded === "publishers"}
            onClick={() => toggleExpand("publishers")}
            links={publishers.map((pub) => ({
              label: pub.title,
              href: `/publishers/${pub.slug}`,
            }))}
          />
        </nav>
      </div>
    </div>
  );
};

export default HeaderClient;

// ExpandableItem with smooth animation
const ExpandableItem = ({
  title,
  icon,
  isOpen,
  onClick,
  links,
}: {
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onClick: () => void;
  links: { label: string; href: string }[];
}) => (
  <>
    <div
      className="cursor-pointer flex items-center justify-between px-2 py-2 hover:bg-gray-100 rounded"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        {icon} {title}
      </div>
      <div
        className={`transition-transform duration-300 ${
          isOpen ? "rotate-180" : "rotate-0"
        }`}
      >
        <MdExpandMore />
      </div>
    </div>
    <div
      className={`overflow-hidden transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
      } pl-8 text-sm text-gray-700 space-y-1`}
    >
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className="block hover:text-blue-600"
          onClick={onClick}
        >
          {link.label}
        </Link>
      ))}
    </div>
  </>
);

// Mega Menu (unchanged)
const MegaMenu = ({
  categories,
  writers,
  publishers,
}: {
  categories: any[];
  writers: any[];
  publishers: any[];
}) => {
  const menus = [
    { label: "লেখক", items: writers, link: "writer" },
    { label: "বিষয়", items: categories, link: "category" },
    { label: "প্রকাশনী", items: publishers, link: "publishers" },
    { label: "ভর্তি প্রস্তুতি", items: categories, link: "publishers" },
    { label: "প্যারালাল TEXT", items: publishers, link: "publishers" },
  ];

  return (
    <>
      {menus.map((menu, idx) => (
        <div key={idx} className="group relative">
          <button className="w-24 text-sm font-medium text-gray-700 hover:text-blue-600">
            {menu.label}
          </button>
          <div
            className={`absolute hidden group-hover:block bg-white shadow-lg border rounded-md p-4 z-50 ${
              idx === 0
                ? "left-0"
                : idx === 1
                ? "-left-24"
                : idx === 2
                ? "-left-48"
                : idx === 3
                ? "-left-72"
                : "-left-96"
            }`}
          >
            <div className="grid grid-cols-5 gap-4 w-[1118px]">
              {menu.items.map((item: any) => (
                <Link key={item._id} href={`/${menu.link}/${item.slug}`}>
                  <p className="text-gray-700 hover:text-blue-600">
                    {item.title}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ))}
    </>
  );
};
