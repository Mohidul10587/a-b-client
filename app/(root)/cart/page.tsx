"use client";
import Image from "next/image";
import Link from "next/link";
// pages/cart.tsx
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
          cart.map((item) => (
            <div
              key={item._id}
              className="flex items-center justify-between border-b border-gray-300 py-4"
            >
              <div>
                <div className="flex items-center justify-center w-12 h-12 mr-1">
                  <Image
                    src={item.photo}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="object-cover h-full w-min rounded-md"
                    loading="lazy"
                  />
                </div>
                <h4 className="text-lg font-semibold">{item.name}</h4>
                <p className="text-gray-700">Price: ${item.price}</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => decreaseQuantity(item._id)}
                >
                  -
                </button>
                <input
                  type="number"
                  value={item.quantity}
                  readOnly
                  className="w-12 text-center border border-gray-300 rounded"
                />
                <button
                  className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => increaseQuantity(item._id)}
                >
                  +
                </button>
              </div>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                onClick={() => deleteItem(item._id)}
              >
                Remove
              </button>
            </div>
          ))
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
