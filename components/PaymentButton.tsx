"use client";

import React from "react";
import { apiUrl } from "@/app/shared/urls";
import { useRouter } from "next/navigation";
import { req } from "@/app/shared/request";

interface PaymentButtonProps {
  amount: number;
  name: string;
  email: string;
  phone: string;
  transactionId: string;
  redirectUrl: string;
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  amount,
  name,
  email,
  phone,
  transactionId,
  redirectUrl,
}) => {
  const router = useRouter();

  const handlePayment = async () => {
    try {
      const { res, data } = await req("payment/initialize-payment", "POST", {
        amount,
        name,
        email,
        phone,
        transactionId,
        redirectUrl,
      });
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    } catch (error) {}
  };

  return (
    <button
      onClick={handlePayment}
      className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
    >
      Pay Now
    </button>
  );
};

export default PaymentButton;
