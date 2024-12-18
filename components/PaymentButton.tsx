import React from "react";
import axios from "axios";
import { apiUrl } from "@/app/shared/urls";

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
        // Redirect to AmarPay's payment URL
        window.location.href = response.data.paymentUrl;
      }
    } catch (error) {
      console.log(error);
      //   console.error("Payment initialization failed", error);
    }
  };

  return <button onClick={handlePayment}>Pay Now</button>;
};

export default PaymentButton;
