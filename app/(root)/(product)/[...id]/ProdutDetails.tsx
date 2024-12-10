"use client";

import React, { useState } from "react";

import ReadMore from "@/components/ReadMore";
import Slider from "@/components/Slider";
import Link from "next/link";
import Image from "next/image";
import Youtube from "@/components/Youtube";

import Product from "@/components/Product.home";
import { FC, Key } from "react";

import SocialShare from "@/components/SocialShare";

interface ProductDetailsProps {
  product: any;
  settings: any;
  schema: any;
  categoryId: string;
  slideImages: any;
  fullUrl: string;
  categorySlug: string;
  whatsappUrl: string;
  allProducts: any;
  productId: string;
}
export const ProductDetails = ({
  product,
  settings,
  slideImages,
  fullUrl,
  categorySlug,
  whatsappUrl,
  allProducts,
  productId,
}: ProductDetailsProps) => {
  const [discount, setDiscount] = useState(0); // Discount as a state

  const { price, unprice } = product;

  // Format price and unprice with default of empty strings if NaN

  const formattedUnprice = isNaN(unprice)
    ? ""
    : new Intl.NumberFormat().format(unprice);

  // Conditional check to hide the section if both price and unprice are invalid

  const addToCart = (product: any, quantity: number) => {
    const existingCart = localStorage.getItem("cartData");
    const cart: any[] = existingCart ? JSON.parse(existingCart) : [];

    const existingItem = cart.find((item) => item._id === product._id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const sortedProduct = {
        _id: product._id,
        photo: product.photo,
        price: product.price,
        title: product.title,
      };
      cart.push({ ...sortedProduct, quantity });
    }

    localStorage.setItem("cartData", JSON.stringify(cart));
    alert("Product added to cart!");
    // router.push('/cart');
  };
  return (
    <div>
      <div className="container mb-4">
        <ol className="hidden lg:flex items-center mb-1.5 pt-1.5 pb-0 px-4 flex-wrap gap-4 gap-y-1 bg-white rounded-b-md text-sm shadow-sm">
          <li>
            <Link
              href="/"
              title={settings?.title}
              className="hover:text-gray-600 bg-gray-200 px-3 py-1 rounded max-w-sm inline-block truncate nuxt-link-active"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href={`/cat`}
              title="All categories"
              className="hover:text-gray-600 bg-gray-200 px-3 py-1 rounded max-w-sm inline-block truncate"
            >
              Categories
            </Link>
          </li>
          <li>
            <Link
              href={`/cat/${categorySlug}`}
              title="All Smartphones from Price in Kenya"
              className="hover:text-gray-600 bg-gray-200 px-3 py-1 rounded max-w-sm inline-block truncate"
            >
              {product.category.categoryName}
            </Link>
          </li>
          <li>
            <Link
              href={`/writer/${product.writer.slug}`}
              title="Oppo products from Price in Kenya"
              className="hover:text-gray-600 bg-gray-200 px-3 py-1 rounded max-w-sm inline-block truncate"
            >
              {product.writer.title}
            </Link>
          </li>
          <li>
            <p className="hover:text-gray-600 py-1 rounded max-w-sm inline-block truncate">
              {product.title}
            </p>
          </li>
        </ol>
      </div>

      <div className="container my-4">
        <div className="w-full flex flex-col md:flex-row gap-4 bg-white p-2 md:p-4">
          <div className="w-full md:w-[30%]">
            <Slider
              slides={slideImages?.map((url: string) => ({
                image: url,
              }))}
            />
            <SocialShare link={`${fullUrl}/${productId}`} />
          </div>
          <div className="w-full md:w-2/4 md:pt-0 pt-6">
            <div className="flex items-center space-x-2 mb-2">
              {product.featured && (
                <span className="bg-main px-2.5 py-0.5 text-white rounded-md">
                  {product.featured}
                </span>
              )}
              {product.sele && (
                <span className="bg-main px-2.5 py-0.5 text-white rounded-md">
                  {product.sele}
                </span>
              )}{" "}
            </div>
            <h2 className="md:text-xl font-medium leading-tight text-lg max-w-full">
              {product.title} - {product.stockStatus} @{settings.country}
            </h2>

            <div
              className="space-y-2 mt-4"
              dangerouslySetInnerHTML={{
                __html: `Order ${product.title} from ${settings.country} with ${settings.deliveryTime1} and ${product.stockStatus}`,
              }}
            />
            <div className="w-full flex flex-wrap items-center gap-3 md:gap-x-6 divide-x my-4">
              <Link href={`/writer/${product.writer._id}`}>
                <Image
                  src={product.writer.photo}
                  width={100}
                  height={50}
                  alt={product.writer.title}
                />
              </Link>
              {product.condition && (
                <div className="text-center px-3">
                  <p className="font-medium text-gray-500">Condition</p>
                  <p className="text-main font-semibold uppercase">
                    {product.condition}
                  </p>
                </div>
              )}
            </div>

            {product.shortDescription && (
              <div className="shortdescription my-4">
                <div className="bg-white py-4">
                  <h1 className="text-xl font-bold mb-2">
                    {product.title} {settings.country}
                  </h1>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.shortDescription,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="w-full md:w-1/5">
            {product.price ? (
              <>
                <div className="flex flex-col items-start md:mt-0 mt-4">
                  {product.unprice > product.price && (
                    <del className="text-gray-500">
                      {settings.currencySymbol} {formattedUnprice}
                    </del>
                  )}
                  <p className="font-bold text-main leading-tight text-xl">
                    {settings.currencySymbol} {product.price}
                    {discount > 0 && (
                      <span className="text-base text-gray-500 font-normal pl-2">
                        ( {discount}% OFF )
                      </span>
                    )}
                  </p>
                  <p className="text-sm uppercase mt-1">
                    {product.stockStatus}
                  </p>
                </div>
                {product.stockStatus === "Out of Stock" ? null : (
                  <>
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="bg-main my-4 font-bold text-center text-white px-4 py-2 rounded-md block"
                    >
                      Add to curt
                    </button>
                    <Link
                      href={whatsappUrl}
                      target="_blank"
                      className="bg-green-700 my-4 font-bold text-center text-white px-4 py-2 rounded-md block"
                    >
                      Buy via WhatsApp
                    </Link>
                  </>
                )}
              </>
            ) : (
              <p>{settings.priceZero}</p>
            )}
            {product?.suggestion?.products?.length > 0 && (
              <h2 className="text-sm text-gray-700 font-bold mb-2">
                Frequently Bought Together:
              </h2>
            )}
            {product?.suggestion?.products?.map((product: any, i: number) => {
              <div
                key={i}
                className="relative border px-2 py-0.5 w-full rounded flex items-center mb-1"
              >
                <Link href={`/${product?.slug}`} className="w-full">
                  <div className="flex items-center w-full">
                    <div className="flex items-center justify-center w-12 h-12 mr-1">
                      <Image
                        src={product.photo}
                        alt={product.title}
                        width={80}
                        height={80}
                        className="object-cover h-full w-min rounded-md"
                        loading="lazy"
                      />
                    </div>
                    <div className="w-full">
                      <h1 className="text-sm font-semibold line-clamp-1 text-gray-700">
                        {product.title}
                      </h1>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <p>
                          {settings.currencySymbol} {product.price}
                        </p>
                        {discount > 0 && (
                          <div className="flex gap-1 items-center text-main text-xs">
                            ( Off {discount}% )
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </div>;
            })}
            <p className="text-sm mt-3">
              <strong>Kindly note </strong> {settings.note}
            </p>

            <ul className="list-disc py-3 my-3 pl-5 text-sm leading-6 border-y">
              <li>Quick shipping across Kenya</li>
              <li>In-store pickup in Nairobi</li>
              <li>Payment on delivery accepted</li>
              <li>Top-notch products and services</li>
            </ul>
            <div>
              <strong className="font-medium leading-tight">Location</strong>
              <pre className="font-serif relative text-wrap text-sm">
                {settings.officeAddress}
              </pre>
            </div>
            <div className="mt-3">
              <p className="font-medium leading-tight text-base max-w-full mb-2">
                How to pay
              </p>
              <p>
                {settings.payment}
                <br />
                {settings.paymentText1}
                <br />
                {settings.paymentText2}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <h2 className="text-xl font-semibold">Customers also viewed</h2>
        <p className="text-sm font-normal line-clamp-1">
          Other items from {settings.country} similar to {product.title}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-2">
          {allProducts
            .slice(0, 10)
            .map((item: any, index: Key | null | undefined) => (
              <Product
                key={index}
                {...item}
                withCompareProductId_leftSide={product._id}
                categoryId={product.category._id}
              />
            ))}
        </div>
      </div>

      {product.description && (
        <div className="container my-4">
          <div className="bg-white p-4 border">
            <h1 className="text-xl font-bold mb-2">
              {product.title} {settings.country}
            </h1>
            <ReadMore height="h-40">
              <div dangerouslySetInnerHTML={{ __html: product.description }} />
            </ReadMore>
          </div>
        </div>
      )}

      {product.youtubeVideo.length > 0 && (
        <Youtube videos={product.youtubeVideo} title={product.title} />
      )}
    </div>
  );
};
