"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiUrl } from "../shared/urls";
import Image from "next/image";
import { getStatusColor } from "../utils/statusColor";
import { fetcher } from "../shared/fetcher";
import useSWR from "swr";

interface ICounts {
  ordersCount: number;
  productsCount: number;
  categoriesCount: number;
  writersCount: number;
  publishersCount: number;
  usersCount: number;
}

const IndexPage: React.FC = () => {
  const { data, error, isLoading, mutate } = useSWR(
    `order/allForAdmin`,
    fetcher
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching orders</div>;

  const orders = data?.orders || [];
  const counts = data?.counts || null;

  const handleDelete = (orderId: string) => {
    fetch(`${apiUrl}/order/delete/${orderId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          mutate();
        } else {
          console.error("Error deleting order");
        }
      })
      .catch((error) => {
        console.error("Error deleting order:", error);
      });
  };
  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    fetch(`${apiUrl}/order/updateOrderStatus/${orderId}`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (response.ok) {
          mutate();
        } else {
          console.error("Error updating order status");
        }
      })
      .catch((error) => console.error("Error updating order status:", error));
  };

  return (
    <>
      <div className="container my-4 px-2 sm:px-4">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 rounded-md px-2 py-4 text-center block space-y-3 text-white">
            <h1 className="font-bold text-xl">Orders</h1>
            <p>{counts?.ordersCount}</p>
          </div>
          <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-md px-2 py-4 text-center block space-y-3 text-white">
            <h1 className="font-bold text-xl">Products</h1>
            <p>{counts?.productsCount}</p>
          </div>
          <div className="bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-md px-2 py-4 text-center block space-y-3 text-white">
            <h1 className="font-bold text-xl">Category</h1>
            <p>{counts?.categoriesCount}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-600 to-violet-600 rounded-md px-2 py-4 text-center block space-y-3 text-white">
            <h1 className="font-bold text-xl">Writers</h1>
            <p>{counts?.writersCount}</p>
          </div>
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-900 rounded-md px-2 py-4 text-center block space-y-3 text-white">
            <h1 className="font-bold text-xl">Publishers</h1>
            <p>{counts?.publishersCount}</p>
          </div>
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-900 rounded-md px-2 py-4 text-center block space-y-3 text-white">
            <h1 className="font-bold text-xl">Users</h1>
            <p>{counts?.usersCount}</p>
          </div>
        </div>
      </div>
      {orders?.length > 0 && (
        <div className="container my-4 px-2 sm:px-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Order List</h1>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block bg-white p-2 rounded shadow">
            <table className="table-auto text-left w-full border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 border">Image</th>
                  <th className="p-2 border">Customers Name</th>
                  <th className="p-2 border">Address</th>
                  <th className="p-2 border">Phone Number</th>
                  <th className="p-2 border">Payment Status</th>
                  <th className="p-2 border">Order Status</th>
                  <th className="p-2 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order._id} className="border-t">
                    <td className="p-2 border">
                      <Image
                        src={order.firstProduct.img || "/default.jpg"}
                        width={50}
                        height={50}
                        alt="Photo"
                        className="rounded"
                        unoptimized
                      />
                    </td>
                    <td className="p-2 border">{order.customersName}</td>
                    <td className="p-2 border">{order.address}</td>
                    <td className="p-2 border">{order.phone}</td>
                    <td className="p-2 border">{order.paymentStatus}</td>
                    <td className="p-2 border">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusUpdate(order._id, e.target.value)
                        }
                        className={`border rounded outline-0 px-2 py-1 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="p-2 border">
                      <div className="flex gap-2">
                        <Link
                          href={`/admin/order/${order._id}`}
                          className="p-2 bg-main font-bold rounded-md text-white text-center w-full"
                        >
                          Details
                        </Link>
                        <button
                          onClick={() => handleDelete(order._id)}
                          className="bg-red-500 text-white p-2 w-full font-bold rounded-md"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {orders.map((order: any) => (
              <div
                key={order._id}
                className="bg-white shadow rounded-md p-4 flex flex-col gap-2"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={order.firstProduct.img || "/default.jpg"}
                    width={60}
                    height={60}
                    alt="Product"
                    className="rounded"
                    unoptimized
                  />
                  <div>
                    <p className="font-bold">{order.customersName}</p>
                    <p className="text-sm text-gray-600">{order.phone}</p>
                  </div>
                </div>
                <p>
                  <span className="font-semibold">Address:</span>{" "}
                  {order.address}
                </p>
                <p>
                  <span className="font-semibold">Payment:</span>{" "}
                  {order.paymentStatus}
                </p>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Status:</span>
                  <select
                    value={order.status}
                    onChange={(e) =>
                      handleStatusUpdate(order._id, e.target.value)
                    }
                    className={`border rounded outline-0 px-2 py-1 ${getStatusColor(
                      order.status
                    )}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="flex gap-2 mt-2">
                  <Link
                    href={`/admin/order/${order._id}`}
                    className="flex-1 bg-main text-white font-bold rounded-md py-2 text-center"
                  >
                    Details
                  </Link>
                  <button
                    onClick={() => handleDelete(order._id)}
                    className="flex-1 bg-red-500 text-white font-bold rounded-md py-2"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default IndexPage;
