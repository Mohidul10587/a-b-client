"use client";
import Image from "next/image";
import Link from "next/link";
import { FaTrashAlt, FaHeart } from "react-icons/fa";

import { useEffect, useState } from "react";

const Cart = () => {
  const [cart, setCart] = useState<any[]>([]);

  useEffect(() => {
    const cartData = localStorage.getItem("cartData");
    setCart(cartData ? JSON.parse(cartData) : []);
  }, []);

  const increaseQuantity = (id: string) => {
    const updatedCart = cart.map((item) =>
      item._id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    localStorage.setItem("cartData", JSON.stringify(updatedCart));
  };

  const decreaseQuantity = (id: string) => {
    const updatedCart = cart.map((item) =>
      item._id === id
        ? { ...item, quantity: Math.max(1, item.quantity - 1) }
        : item
    );
    setCart(updatedCart);
    localStorage.setItem("cartData", JSON.stringify(updatedCart));
  };

  const deleteItem = (id: string) => {
    const updatedCart = cart.filter((item) => item._id !== id);
    setCart(updatedCart);
    localStorage.setItem("cartData", JSON.stringify(updatedCart));
  };

  return (
    <div className="p-8">
      <div>
        <h1 className="text-2xl font-bold mb-6">Cart</h1>
        {cart.length === 0 ? (
          <p className="text-gray-600">Your cart is empty.</p>
        ) : (
          <div className="container mx-auto p-4">
            {cart.map((item, index) => (
              <div key={index}>
                <div className="flex border-b border-gray-300 p-4 items-center">
                  {/* Product Image */}
                  <div className="w-20 h-28 relative flex-shrink-0">
                    <Image
                      src={item.photo}
                      alt={item.title}
                      layout="fill"
                      objectFit="cover"
                      className="rounded"
                    />
                  </div>

                  {/* item Details */}
                  <div className="ml-4 flex-grow">
                    <h3 className="font-semibold text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.author}</p>
                    <p className="text-red-600 text-sm mt-1">
                      Only {item.stock} copies available
                    </p>

                    {/* Actions */}
                    <div className="flex items-center mt-2">
                      <button
                        className="flex items-center text-gray-600 hover:text-red-600"
                        onClick={() => deleteItem(item._id)}
                      >
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
                      <button
                        className="px-2 py-1 border border-gray-400"
                        onClick={() => decreaseQuantity(item._id)}
                      >
                        -
                      </button>
                      <span className="px-3">{item.quantity}</span>
                      <button
                        className="px-2 py-1 border border-gray-400"
                        onClick={() => increaseQuantity(item._id)}
                      >
                        +
                      </button>
                    </div>
                    <p className="font-semibold text-lg">
                      {item.price * item.quantity} Tk.
                    </p>
                    <p className="text-gray-400 line-through text-sm">
                      {item.price * item.quantity} Tk.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div>
        <Link
          href={`/checkout`}
          className="bg-main my-4 font-bold text-center text-white px-4 py-2 w-full rounded-md block"
        >
          Proceed to checkout
        </Link>
        <button></button>
      </div>
    </div>
  );
};

export default Cart;
