import {
  fetchCategories,
  getPublishers,
  getWriters,
} from "@/app/shared/fetchData";
import Link from "next/link";
import React, { FC } from "react";

const ThirdPartOFHeader = async () => {
  const categories = await fetchCategories();
  const writers = await getWriters();
  const publishers = await getPublishers();
  console.log(categories);
  return (
    <div className="flex items-center py-4 bg-white max-w-6xl m-auto">
      <div className="group relative">
        <button className="w-24 text-sm  font-medium text-gray-700 hover:text-blue-600 focus:outline-none">
          লেখক
        </button>
        <div className="absolute hidden group-hover:block bg-white shadow-lg border rounded-md p-4 z-50">
          <LinkDiv items={writers} link="writer" />
        </div>
      </div>

      <div className="group relative">
        <button className="w-24 text-sm  font-medium text-gray-700 hover:text-blue-600 focus:outline-none">
          বিষয়
        </button>
        <div className="absolute hidden group-hover:block bg-white shadow-lg border rounded-md  p-4 space-y-2 z-50 -left-24">
          <LinkDiv items={categories} link="cat" />
        </div>
      </div>
      <div className="group relative">
        <button className="w-24 text-sm  font-medium text-gray-700 hover:text-blue-600 focus:outline-none">
          প্রকাশনী
        </button>
        <div className="absolute hidden group-hover:block bg-white shadow-lg border rounded-md  p-4 space-y-2 z-50 -left-48">
          <LinkDiv items={publishers} link="publishers" />
        </div>
      </div>
      <div className="group relative">
        <button className="w-24 text-sm  font-medium text-gray-700 hover:text-blue-600 focus:outline-none">
          ভর্তি প্রস্তুতি
        </button>
        <div className="absolute hidden group-hover:block bg-white shadow-lg border rounded-md  p-4 space-y-2 z-50 -left-72">
          <LinkDiv items={categories} link="publishers" />
        </div>
      </div>
      <div className="group relative">
        <button className="w-24 text-sm  font-medium text-gray-700 hover:text-blue-600 focus:outline-none">
          প্যারালাল TEXT
        </button>
        <div className="absolute hidden group-hover:block bg-white shadow-lg border rounded-md  p-4 space-y-2 z-50 -left-96">
          <LinkDiv items={publishers} link="publishers" />
        </div>
      </div>
    </div>
  );
};

export default ThirdPartOFHeader;

const LinkDiv: FC<{ items: any; link: string }> = async ({ items, link }) => {
  return (
    <div className="grid grid-cols-5 gap-4 w-[1118px]">
      {items.map((item: any) => (
        <Link key={item._id} href={`/${link}/${item.slug}`}>
          {" "}
          <p className="text-gray-700 hover:text-blue-600">
            {item.title || item.title}
          </p>
        </Link>
      ))}
    </div>
  );
};
