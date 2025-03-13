"use client";
import { apiUrl } from "@/app/shared/urls";
import Image from "next/image";
import React from "react";

import { IOrder } from "@/types/oder";
import { useParams } from "next/navigation";
import useSWR from "swr";
import { useData } from "@/app/DataContext";

const fetcher = async (url: string) => {
  const response = await fetch(url, {
    method: "GET",
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch");
  }
  return response.json();
};

const OrderDetails = () => {
  const { settings } = useData();
  const router = useParams();
  const id = router.id;

  const {
    data: order,
    error,
    isLoading,
  } = useSWR<any>(
    id ? `${apiUrl}/sellerOrder/getSingleOrder/${id}` : null,
    fetcher
  );

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching order details: {error.message}</p>;

  return (
    <div>
      {order ? (
        <div className="container mx-auto p-6 space-y-8">
          {/* Delivery Info Section */}
          <section className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">
              Delivery Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-700">
                  <strong>Name:</strong> {order.name}
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> {order.address}
                </p>
                <p className="text-gray-700">
                  <strong>Phone Number:</strong> {order.phone}
                </p>
              </div>
              <div>
                <p className="text-gray-700">
                  <strong>Selected Shipping:</strong> {order.shippingMethod}
                </p>

                <p className="text-gray-700">
                  <strong>Payment Method:</strong>{" "}
                  {order.paymentMethod === "mobilePay" && "Mobile Pay"}
                  {order.paymentMethod === "stripe" && "Stripe"}
                  {order.paymentMethod === "onCache" && "On Cache"}
                </p>
                <p className="text-gray-700">
                  <strong>Transaction Id:</strong> {order.transactionId}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <p className="text-gray-700">
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    order.status === "Delivered"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {order.status}
                </span>
              </p>
            </div>
          </section>

          {/* Products Section */}
          <section className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-semibold mb-4">Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {order.products.map((product: any, index: number) => (
                <div
                  key={index}
                  className="p-4 border rounded-lg shadow-sm bg-gray-50 flex flex-col items-center"
                >
                  <div className="relative w-32 h-32 mb-4">
                    <Image
                      src={product.photo}
                      alt={product.title}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-center mb-2">
                    {product.title}
                  </h3>
                  <p className="text-gray-600">
                    Price:{" "}
                    <span className="text-gray-800 font-medium">
                      ${product.price}
                    </span>
                  </p>
                  <p
                    className={`text-sm ${
                      product.stockStatus === "In Stock"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {product.stockStatus}
                  </p>
                  <p className="text-gray-600">
                    Seller ID:{" "}
                    <span className="text-gray-800">{product.seller}</span>
                  </p>
                  <p className="text-gray-600">
                    Commission for Seller:{" "}
                    <span className="text-gray-800">
                      {product.commissionForSeller}%
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <p>No order found.</p>
      )}
    </div>
  );
};

export default OrderDetails;
