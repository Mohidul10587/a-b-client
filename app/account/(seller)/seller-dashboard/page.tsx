"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { apiUrl } from "@/app/shared/urls";

import useSWR from "swr";
import LoadingComponent from "@/components/loading";

const IndexPage: React.FC = () => {
  const [orders, setOrders] = useState<any>({});

  const { data, error, isLoading, mutate } = useSWR(
    `${apiUrl}/sellerOrder`,
    fetcher
  );

  useEffect(() => {
    if (data) {
      setOrders(data.orders);
    }
  }, [data]);

  const handleDelete = (orderId: string) => {
    fetch(`${apiUrl}/order/delete/${orderId}`, {
      credentials: "include",
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setOrders((orders: any) =>
            orders.filter((order: any) => order._id !== orderId)
          );
        } else {
          console.error("Error deleting order");
        }
      })
      .catch((error) => {
        console.error("Error deleting order:", error);
      });
  };

  const handleStatusUpdate = (
    orderId: string,
    newStatus: any,
    previousStatus: any
  ) => {
    if (
      previousStatus === "Delivered" &&
      (newStatus === "Approved" ||
        newStatus === "Pending" ||
        newStatus === "Shipped")
    ) {
      alert("Product already delivered");
      return;
    }

    fetch(`${apiUrl}/sellerOrder/updateStatusBySeller/${orderId}`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (response.ok) {
          mutate();
          setOrders((orders: any) =>
            orders.map((order: any) =>
              order._id === orderId ? { ...order, status: newStatus } : order
            )
          );
        } else {
          console.error("Error updating order status");
        }
      })
      .catch((error) => console.error("Error updating order status:", error));
  };
  if (isLoading) {
    return <LoadingComponent />;
  }
  const {
    totalPendingOrder,
    totalApprovedOrder,
    totalShippedOrder,
    totalCanceledOrder,
    totalDeliveredOrder,
    totalOrderNumber,
    totalProductsNumber,
  } = data;

  return (
    <>
      <div className="container my-4">
        <div className="my-4">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            <div className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-md px-2 py-4 text-center block space-y-3 text-white">
              <h1 className="font-bold text-xl">Approved Orders</h1>
              <p className="text-3xl">{totalApprovedOrder}</p>
            </div>
            <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md px-2 py-4 text-center block space-y-3 text-white">
              <h1 className="font-bold text-xl">Delivered Orders</h1>
              <p className="text-3xl">{totalDeliveredOrder}</p>
            </div>
            <div className="bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-md px-2 py-4 text-center block space-y-3 text-white">
              <h1 className="font-bold text-xl">Pending Orders</h1>
              <p className="text-3xl">{totalPendingOrder}</p>
            </div>
            <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-md px-2 py-4 text-center block space-y-3 text-white">
              <h1 className="font-bold text-xl">Canceled Orders</h1>
              <p className="text-3xl">{totalCanceledOrder}</p>
            </div>
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-900 rounded-md px-2 py-4 text-center block space-y-3 text-white">
              <h1 className="font-bold text-xl">Shipped Orders</h1>
              <p className="text-3xl">{totalShippedOrder}</p>
            </div>
            <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-md px-2 py-4 text-center block space-y-3 text-white">
              <h1 className="font-bold text-xl">Total Orders</h1>
              <p className="text-3xl">{totalOrderNumber}</p>
            </div>
            <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-md px-2 py-4 text-center block space-y-3 text-white">
              <h1 className="font-bold text-xl">Total Products</h1>
              <p className="text-3xl">{totalProductsNumber}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Order List</h1>
        </div>
        {orders.length > 0 ? (
          <div className="bg-white p-2">
            <table className="table-auto text-left w-full">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Address</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                  <th>Actions</th>
                  <th>Time</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order._id}>
                    <td className="p-2">
                      <Image
                        src={order.products[0]?.photo || "/default.jpg"}
                        width={50}
                        height={50}
                        alt="Photo"
                        unoptimized
                      />
                    </td>
                    <td className="p-2">{order.name}</td>
                    <td className="p-2">{order.address}</td>
                    <td className="p-2">{order.phone}</td>

                    <td className="p-2">
                      <Link
                        href={`/account/order/${order._id}`}
                        className="p-1 bg-main font-bold rounded-md text-white text-center w-full"
                      >
                        Details
                      </Link>
                      {/* <button
                        onClick={() => handleDelete(order._id)}
                        className="bg-red-500 text-white p-1 w-full font-bold rounded-md"
                      >
                        Delete
                      </button> */}
                    </td>
                    <td>
                      {formatDateTime(order.createdAt).time} <br />{" "}
                      {formatDateTime(order.createdAt).date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center">No order </div>
        )}
      </div>
    </>
  );
};

export default IndexPage;

function formatDateTime(isoDateString: string) {
  const date = new Date(isoDateString);

  // Extract components
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" }); // Full month name
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const amPm = hours >= 12 ? "PM" : "AM";

  // Convert to 12-hour format
  hours = hours % 12 || 12;

  // Format the output
  return {
    date: `${day}-${month}-${year}`,
    time: `${hours}:${minutes} ${amPm}`,
  };
}
// SWR fetcher function
const fetcher = async (url: string) => {
  const response = await fetch(url, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch data");
  }
  return response.json();
};
