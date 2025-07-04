"use client";

import { useData } from "@/app/DataContext";
import { IProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import AddToCart from "./AddToCart";

const Product: React.FC<IProduct> = ({
  _id,
  slug,
  img,
  titleEn,
  existingQnt,

  sellingPrice,
  regularPrice,
  category,
  stockStatus,
  shippingInside,
  shippingOutside,
}) => {
  const formattedPrice = new Intl.NumberFormat().format(sellingPrice);
  const formattedUnprice = new Intl.NumberFormat().format(regularPrice);
  // Calculate discount percentage
  const discount =
    regularPrice > sellingPrice
      ? Math.round(((regularPrice - sellingPrice) / regularPrice) * 100)
      : 0;
  // Conditional rendering logic for regularPrice
  const showUnprice = regularPrice > sellingPrice;
  const { settings } = useData();
  return (
    <div className="group relative border bg-white block rounded h-full">
      <Link href={`/product/${slug}`} className="w-full">
        <div className="w-full relative md:h-48 p-2 pb-0 h-40 flex items-center justify-center">
          <Image
            src={img || "/default.jpg"}
            width={600}
            height={600}
            alt={titleEn || ""}
            quality={100}
            className="h-full w-min cursor-pointer object-cover"
          />

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
            {titleEn}
          </h2>
          {sellingPrice <= 0 ? (
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
      <AddToCart
        product={{
          _id: _id,
          type: "main",
          img: img,
          sellingPrice: sellingPrice,
          regularPrice: regularPrice,
          titleEn: titleEn,
          existingQnt: existingQnt,
          shippingInside: shippingInside,
          shippingOutside: shippingOutside,
          variantId: _id,
          commissionForSeller: category?.commissionForSeller,
        }}
      />
    </div>
  );
};

export default Product;
