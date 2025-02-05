"use client";

import React from "react";
import axios from "axios";
import { apiUrl } from "@/app/shared/urls";
import { useRouter } from "next/navigation";

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
      const response = await axios.post(
        `${apiUrl}/payment/initialize-payment`,
        {
          amount,
          name,
          email,
          phone,
          transactionId,
          redirectUrl,
        }
      );

      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
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
