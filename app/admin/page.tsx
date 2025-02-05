"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { apiUrl } from "../shared/urls";
import Image from "next/image";

import { IOrder } from "@/types/oder";
import { getStatusColor } from "../utils/statusColor";
import { fetchWithTokenRefresh } from "../shared/fetchWithTokenRefresh";

interface ICounts {
  ordersCount: number;
  productsCount: number;
  categoriesCount: number;
  writersCount: number;
  bannersCount: number;
}

const IndexPage: React.FC = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [counts, setCounts] = useState<ICounts | null>(null);

  const token = localStorage.getItem("accessToken"); // Get the token from localStorage

  useEffect(() => {
    fetch(`${apiUrl}/order/all`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setOrders(data.orders);
      })
      .catch((error) => {
        console.log(error);
        console.error("Error fetching orders:", error);
      });
  }, []); // Empty dependency array to run only once on mount

  useEffect(() => {
    fetch(`${apiUrl}/admin/getOrdersCount`, {
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCounts(data);
      })
      .catch((error) => {
        console.error("Error fetching counts:", error);
      });
  }, []); // Empty dependency array to run only once on mount

  const handleDelete = (orderId: string) => {
    fetchWithTokenRefresh(`${apiUrl}/order/delete/${orderId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    })
      .then((response) => {
        if (response.ok) {
          setOrders((orders) =>
            orders.filter((order) => order._id !== orderId)
          );
        } else {
          console.error("Error deleting order");
        }
      })
      .catch((error) => {
        console.error("Error deleting order:", error);
      });
  };
  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    fetchWithTokenRefresh(`${apiUrl}/order/updateOrderStatus/${orderId}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((response) => {
        if (response.ok) {
          setOrders((orders) =>
            orders.map((order) =>
              order._id === orderId ? { ...order, status: newStatus } : order
            )
          );
        } else {
          console.error("Error updating order status");
        }
      })
      .catch((error) => console.error("Error updating order status:", error));
  };

  return (
    <>
      <div className="container my-4">
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
            <h1 className="font-bold text-xl">Banner</h1>
            <p>{counts?.bannersCount}</p>
          </div>
          <div className="bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-md px-2 py-4 text-center block space-y-3 text-white">
            <h1 className="font-bold text-xl">Banner</h1>
            <p>{counts?.bannersCount}</p>
          </div>
        </div>
      </div>
      {orders?.length > 0 && (
        <div className="container my-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Order List</h1>
          </div>
          <div className="bg-white p-2">
            <table className="table-auto text-left w-full">
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Customers Name</th>
                  <th>Address</th>
                  <th>Phone Number</th>
                  <th>Payment Status</th>
                  <th>Order Status</th>

                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map((order) => (
                  <tr key={order._id}>
                    <td className="p-2">
                      <Image
                        src={order.firstProduct?.photo}
                        width={50}
                        height={50}
                        alt="Photo"
                      />
                    </td>
                    <td className="p-2">{order.customersName}</td>
                    <td className="p-2">{order.address}</td>
                    <td className="p-2">{order.phone}</td>
                    <td className="p-2">{order.paymentStatus}</td>
                    <td className="p-2">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusUpdate(order._id, e.target.value)
                        }
                        className={`border rounded outline-0 px-2 py-1 ${getStatusColor(
                          order.status
                        )}`}
                      >
                        <option className="bg-white text-black" value="Pending">
                          Pending
                        </option>

                        <option
                          className="bg-white text-black"
                          value="Delivered"
                        >
                          Delivered
                        </option>
                        <option
                          className="bg-white text-black"
                          value="Cancelled"
                        >
                          Cancelled
                        </option>
                      </select>
                    </td>

                    <td className="p-2 flex items-center gap-2">
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
};

export default IndexPage;
