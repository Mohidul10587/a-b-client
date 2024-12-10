"use client";

import { apiUrl } from "@/app/shared/urls";
import { useEffect, useState } from "react";

const Checkout = () => {
  const [cart, setCart] = useState<any[]>([]);
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load cart data from localStorage
  useEffect(() => {
    const cartData = localStorage.getItem("cartData");

    setCart(cartData ? JSON.parse(cartData) : []);
  }, []);

  // Handle form updates
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDeliveryInfo({ ...deliveryInfo, [name]: value });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaymentMethod(e.target.value);
  };

  const result = cart.map((product: any) => ({
    id: product._id,
    quantity: product.quantity,
  }));

  // Handle checkout using fetch
  const handleCheckout = async () => {
    setIsSubmitting(true);

    try {
      const payload = {
        cart: result,
        deliveryInfo,
        paymentMethod,
      };

      console.log("Payload:", payload);

      // Make a POST request to submit the order
      const response = await fetch(`${apiUrl}/order/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit order");
      }

      const data = await response.json();
      console.log("Server response:", data);

      alert("Order placed successfully!");

      // // Clear cart after successful order placement
      // localStorage.removeItem("cartData");
      // setCart([]);
    } catch (error) {
      console.error("Error submitting order:", error);
      alert("There was a problem submitting your order.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateTotal = () => {
    return cart
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      {/* Cart Summary */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Cart Summary</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <ul className="space-y-2">
            {cart.map((item) => (
              <li key={item._id} className="flex justify-between border-b py-2">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <p className="font-medium">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>
        )}
        <div className="mt-4">
          <p className="font-semibold">Total: ${calculateTotal()}</p>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Delivery Information</h2>
        <form className="space-y-2">
          <input
            name="name"
            placeholder="Full Name"
            className="border p-2 w-full"
            value={deliveryInfo.name}
            onChange={handleInputChange}
          />
          <input
            name="email"
            placeholder="Email"
            className="border p-2 w-full"
            value={deliveryInfo.email}
            onChange={handleInputChange}
          />
          <input
            name="address"
            placeholder="Address"
            className="border p-2 w-full"
            value={deliveryInfo.address}
            onChange={handleInputChange}
          />
          <input
            name="city"
            placeholder="City"
            className="border p-2 w-full"
            value={deliveryInfo.city}
            onChange={handleInputChange}
          />
          <input
            name="postalCode"
            placeholder="Postal Code"
            className="border p-2 w-full"
            value={deliveryInfo.postalCode}
            onChange={handleInputChange}
          />
          <input
            name="phone"
            placeholder="Phone Number"
            className="border p-2 w-full"
            value={deliveryInfo.phone}
            onChange={handleInputChange}
          />
        </form>
      </div>

      {/* Payment Options */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Payment Method</h2>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="paymentMethod"
            value="creditCard"
            checked={paymentMethod === "creditCard"}
            onChange={handlePaymentChange}
          />
          <span className="ml-2">Credit Card</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="paymentMethod"
            value="paypal"
            checked={paymentMethod === "paypal"}
            onChange={handlePaymentChange}
          />
          <span className="ml-2">PayPal</span>
        </label>
        <label className="inline-flex items-center">
          <input
            type="radio"
            name="paymentMethod"
            value="cashOnDelivery"
            checked={paymentMethod === "cashOnDelivery"}
            onChange={handlePaymentChange}
          />
          <span className="ml-2">Cash on Delivery</span>
        </label>
      </div>

      <div className="text-right">
        <button
          className={`px-4 py-2 bg-blue-500 text-white rounded ${
            isSubmitting ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleCheckout}
          disabled={isSubmitting}
        >
          {isSubmitting ? "Processing..." : "Place Order"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
