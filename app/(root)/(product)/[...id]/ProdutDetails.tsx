"use client";

import React, { useEffect, useState } from "react";
import Specifications from "@/app/(root)/(product)/[...id]/Specifications";
import ReadMore from "@/components/ReadMore";
import Slider from "@/components/Slider";
import Link from "next/link";
import Image from "next/image";
import Youtube from "@/components/Youtube";

import SpecificationsDetails from "@/app/(root)/(product)/[...id]/SpecificationDetails";
import Product from "@/app/(root)/(product)/[...id]/Product.details.";
import { FC, Key } from "react";

import SocialShare from "@/components/SocialShare";
import Head from "next/head";
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
  schema,
  categoryId,
  slideImages,
  fullUrl,
  categorySlug,
  whatsappUrl,
  allProducts,
  productId,
}: ProductDetailsProps) => {
  const [variantPrice, setVariantPrice] = useState(0);
  const [variantTitle, setVariantTitle] = useState("");
  const [discount, setDiscount] = useState(0); // Discount as a state
  const [hasImage, setHasImage] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  useEffect(() => {
    // Check if any item has a non-null variantImage URL
    const imageExists = product.variantSectionInfo.some(
      (item: any) => item.variantImage !== null
    );
    setHasImage(imageExists);
  }, [product]);

  const { price, unprice } = product;
  useEffect(() => {
    // Check if any item has a non-null variantImage URL
    const imageExists = product.variantSectionInfo.some(
      (item: any) => item.variantImage !== null
    );
    setHasImage(imageExists);
  }, [product]);

  useEffect(() => {
    // Calculate discount based on variantPrice or regular price
    if (variantPrice > 0) {
      setDiscount(
        unprice > variantPrice
          ? Math.round(((unprice - variantPrice) / unprice) * 100)
          : 0
      );
    } else {
      setDiscount(
        unprice > price ? Math.round(((unprice - price) / unprice) * 100) : 0
      );
    }
  }, [variantPrice, unprice, price]); // Recalculate discount whenever variantPrice, unprice, or price changes

  console.log(variantPrice);

  // Format price and unprice with default of empty strings if NaN
  const formattedPrice =
    variantPrice > 0
      ? isNaN(variantPrice)
        ? ""
        : new Intl.NumberFormat().format(variantPrice)
      : isNaN(variantPrice)
      ? ""
      : new Intl.NumberFormat().format(price);
  const formattedUnprice = isNaN(unprice)
    ? ""
    : new Intl.NumberFormat().format(unprice);

  // Conditional check to hide the section if both price and unprice are invalid
  if (!formattedPrice && !formattedUnprice) {
    return null;
  }

  return (
    <div>
      <Head>
        <meta itemProp="writer" content={product.writer} />
        <meta
          itemProp="name"
          content={
            product.metaTitle || `Buy ${product.title} - ${product.stockStatus}`
          }
        />
        <meta
          itemProp="description"
          content={
            product.metaDescription ||
            `Order ${product.title} with fas delivery across ${settings.country}.`
          }
        />
        <meta itemProp="productID" content={product.id} />
        <meta
          itemProp="url"
          content={`${settings.siteUrl}/product/${product._id}`}
        />
        <meta itemProp="image" content={product.photo} />
        <meta itemProp="value" content={product._id} />
        {/* <link
          itemProp="availability"
          href={
            product.stockStatus === "In Stock"
              ? "https://schema.org/InStock"
              : "https://schema.org/OutOfStock"
          }
        />
        <link itemProp="itemCondition" href="https://schema.org/NewCondition" /> */}
        <meta itemProp="price" content={product.price} />
        {/* <meta itemProp="priceCurrency" content={settings.currency} /> */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>
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
              {product.warranty && (
                <div className="text-center px-3">
                  <p className="font-medium text-gray-500">Warranty</p>
                  <p className="text-main font-semibold uppercase">
                    {product.warranty}
                  </p>
                </div>
              )}
            </div>

            {product.variantSectionInfo?.length > 0 && (
              <div className="my-4 block w-full">
                {product.variantTitle && (
                  <h1 className="text-gray-700 font-bold mb-2">
                    {product.variantTitle}
                  </h1>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {hasImage ? (
                    <>
                      {product.variantSectionInfo.map(
                        (
                          section: {
                            title: string;
                            variantPrice: number;
                            img: string | null;
                          },
                          index: number
                        ) => (
                          <div
                            key={index}
                            onClick={() => {
                              if (variantPrice === section.variantPrice) {
                                setVariantPrice(product.price);
                                setVariantTitle("");
                                setSelectedIndex(null);
                              } else {
                                setVariantPrice(section.variantPrice);
                                setVariantTitle(section.title);
                                setSelectedIndex(index); // Set selected index
                              }
                            }}
                            className={`flex flex-col items-center justify-center p-2 rounded-md ${
                              selectedIndex === index
                                ? "bg-main"
                                : "bg-gray-200"
                            } border w-full`}
                          >
                            <div className="">
                              {section.img ? (
                                <Image
                                  src={section.img}
                                  alt={section.title}
                                  width={300}
                                  height={300}
                                  className="object-cover w-28 h-28 rounded-md mb-1"
                                />
                              ) : null}
                            </div>
                            {section.title && (
                              <h3
                                className={`font-bold ${
                                  selectedIndex === index
                                    ? "text-white"
                                    : "text-gray-700"
                                }`}
                              >
                                {section.title}
                              </h3>
                            )}
                            {section.variantPrice && (
                              <p
                                className={`${
                                  selectedIndex === index
                                    ? "text-white"
                                    : "text-gray-700"
                                }`}
                              >
                                {settings.currencySymbol}{" "}
                                {new Intl.NumberFormat().format(
                                  section.variantPrice
                                )}
                              </p>
                            )}
                          </div>
                        )
                      )}
                    </>
                  ) : (
                    <>
                      {product.variantSectionInfo.map(
                        (
                          section: {
                            title: string;
                            variantPrice: number;
                            img: string | null;
                          },
                          index: number
                        ) => (
                          <div
                            key={index}
                            onClick={() => {
                              if (variantPrice === section.variantPrice) {
                                setVariantPrice(product.price);
                                setVariantTitle("");
                                setSelectedIndex(null);
                              } else {
                                setVariantPrice(section.variantPrice);
                                setVariantTitle(section.title);
                                setSelectedIndex(index); // Set selected index
                              }
                            }}
                            className={`text-center border ${
                              selectedIndex === index
                                ? "border-green-600"
                                : "border-gray-500"
                            } w-20`}
                          >
                            <h3 className="text-sm font-medium mb-2">
                              {section.title || "No title"}
                            </h3>

                            <p className="text-sm mt-1">
                              Price: ${section.variantPrice}
                            </p>
                          </div>
                        )
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
            <div>
              <Specifications
                highlights={settings?.highlights}
                title={product.title}
                infoSectionsData={product.infoSectionsData}
              />
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
                    {settings.currencySymbol} {formattedPrice}
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
                    <Link
                      href={`/checkout/${product._id}/${variantPrice}/${variantTitle}/`}
                      className="bg-main my-4 font-bold text-center text-white px-4 py-2 rounded-md block"
                    >
                      BUY
                    </Link>
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

      <div className="container my-4">
        <h1 className="text-xl font-bold mb-1">Specifications</h1>
        <p className="line-clamp-1 text-sm font-normal">
          {product.title} full specifications, cost and availability{" "}
          {settings.country}
        </p>
        <SpecificationsDetails infoSectionsData={product.infoSectionsData} />
      </div>
      {product.youtubeVideo.length > 0 && (
        <Youtube videos={product.youtubeVideo} title={product.title} />
      )}
    </div>
  );
};
