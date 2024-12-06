"use client";
import { useSettings } from "@/app/context/AppContext";
import { IProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Product: React.FC<IProduct> = ({
  _id,
  slug,
  photo,
  title,
  featured,
  sele,
  price,
  unprice,
  stockStatus,
}) => {
  const formattedPrice = new Intl.NumberFormat().format(price);
  const formattedUnprice = new Intl.NumberFormat().format(unprice);
  // Calculate discount percentage
  const discount =
    unprice > price ? Math.round(((unprice - price) / unprice) * 100) : 0;
  // Conditional rendering logic for unprice
  const showUnprice = unprice > price;
  const settings = useSettings();
  return (
    <div className="group relative border bg-white block rounded h-full">
      <Link href={`/${slug}`} className="w-full">
        <div className="w-full relative md:h-48 p-2 pb-0 h-40 flex items-center justify-center">
          <Image
            src={photo || "/default.jpg"}
            width={600}
            height={600}
            alt={title}
            quality={100}
            className="h-full w-min cursor-pointer object-cover hover:opacity-80"
          />
          {featured && (
            <p className="absolute left-0 top-0 text-xs bg-main opacity-50 rounded-br leading-none text-white px-2 py-1">
              {featured}
            </p>
          )}
          {sele && (
            <p className="absolute right-0 top-0 text-xs bg-main opacity-50 rounded-bl leading-none text-white px-2 py-1">
              {sele}
            </p>
          )}
          {discount > 0 && (
            <div className="flex items-center absolute opacity-75 left-0 top-2">
              <p className="bg-white pl-2 pr-3 py-0 text-xs">OFF</p>
              <span className="bg-red-500 w-8 -ml-2 h-8 flex items-center justify-center text-xs font-semibold text-white rounded-full">
                {discount}%
              </span>
            </div>
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
            <div className="text-sm font-normal flex items-end justify-between">
              <div className="flex flex-col items-start">
                {showUnprice && (
                  <del className="text-gray-400 text-xs">
                    {settings?.currencySymbol} {formattedUnprice}
                  </del>
                )}
                <p className="font-bold">
                  {settings?.currencySymbol} {formattedPrice}
                </p>
              </div>

              {stockStatus && <span className="text-main">{stockStatus}</span>}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};

export default Product;
