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

const Checkout = () => {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [deliveryInfo, setDeliveryInfo] = useState<{
    [key: string]: string;
  }>({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  console.log(deliveryInfo);
  const [paymentMethod, setPaymentMethod] = useState("AamarPay");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const cartData = localStorage.getItem("cartData");
    setCart(cartData ? JSON.parse(cartData) : []);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryInfo({ ...deliveryInfo, [name]: value });
  };

  const result = cart.map((product: any) => ({
    id: product._id,
    priceWhenSubmitOrder: product.price,
    quantity: product.quantity,
  }));

  const handlePaymentByAamarPay = async () => {
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
            cart: result,
            deliveryInfo,
            paidAmount: calculateTotal(),
            paymentStatus: false,
            paymentTnxId: transactionId,
            paymentMethod,
            status: "Pending",
          },
        }
      );

      if (response.data.paymentUrl) {
        window.open(response.data.paymentUrl, "_blank");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCacheOnDelivery = async () => {
    try {
      const response = await axios.post(`${apiUrl}/order/create`, {
        cart: result,
        deliveryInfo,
        paidAmount: calculateTotal(),
        paymentStatus: false,
        paymentTnxId: "No id",
        paymentMethod,
        status: "Pending",
      });

      if (response.status === 201) {
        alert(response.data.message);

        router.push("/success/123");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-6  gap-6 flex justify-center  ">
      <div className=" border p-6 rounded-lg shadow-md bg-white w-2/3">
        <h1 className="text-3xl font-bold mb-6 flex items-center gap-2">
          <FaShoppingCart className="text-blue-500" />
          Checkout
        </h1>

        {/* Cart Summary */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaShoppingCart className="text-green-500" />
            Cart Summary
          </h2>
          {cart.length === 0 ? (
            <p className="text-gray-500 italic">Your cart is empty.</p>
          ) : (
            <ul className="space-y-4">
              {cart.map((item) => (
                <li
                  key={item._id}
                  className="flex justify-between items-center border-b pb-3"
                >
                  <div>
                    <p className="font-medium text-lg">{item.name}</p>
                    <p className="text-gray-600 text-sm">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium text-lg text-blue-500">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <div className="mt-6">
            <p className="font-semibold text-lg">Total: ${calculateTotal()}</p>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FaInfoCircle className="text-purple-500" />
            Delivery Information
          </h2>
          <form className="space-y-4">
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
              {isSubmitting ? "Processing..." : "Pay Online and Place Order"}
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
