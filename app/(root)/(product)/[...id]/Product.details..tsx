"use client";

import { useData } from "@/app/DataContext";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface ProductProps {
  _id: string;
  slug: string;
  photo: string;
  title: string;
  featured: string;
  stockStatus: string;
  sele: string;
  price: number;
  withCompareProductId_leftSide: string;
  categoryId: string;
}

const Product: React.FC<ProductProps> = ({
  _id,
  slug,
  photo,
  title,
  featured,
  sele,
  price,
  stockStatus,
  withCompareProductId_leftSide,
  categoryId,
}) => {
  const { settings } = useData();
  return (
    <div className="group relative border bg-white block rounded">
      <Link href={`/${slug}`} className="w-full">
        <div className="w-full relative md:h-48 p-2 pb-0 h-40 flex items-center justify-center">
          <Image
            src={photo || "/default.jpg"}
            width={200}
            height={200}
            alt={title}
            className="h-full w-min cursor-pointer hover:opacity-80"
          />
          {featured && (
            <p className="absolute left-0 top-0 text-xs bg-main/70 leading-none text-white px-2 py-1">
              {featured}
            </p>
          )}
          {sele && (
            <p className="absolute right-0 top-0 text-xs bg-main/70 leading-none text-white px-2 py-1">
              {sele}
            </p>
          )}
        </div>

        <div className="p-2 block">
          <h2 className="line-clamp-2 mb-2 text-base font-semibold text-black">
            {title}
          </h2>
          {price <= 0 ? (
            <div className="text-sm font-normal">
              {settings?.priceZero || "Currently Unavailable"}
            </div>
          ) : (
            <div className="text-sm font-normal flex items-center justify-between">
              <p className="font-bold">
                {settings?.currencySymbol}{" "}
                {new Intl.NumberFormat().format(price)}
              </p>
              <span className="text-main">{stockStatus}</span>
            </div>
          )}
        </div>
      </Link>

      <Link
        href={`/compare/${withCompareProductId_leftSide}/${_id}/${categoryId}`}
        className="bg-main p-2 text-center text-white md:hidden md:group-hover:block block md:absolute relative md:-bottom-10 z-10 w-full"
      >
        Compare
      </Link>
    </div>
  );
};

export default Product;
