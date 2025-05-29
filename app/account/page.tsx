"use client";
import React from "react";
import Link from "next/link";
import { apiUrl } from "../shared/urls";
import Image from "next/image";

import { getStatusColor } from "../utils/statusColor";
import { useData } from "../DataContext";
import useSWR from "swr";
import { fetcher } from "../shared/fetcher";

const IndexPage: React.FC = () => {
  const { sessionStatus } = useData();
  const { data, error, isLoading } = useSWR(`user/allOrdersOfUser`, fetcher);

  const orders = data?.orders || [];

  if (sessionStatus === "loading" || isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    
    return <p>Error fetching orders. Please try again later.</p>;
  }

  return (
    <>
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
                  <th>Name</th>
                  <th>Address</th>
                  <th>Phone Number</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order._id}>
                    <td className="p-2">
                      <Image
                        src={order.cart[0]?.img || "/default.jpg"}
                        width={50}
                        height={50}
                        alt="Photo"
                        unoptimized
                      />
                    </td>
                    <td className="p-2">{order.deliveryInfo.name}</td>
                    <td className="p-2">{order.deliveryInfo.address}</td>
                    <td className="p-2">{order.deliveryInfo.phone}</td>
                    <td className={`p-1 text-${getStatusColor(order.status)}`}>
                      <span className={`p-1 ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>

                    <td className="p-2 ">
                      <Link
                        href={`/account/order/${order._id}`}
                        className="p-2 bg-main font-bold rounded-md text-white text-center w-full"
                      >
                        Details
                      </Link>
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
