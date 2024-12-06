"use client";

import Image from 'next/image';
import React, { useState } from 'react';
import Location from './Location';

const Checkout: React.FC = () => {
  const [shippingCost, setShippingCost] = useState<number>(50); // Default shipping cost
  const [selectedShipping, setSelectedShipping] = useState<string>('insideDhaka');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phoneNumber: ''
  });
  const [selectedOption, setSelectedOption] = useState<string>("1");

  const handleShippingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSelectedShipping(value);
    setShippingCost(value === 'insideDhaka' ? 50 : 100);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Handle form submission logic here
  };

  // Calculate total price
  const itemPrice = 100; // Example item price
  const totalPrice = itemPrice + shippingCost;

  return (
    <div className="my-4 max-w-screen-sm rounded-md mx-auto bg-white p-4">
      <h2 className="text-xl mb-4 font-bold">Checkout</h2>
      <div className="flex flex-col">
        <div className="flex items-center border-b pb-2 mb-4">
          <Image
            src="/product/1.jpg"
            width={100}
            height={100}
            alt="Item"
            className="w-16 h-16"
          />
          <div className="flex flex-col ml-2">
            <p className="md:text-lg text-sm font-semibold line-clamp-1">Oppo A78, 8GB/256GB</p>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-500">Price KSh: {itemPrice}</p>
              <p className="text-sm text-gray-500">Quantity 1</p>
            </div>
          </div>
        </div>

        {/* Shipping */}
        <div className="grid md:items-center grid-cols-1 md:grid-cols-2 w-full border-b pb-4 mb-4">
          <p className="text-base font-semibold">Shipping</p>
          <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
            <label className={`w-full items-center border p-2 rounded-md ${selectedShipping === 'insideDhaka' ? 'bg-main text-white' : ''}`}>
              <input
                type="radio"
                value="insideDhaka"
                checked={selectedShipping === 'insideDhaka'}
                onChange={handleShippingChange}
                className="hidden"
              />
              <span>Inside Dhaka Ksh: 50</span>
            </label>
            <label className={`w-full flex items-center border p-2 rounded-md ${selectedShipping === 'outsideDhaka' ? 'bg-main text-white' : ''}`}>
              <input
                type="radio"
                value="outsideDhaka"
                checked={selectedShipping === 'outsideDhaka'}
                onChange={handleShippingChange}
                className="hidden"
              />
              <span>Outside Dhaka Ksh: 100</span>
            </label>
          </div>
        </div>

        {/* Total */}
        <div className="grid md:items-center grid-cols-1 md:grid-cols-2 w-full border-b pb-4 mb-4">
          <p className="text-base font-semibold">Total</p>
          <div>
            <p className="mb-1">Shipping Cost: Ksh: {shippingCost}</p>
            <p>Total Price: Ksh: {totalPrice}</p>
          </div>
        </div>

        {/* Delivery Method */}
        <div className="w-full gap-2 mb-5 border-b pb-5">
          <h1 className="text-base font-semibold mb-2">Delivery Method</h1>
          <div className="grid grid-cols-2 gap-2">
            <label
              htmlFor="delivery1"
              className={`border rounded-md p-2 ${selectedOption === "1" ? 'bg-main text-white' : ''}`}
              onClick={() => setSelectedOption("1")}
            >
              <input
                type="radio"
                id="delivery1"
                value="1"
                name="delivery"
                checked={selectedOption === "1"}
                onChange={() => setSelectedOption("1")}
                className="hidden"
              />
              <h2 className="font-bold text-sm">Delivery to your home or office</h2>
              <p className="text-xs">Delivered between Same day delivery</p>
            </label>
            <label
              htmlFor="delivery2"
              className={`border rounded-md p-2 ${selectedOption === "2" ? 'bg-main text-white' : ''}`}
              onClick={() => setSelectedOption("2")}
            >
              <input
                type="radio"
                id="delivery2"
                value="2"
                name="delivery"
                checked={selectedOption === "2"}
                onChange={() => setSelectedOption("2")}
                className="hidden"
              />
              <h2 className="font-bold text-sm">Pickup Station</h2>
              <p className="text-xs">Ready to pickup between Same day delivery</p>
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
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="border p-2 mt-2 w-full outline-none"
              />
            </div>
          </div>
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

          <Location
            items={[
              {
                name: "City Name 1",
                areas: [
                  { name: "Area 1" },
                  { name: "Area 2", selected: true },
                  { name: "Area 3" },
                ],
              },
              {
                name: "City Name 2",
                areas: [
                  { name: "Area 4" },
                  { name: "Area 5" },
                  { name: "Area 6" },
                ],
              },
              // Add more cities as needed
            ]}
          />

          <button type="submit" className="bg-main text-white px-4 py-2 rounded-md">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
