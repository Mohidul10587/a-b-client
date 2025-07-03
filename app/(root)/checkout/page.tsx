"use client";
import {
  FaUser,
  FaEnvelope,
  FaHome,
  FaCity,
  FaMapPin,
  FaPhone,
} from "react-icons/fa";

import { apiUrl } from "@/app/shared/urls";
import axios from "axios";
import Image from "next/image";
import { useEffect, useState } from "react";

import { FaShoppingCart, FaInfoCircle, FaCreditCard } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useData } from "@/app/DataContext";
import React from "react";
import useSWR from "swr";
import { fetcher } from "@/app/shared/fetcher";

const Checkout = () => {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const { user, sessionStatus } = useData();
  const [deliveryInfo, setDeliveryInfo] = useState<{
    [key: string]: string;
  }>({
    name: "",
    email: "",
    address: "",
    city: "",
    phone: "",
  });
  const { data: cartResponse } = useSWR(
    user?._id ? `cart/getUserCart/${user._id}` : null,
    fetcher
  );
  const [paymentMethod, setPaymentMethod] = useState("AamarPay");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      setCart(cartResponse?.respondedData || []);
    } else {
      const cartData = localStorage.getItem("cartData");
      setCart(cartData ? JSON.parse(cartData) : []);
    }
  }, [cartResponse?.respondedData, sessionStatus]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryInfo({ ...deliveryInfo, [name]: value });
  };

  const result = cart.map((product: any) => ({
    id: product._id,
    priceWhenSubmitOrder: product.sellingPrice,
    quantity: product.quantity,
  }));

  const handlePaymentByAamarPay = async () => {
    const hasEmptyField = Object.values(deliveryInfo).some(
      (val) => !val.trim()
    );
    if (hasEmptyField) {
      alert("Please fill out all delivery fields.");
      return;
    }
    const transactionId = `txn_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 11)}`;

    try {
      const response = await axios.post(
        `${apiUrl}/payment/initialize-payment`,
        {
          amount: calculateTotal(),
          transactionId,
          name: deliveryInfo.name,
          email: deliveryInfo.email,
          phone: deliveryInfo.phone,

          orderInfoForStore: {
            cart: cart,
            user: user._id,
            deliveryInfo,
            paidAmount: calculateTotal(),
            paymentStatus: false,
            paymentTnxId: transactionId,
            paymentMethod,
            status: "Pending",
          },
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.paymentUrl) {
        window.open(response.data.paymentUrl, "_blank");
      }
    } catch (error) {}
  };
  const handleCacheOnDelivery = async () => {
    const hasEmptyField = Object.values(deliveryInfo).some(
      (val) => !val.trim()
    );
    if (hasEmptyField) {
      alert("Please fill out all delivery fields.");
      return;
    }
    try {
      const response = await fetch(`${apiUrl}/order/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          cart: cart,
          user: user._id,
          deliveryInfo,
          paidAmount: calculateTotal(),
          paymentStatus: false,
          paymentTnxId: "No id",
          paymentMethod,
          status: "Pending",
        }),
      });

      if (response.status === 201) {
        const data = await response.json();
        alert(data.message);
        router.push("/success/thanks");
      } else {
        console.error("Order creation failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.sellingPrice * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="container mx-auto  py-6  gap-6 flex justify-center max-w-6xl ">
      <div className=" border p-6 rounded-lg shadow-md bg-white w-full">
        {/* Cart Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaShoppingCart className="text-green-500" />
            Cart Summary
          </h2>
          {cart.length === 0 ? (
            <p className="text-gray-500 italic">Your cart is empty.</p>
          ) : (
            <>
              {" "}
              <ul className="space-y-4">
                {cart.map((item) => (
                  <li
                    key={item._id}
                    className="flex justify-between items-center border-b pb-3"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="relative w-16 h-16">
                        <Image
                          src={item.img}
                          alt={item.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-lg">{item.name}</p>
                        <p className="text-gray-600 text-sm">
                          Quantity: {item.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="font-medium text-lg text-blue-500">
                      ${(item.sellingPrice * item.quantity).toFixed(2)}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-6">
                <p className="font-semibold text-lg">
                  Total: ${calculateTotal()}
                </p>
              </div>
              {/* Delivery Info */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaInfoCircle className="text-purple-500" />
                  Delivery Information
                </h2>
                <form className=" grid grid-cols-2 gap-2">
                  {Object.keys(deliveryInfo).map((key) => (
                    <div key={key} className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        {getIconForField(key)}
                      </span>
                      <input
                        name={key}
                        placeholder={key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
                        className="border border-blue-300 p-3 pl-10 w-full rounded focus:outline-blue-500 "
                        value={deliveryInfo[key]}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  ))}
                </form>
              </div>
              {/* Payment Options */}
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FaCreditCard className="text-yellow-500" />
                  Payment Method
                </h2>
                <div className="flex flex-col gap-y-3">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="AamarPay"
                      checked={paymentMethod === "AamarPay"}
                      onChange={() => setPaymentMethod("AamarPay")}
                      className="form-radio h-4 w-4 text-blue-500"
                    />
                    <span>Pay and Submit</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Cache On Delivery"
                      checked={paymentMethod === "Cache On Delivery"}
                      onChange={() => setPaymentMethod("Cache On Delivery")}
                      className="form-radio h-4 w-4 text-blue-500"
                    />
                    <span>Cash on Delivery</span>
                  </label>
                </div>
              </div>
              {paymentMethod === "AamarPay" && (
                <div>
                  <button
                    className={`px-5 py-3 text-white rounded transition duration-200 ease-in-out ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    onClick={() => handlePaymentByAamarPay()}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Processing..."
                      : "Pay Online and Place Order"}
                  </button>
                </div>
              )}
              {paymentMethod === "Cache On Delivery" && (
                <div>
                  <button
                    className={`px-5 py-3 text-white rounded transition duration-200 ease-in-out ${
                      isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    }`}
                    onClick={() => handleCacheOnDelivery()}
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? "Processing..."
                      : "Cache On Delivery and Place Order"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
const getIconForField = (field: string) => {
  switch (field) {
    case "name":
      return <FaUser className="text-gray-500" />;
    case "email":
      return <FaEnvelope className="text-gray-500" />;
    case "address":
      return <FaHome className="text-gray-500" />;
    case "city":
      return <FaCity className="text-gray-500" />;
    case "postalCode":
      return <FaMapPin className="text-gray-500" />;
    case "phone":
      return <FaPhone className="text-gray-500" />;
    default:
      return null;
  }
};
