"use client";
import Image from "next/image";
import React, { useState } from "react";
import { apiUrl } from "@/app/shared/urls";
import { useRouter } from "next/navigation";
import { IProduct } from "@/types/product";

interface CheckoutClientProps {
  product: IProduct;
  settings: any;
  variantPrice: number;
  variantTitle: string;
}

const CheckoutClient: React.FC<CheckoutClientProps> = ({
  product,
  settings,
  variantPrice,
  variantTitle,
}) => {
  const router = useRouter(); // Initialize the router
  const [shippingCost, setShippingCost] = useState<number>(
    product.shippingInside
  ); // Default shipping cost
  const [selectedShipping, setSelectedShipping] = useState<string>(
    settings?.shippingInside
  );

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    location: "",
  });
  const [selectedDeliveryOption, setSelectedDeliveryOption] =
    useState<string>("1");

  const handleShippingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSelectedShipping(value);
    setShippingCost(
      value === settings?.shippingInside
        ? product?.shippingInside
        : product?.shippingOutside
    );
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Prepare data to send
    const postData = {
      ...formData,
      product: product._id,
      shippingCost,
      selectedShipping,
      selectedDeliveryOption,
      totalPrice: (variantPrice ? variantPrice : product.price) + shippingCost,
    };
    console.log("This is total price", postData.totalPrice);
    try {
      const response = await fetch(`${apiUrl}/order/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      if (response.ok) {
        // Serialize the order data
        const serializedOrder = encodeURIComponent(JSON.stringify(data.order));

        // Navigate to the success page with serialized data
        router.push(`/checkout/successOrder?order=${serializedOrder}`);
      }
    } catch (error) {
      console.error("Error posting data:", error);
      // Handle error (e.g., show an error message)
    }
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  // Calculate total price

  const itemPrice = variantPrice ? variantPrice : product.price;

  const totalPrice = itemPrice + shippingCost;

  return (
    <div>
      <div className="my-4 max-w-screen-sm rounded-md mx-auto bg-white p-4">
        <h2 className="text-xl mb-4 font-bold">Checkout</h2>
        <div className="flex flex-col">
          <div className="flex items-center border-b pb-2 mb-4">
            <Image
              src={product.photo} // Use product image
              width={100}
              height={100}
              alt="Item"
              className="w-16 h-16"
            />

            <div>
              <div className="ml-2 font-bold text-xl">
                <p>
                  {product?.title}
                  {variantTitle && <span>- {variantTitle}</span>}
                </p>
              </div>
              <div className="flex flex-col ml-2">
                <div className="flex items-center ">
                  <p className="text-sm text-gray-500 mr-2">
                    Price: {settings?.currencySymbol}{" "}
                    {variantPrice > 0
                      ? variantPrice
                      : new Intl.NumberFormat().format(itemPrice)}
                  </p>
                  <p className="text-sm text-gray-500"> Quantity 1</p>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping */}
          <div className="grid md:items-center grid-cols-1 md:grid-cols-2 w-full border-b pb-4 mb-4">
            <p className="text-base font-semibold">Shipping</p>
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
              <label
                className={`w-full items-center border p-2 rounded-md ${
                  selectedShipping === settings?.shippingInside
                    ? "bg-main text-white"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  value={settings?.shippingInside}
                  checked={selectedShipping === settings?.shippingInside}
                  onChange={handleShippingChange}
                  className="hidden"
                />
                <span>
                  {settings?.shippingInside} {settings?.currencySymbol}{" "}
                  {new Intl.NumberFormat().format(product?.shippingInside)}
                </span>
              </label>
              <label
                className={`w-full flex items-center border p-2 rounded-md ${
                  selectedShipping === settings.shippingOutside
                    ? "bg-main text-white"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  value={settings.shippingOutside}
                  checked={selectedShipping === settings.shippingOutside}
                  onChange={handleShippingChange}
                  className="hidden"
                />
                <span>
                  {settings?.shippingOutside} {settings?.currencySymbol}{" "}
                  {new Intl.NumberFormat().format(product?.shippingOutside)}
                </span>
              </label>
            </div>
          </div>

          {/* Total */}
          <div className="grid md:items-center grid-cols-1 md:grid-cols-2 w-full border-b pb-4 mb-4">
            <p className="text-base font-semibold">Total</p>
            <div>
              <p className="mb-1">
                Shipping Cost: {settings?.currencySymbol}{" "}
                {new Intl.NumberFormat().format(shippingCost)}
              </p>
              <p>
                Total Price: {settings?.currencySymbol}{" "}
                {new Intl.NumberFormat().format(totalPrice)}
              </p>
            </div>
          </div>

          {/* Delivery Method */}
          <div className="w-full gap-2 mb-5 border-b pb-5">
            <h1 className="text-base font-semibold mb-2">Delivery Method</h1>
            <div className="grid grid-cols-2 gap-2">
              <label
                htmlFor="delivery1"
                className={`border rounded-md p-2 ${
                  selectedDeliveryOption === "1" ? "bg-main text-white" : ""
                }`}
                onClick={() => setSelectedDeliveryOption("1")}
              >
                <input
                  type="radio"
                  id="delivery1"
                  value="1"
                  name="delivery"
                  checked={selectedDeliveryOption === "1"}
                  onChange={() => setSelectedDeliveryOption("1")}
                  className="hidden"
                />
                <h2 className="font-bold text-sm">
                  {settings?.deliveryMethod1}
                </h2>
                <p className="text-xs">{settings?.deliveryTime1}</p>
              </label>
              <label
                htmlFor="delivery2"
                className={`border rounded-md p-2 ${
                  selectedDeliveryOption === "2" ? "bg-main text-white" : ""
                }`}
                onClick={() => setSelectedDeliveryOption("2")}
              >
                <input
                  type="radio"
                  id="delivery2"
                  value="2"
                  name="delivery"
                  checked={selectedDeliveryOption === "2"}
                  onChange={() => setSelectedDeliveryOption("2")}
                  className="hidden"
                />
                <h2 className="font-bold text-sm">
                  {settings?.deliveryMethod2}
                </h2>
                <p className="text-xs">{settings?.deliveryTime2}</p>
              </label>
            </div>
          </div>

          {/* Address */}
          <form onSubmit={handleSubmit}>
            <p className="text-base mb-2 font-semibold">Address</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <p>Name</p>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="border p-2 mt-2 w-full outline-none"
                />
              </div>
              <div className="mb-4">
                <p>Phone Number</p>
                <input
                  type="number"
                  name="phoneNumber"
                  placeholder="Phone Number"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="border p-2 mt-2 w-full outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="mb-4">
                <p>Address</p>
                <textarea
                  name="address"
                  placeholder="Address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="border p-2 mt-2 w-full outline-none"
                  rows={2}
                />
              </div>
              <div className="mb-4">
                <p>Location</p>
                <textarea
                  name="location"
                  placeholder="Location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="border p-2 mt-2 w-full outline-none"
                  rows={2}
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-main text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CheckoutClient;
