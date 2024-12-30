import React, { FC } from "react";
import Image from "next/image";
import { FaTrashAlt, FaHeart } from "react-icons/fa";

const ProductItem: FC<{ product: any }> = ({ product }) => {
  return (
    <div className="flex border-b border-gray-300 p-4 items-center">
      {/* Product Image */}
      <div className="w-20 h-28 relative flex-shrink-0">
        <Image
          src={product.image}
          alt={product.title}
          layout="fill"
          objectFit="cover"
          className="rounded"
        />
      </div>

      {/* Product Details */}
      <div className="ml-4 flex-grow">
        <h3 className="font-semibold text-lg">{product.title}</h3>
        <p className="text-sm text-gray-500">{product.author}</p>
        <p className="text-red-600 text-sm mt-1">
          Only {product.stock} copies available
        </p>

        {/* Actions */}
        <div className="flex items-center mt-2">
          <button className="flex items-center text-gray-600 hover:text-red-600">
            <FaTrashAlt className="mr-1" />
            Remove
          </button>
          <button className="flex items-center text-gray-600 hover:text-red-600 ml-4">
            <FaHeart className="mr-1" />
            Wishlist
          </button>
        </div>
      </div>

      {/* Quantity and Price */}
      <div className="text-right">
        <div className="flex items-center mb-2">
          <button className="px-2 py-1 border border-gray-400">-</button>
          <span className="px-3">1</span>
          <button className="px-2 py-1 border border-gray-400">+</button>
        </div>
        <p className="font-semibold text-lg">{product.price} Tk.</p>
        <p className="text-gray-400 line-through text-sm">
          {product.originalPrice} Tk.
        </p>
      </div>
    </div>
  );
};

const ProductList = () => {
  const products = [
    {
      id: 1,
      image: "/images/toefl.jpg",
      title: "ক্লিফস টোফেল গ্রামার",
      author: "শামীম হোসেন (টিপু)",
      stock: 9,
      price: 196,
      originalPrice: 480,
    },
    {
      id: 2,
      image: "/images/italian.jpg",
      title: "সহজ উপায়ে ৩০ দিনে ইটালিয়ান ভাষা শিক্ষা",
      author: "মাহবুবুর রহমান",
      stock: 8,
      price: 61,
      originalPrice: 145,
    },
    {
      id: 3,
      image: "/images/grammar.jpg",
      title: "কোর্সটান ব্যাকরণ ও সৌন্দর্য চর্চা",
      author: "নাহার আল বোখারী",
      stock: 10,
      price: 81,
      originalPrice: 105,
    },
  ];

  return (
    <div className="container mx-auto p-4">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
