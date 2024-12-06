"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useSettings } from "@/app/context/AppContext";
import { IOrder } from "@/types/oder";
import { formatDate } from "@/app/shared/formateTime";
import LoadingComponent from "@/components/loading";

const SuccessOrder = () => {
  const [order, setOrder] = useState<IOrder | null>(null);
  const settings = useSettings();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const orderData = params.get("order");

    if (orderData) {
      // Deserialize the order data
      const parsedOrder = JSON.parse(decodeURIComponent(orderData)) as IOrder;
      setOrder(parsedOrder);
    }
  }, []);

  if (!order) {
    return <LoadingComponent />;
  }

  // Utility function to format the shipping text
  function formatShippingText(text: string): string {
    return text
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Add space between camelCase words
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize the first letter of each word
  }

  return (
    <>
      <div className="max-w-2xl mx-auto my-12">
        <div className="bg-white p-4 w-full">
          <h1 className="text-grren-500 text-center font-bold mb-2 text-4xl">
            Thank you.
          </h1>
          <h1 className="text-grren-500 text-center font-bold mb-2 text-2xl">
            Your order has been received.
          </h1>
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
          <section>
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
                  <td className="p-2 border">
                    {formatShippingText(order.selectedShipping)}
                  </td>
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
                  <td className="p-2 border">{order.totalPrice}</td>
                </tr>
              </tfoot>
            </table>
            <p className="py-2">
              <strong className="mr-2">Note:</strong>
              Thank you for ordering the product, our team will contact you
              shortly
            </p>
          </section>
        </div>

        <Link
          href="/"
          className="bg-main text-white text-center py-3 mt-10 block px-6"
        >
          Go to HoMe
        </Link>
      </div>
    </>
  );
};

export default SuccessOrder;
