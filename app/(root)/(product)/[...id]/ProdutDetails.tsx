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
import {
  FaShareAlt,
  FaShoppingCart,
  FaTruck,
  FaUndo,
  FaWhatsapp,
} from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import RelatedProducts from "./RelatedProducts";

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
  const [activeTab, setActiveTab] = useState("specification");

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
  };
  return (
    <div className="max-w-6xl mx-auto">
      <div className="max-w-6xl mx-auto">
        <div className="  p-4 grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left Section: Product Image */}
          <div className="col-span-2">
            <div className="relative">
              <Image
                src={product.photo} // Replace with actual image path
                alt="Product Image"
                width={400}
                height={600}
                className="rounded shadow-md"
              />
              <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                25% OFF
              </span>
            </div>
            <button className="mt-4 w-full bg-gray-200 hover:bg-gray-300 text-black text-center py-2 rounded shadow">
              Want to read
            </button>
          </div>

          {/* Middle Section: Product Info */}
          <div className="col-span-2 lg:col-span-2 space-y-4">
            {/* Countdown Timer */}
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md font-medium flex items-center justify-between">
              <span>চলছে ০১ দিনের বিশেষ অফার</span>
              <span className="bg-red-700 text-white px-2 py-1 rounded">
                01 : 08 : 14 : 57
              </span>
            </div>

            {/* Product Title and Info */}
            <div className="space-y-2">
              <h1 className="text-xl font-bold">{product.title}(হার্ডকভার)</h1>
              <p className="text-gray-600">
                By {product.writer.title}{" "}
                {product.translatorName && (
                  <span>(Translated by {product.translatorName})</span>
                )}
              </p>
              <p className="text-sm text-gray-500 ">
                <span className="font-extrabold ">Category :</span>{" "}
                {product.category.title}
              </p>
            </div>

            {/* Price Section */}
            <div className="space-y-2">
              <p className="text-2xl font-semibold text-red-500">
                TK. {product.price}{" "}
                <span className="line-through text-gray-400">
                  TK. {product.price}
                </span>
              </p>
              <p className="text-sm text-green-600">You Save TK. 75 (25%)</p>
              <p className="text-sm text-gray-700">
                <span className="font-semibold">In Stock:</span> Only 1 copy
                left!
              </p>
            </div>

            {/* Important Notes */}
            <div className="bg-orange-100 text-orange-800 px-4 py-3 rounded-md">
              <p className="text-sm font-medium">
                📌 আর মাত্র ১ কপি বাকি, এবার ১০% থেকে ৪০% পর্যন্ত ছাড়!
              </p>
            </div>

            {/* Delivery and Return Info */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <FaTruck className="text-green-500" />
                <span className="text-sm text-gray-700">Cash On Delivery</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaUndo className="text-blue-500" />
                <span className="text-sm text-gray-700">
                  7 Days Happy Return
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
              <button
                className="bg-blue-500 text-white flex items-center justify-center space-x-2 py-2 px-4 rounded shadow hover:bg-blue-600 w-full"
                onClick={() => addToCart(product, 1)}
              >
                <FaShoppingCart />
                <span>Add to Cart</span>
              </button>
              <button className="bg-pink-500 text-white flex items-center justify-center space-x-2 py-2 px-4 rounded shadow hover:bg-pink-600 w-full">
                <AiOutlineHeart />
                <span>Save for Later</span>
              </button>
              <button
                className="bg-green-500 text-white flex items-center justify-center space-x-2 py-2 px-4 rounded shadow hover:bg-green-600 w-full"
                onClick={() => {
                  const message = `Hello, I would like to buy ${
                    product.title || "this product"
                  } (Price: TK. ${product.price || "N/A"}) via WhatsApp.`;
                  const whatsappUrl = `https://wa.me/+8801774361705?text=${encodeURIComponent(
                    message
                  )}`; // Replace 1234567890 with your WhatsApp number
                  window.open(whatsappUrl, "_blank");
                }}
              >
                <FaWhatsapp />
                <span>Buy via WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Right Section: Related Products */}

          {product.suggestion?.products.length > 0 ? (
            <RelatedProducts products={product.suggestion.products} />
          ) : (
            <RelatedProducts products={allProducts} />
          )}
        </div>
        <div className="mt-8">
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
                <div
                  dangerouslySetInnerHTML={{ __html: product.description }}
                />
              </ReadMore>
            </div>
          </div>
        )}

        {product.youtubeVideo.length > 0 && (
          <Youtube videos={product.youtubeVideo} title={product.title} />
        )}

        <div className="mt-8 min-h-96">
          <h2 className="text-lg font-semibold border-b pb-2">
            Product Specification & Summary
          </h2>

          <div className="flex justify-start mb-4">
            <div className="flex justify-start mb-4">
              <button
                className={`px-4 py-2 mr-2 border rounded-md ${
                  activeTab === "specification" && "bg-blue-500 text-white"
                }`}
                onClick={() => handleTabClick("specification")}
              >
                Specification
              </button>
              <button
                className={`px-4 py-2 border rounded-md ${
                  activeTab === "author" && "bg-blue-500 text-white"
                }`}
                onClick={() => handleTabClick("author")}
              >
                Author
              </button>
            </div>
          </div>

          {activeTab === "specification" && (
            <div>
              <div className="flex space-x-12 mb-2">
                <span className="font-semibold w-44">Title</span>
                <span>{product.title}</span>
              </div>
              <div className="flex space-x-12 mb-2">
                <span className="font-semibold w-44">Author</span>
                <span> {product.writer.title}</span>
              </div>
              <div className="flex space-x-12 mb-2">
                <span className="font-semibold w-44">translatorName</span>
                <span> {product.translatorName}</span>
              </div>
              <div className="flex space-x-12 mb-2">
                <span className="font-semibold w-44">Publisher</span>
                <span>{product.publisher}</span>
              </div>
              <div className="flex space-x-12 mb-2">
                <span className="font-semibold w-44">Edition</span>
                <span>{product.edition}</span>
              </div>
              <div className="flex space-x-12 mb-2">
                <span className="font-semibold w-44">Number of Pages</span>
                <span>{product.numberOfPage}</span>
              </div>
              <div className="flex space-x-12 mb-2">
                <span className="font-semibold w-44">Country</span>
                <span>বাংলাদেশ</span>
              </div>
              <div className="flex space-x-12 mb-2">
                <span className="font-semibold w-44">Language</span>
                <span>{product.language}</span>
              </div>
            </div>
          )}

          {activeTab === "author" && (
            <div>
              <div className="flex justify-between mb-2 ">
                <div className="w-2/12">
                  <div className="flex justify-center">
                    <Image
                      src={product.writer.photo}
                      alt="Author Image"
                      width={154}
                      height={94}
                      className="rounded-full "
                    />
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-center">194 followers</p>
                    <p className="px-2 py-1 bg-blue-500 text-white rounded-sm text-center">
                      Follow
                    </p>
                  </div>
                </div>
                <div className="w-10/12">
                  <span className="font-semibold text-4xl">
                    {product.writer.title}
                  </span>

                  <div
                    dangerouslySetInnerHTML={{
                      __html: product.writer.description,
                    }}
                  />

                  <p className="text-sm">
                    Jules Gabriel Verne (8 February 1828 – 24 March 1905) was a
                    French novelist, poet, and playwright best known for his
                    adventure novels and his profound influence on the literary
                    genre of science fiction. Verne was born to bourgeois
                    parents in the seaport of Nantes, where he was trained to
                    follow in his fathers footsteps asa lawyer, but quit the
                    profession early in life to write for magazines and the
                    stage. His collaboration with the publisher Pierre-Jules
                    Hetzel led to the creation of the Voyages extraordinaires, a
                    widely popular series of scrupulously researched adventure
                    novels including Journey to the Center of the Earth (1864),
                    Twenty Thousand Leagues Under the Sea (1870), and Around the
                    World in Eighty Days (1873).
                  </p>
                </div>
              </div>
              <button className="text-sm mt-2 text-gray-500">
                Report incorrect information
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
