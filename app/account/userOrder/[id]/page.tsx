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
  const id = useParams().id;

  const {
    data: order,
    error,
    isLoading,
  } = useSWR<any>(id ? `${apiUrl}/user/getSingleOrder/${id}` : null, fetcher);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching order? details: {error.message}</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Order Details</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Products</h2>
        {order?.cart.map((product: any) => (
          <div key={product._id} className="border rounded p-4 mb-4">
            <Image
              src={product.img}
              alt={product.title}
              height={120}
              width={120}
              className="w-32 h-32 object-cover rounded mb-2"
            />
            <p>
              <strong>Title:</strong> {product.title}
            </p>
            <p>
              <strong>Price:</strong> ${product.price}
            </p>
            <p>
              <strong>Stock Status:</strong> {product.stockStatus}
            </p>
            <p>
              <strong>Commission for Seller:</strong> $
              {product.commissionForSeller}
            </p>
          </div>
        ))}
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold">Order Info</h2>
        <p>
          <strong>Shipping Cost:</strong> ${order?.shippingCost}
        </p>
        <p>
          <strong>Total Price:</strong> ${order?.totalPrice}
        </p>
        <p>
          <strong>Shipping Option:</strong> {order?.selectedShipping}
        </p>
        <p>
          <strong>Delivery Option:</strong> {order?.selectedDeliveryOption}
        </p>
        <p>
          <strong>Status:</strong> {order?.status}
        </p>
        <p>
          <strong>Payment Method:</strong>{" "}
          {order?.paymentMethod === "mobilePay" && "Mobile Pay"}
          {order?.paymentMethod === "stripe" && "Stripe"}
          {order?.paymentMethod === "onCache" && "On Cache"}
        </p>
        <p>
          <strong>Transaction ID:</strong> {order?.transactionId}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(order?.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Updated At:</strong>{" "}
          {new Date(order?.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default OrderDetails;
