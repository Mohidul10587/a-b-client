"use client";
import { apiUrl } from "@/app/shared/urls";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useSettings } from "@/app/context/AppContext";
import { formatDate } from "@/app/shared/formateTime";
import { IOrder } from "@/types/oder";
import { fetchWithTokenRefresh } from "@/app/shared/fetchWithTokenRefresh";

const OrderDetails: React.FC<{ id: string }> = ({ id }) => {
  const [order, setOrder] = useState<IOrder | null>(null);
  const settings = useSettings();
  useEffect(() => {
    if (id) {
      const fetchOrder = async () => {
        const token = localStorage.getItem("accessToken");
        try {
          const response = await fetchWithTokenRefresh(
            `${apiUrl}/order/getSingleOrder/${id}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const data = await response.json();
          setOrder(data);
        } catch (error) {
          console.error("Error fetching order details:", error);
        }
      };

      fetchOrder();
    }
  }, [id]);

  if (!order) {
    return <p>Loading...</p>;
  }

  return (
    <div className="max-w-2xl mx-auto my-12">
      <div className="bg-white p-4">
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

        <ul className="list-disc ml-6 block space-y-2 my-6">
          <li>
            Order number: <strong>{order._id}</strong>
          </li>
          <li>
            Date: <strong>{formatDate(order.createdAt)}</strong>
          </li>
          <li>Name: {order.name}</li>
          <li>Address: {order.address}</li>
          <li>Location: {order.location}</li>
          <li>Phone Number: {order.phoneNumber}</li>
        </ul>
        <table className="w-full border text-left">
          <thead>
            <tr>
              <th className="p-2 border">Product</th>
              <th className="p-2 border">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr className="p-2 border">
              <td className="p-2 border">
                <div className="flex items-center">
                  <Image
                    src={order.product.photo}
                    width={50}
                    height={50}
                    alt={order.product.title}
                    className="w-10 h-10 object-cover rounded-md mr-2"
                  />
                  <div>
                    <p className="font-semibold text-sm line-clamp-1">
                      {order.product.title} <strong>×&nbsp;1</strong>
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {order.product.stockStatus}
                    </p>
                  </div>
                </div>
              </td>
              <td className="p-2 border">
                {settings?.currencySymbol} {order.totalPrice}
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <th scope="row" className="p-2 border">
                Subtotal:
              </th>
              <td className="p-2 border">
                {settings?.currencySymbol}{" "}
                {order.totalPrice - order.shippingCost}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-2 border">
                Shipping:
              </th>
              <td className="p-2 border">
                {settings?.currencySymbol} {order.shippingCost}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-2 border">
                Payment method:
              </th>
              <td className="p-2 border">Cash on delivery</td>
            </tr>
            <tr>
              <th scope="row" className="p-2 border">
                Shipping Method:
              </th>
              <td className="p-2 border">{order.selectedShipping}</td>
            </tr>
            <tr>
              <th scope="row" className="p-2 border">
                Delivery Option:
              </th>
              <td className="p-2 border">
                {order.selectedDeliveryOption === "1"
                  ? "Standard Delivery"
                  : "Express Delivery"}
              </td>
            </tr>
            <tr>
              <th scope="row" className="p-2 border">
                Total:
              </th>
              <td className="p-2 border">
                {settings?.currencySymbol} {order.totalPrice}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};

export default OrderDetails;
