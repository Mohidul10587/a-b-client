import React, { FC } from "react";
import Image from "next/image";
import { FaTrashAlt, FaHeart } from "react-icons/fa";

const ProductItem: FC<{ product: any }> = ({ product }) => {
  return (
    <div className="flex border-b border-gray-300 p-4 items-center">
      {/* Product Image */}
      <div className="w-20 h-28 relative flex-shrink-0">
        <Image
          src={product.photo}
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

export default ProductItem;
