"use client";
import Image from "next/image";
import React from "react";
import useSWR from "swr";
import { fetcher } from "@/app/shared/fetcher";

const OrderDetails: React.FC<{ id: string }> = ({ id }) => {
  const {
    data: order,
    error,
    isLoading,
  } = useSWR(id ? `order/getSingleOrder/${id}` : null, fetcher);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load order details.</p>;
  if (!order) return <p>No order found.</p>;
  const {
    deliveryInfo,
    _id,
    cart,
    paymentMethod,
    status,
    createdAt,
    paymentStatus,
    paymentTnxId,
  } = order;
  
  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center">
            Order Details
          </h1>
          <span
            className={`${
              order.status === "Pending"
                ? "bg-yellow-100 text-yellow-700"
                : order.status === "Shipped"
                ? "bg-blue-100 text-blue-700"
                : order.status === "Delivered"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            } px-3 py-1 rounded-full font-medium text-sm`}
          >
            {order.status}
          </span>
        </div>

        {/* Delivery Info */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Delivery Info
          </h2>
          <div className="text-gray-600">
            <p>
              <span className="font-medium">Name:</span> {deliveryInfo.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {deliveryInfo.email}
            </p>
            <p>
              <span className="font-medium">Address:</span>{" "}
              {deliveryInfo.address}, {deliveryInfo.city},{" "}
              {deliveryInfo.postalCode}
            </p>
            <p>
              <span className="font-medium">Phone:</span> {deliveryInfo.phone}
            </p>
          </div>
        </div>

        {/* Cart Items */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Cart Items
          </h2>
          <div className="space-y-4">
            {cart.map((item: any) => (
              <div
                key={item._id}
                className="flex items-center gap-4 p-4 border rounded-md bg-gray-50"
              >
                <Image
                  src={item.img}
                  alt={item.title}
                  height={64}
                  width={64}
                  className="w-16 h-16 object-cover rounded-md border"
                />
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{item.title}</p>
                </div>
                <div className="text-gray-600 font-medium">
                  Quantity: {item.quantity}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment and Status */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Order Summary
          </h2>
          <div className="text-gray-600">
            <p>
              <span className="font-medium">Payment Method:</span>{" "}
              {paymentMethod}
            </p>
            <p>
              <span className="font-medium">Status:</span> {status}
            </p>
            <p>
              <span className="font-medium">Order ID:</span> {_id}
            </p>
            <p>
              <span className="font-medium">Order payment Status:</span>{" "}
              {paymentStatus ? "Paid" : "Unpaid"}
            </p>
            <p>
              <span className="font-medium">Order payment TnxId:</span>{" "}
              {paymentTnxId}
            </p>
            ,
            <p>
              <span className="font-medium">Created At:</span>{" "}
              {new Date(createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
