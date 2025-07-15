"use client";
import { apiUrl } from "@/app/shared/urls";
import LoadingComponent from "@/components/loading";
import { useState } from "react";
import useSWR from "swr";
import History from "./History";

const WithdrawRequestForm = () => {
  const [amount, setAmount] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState("bankTransfer");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const { data, error, isLoading } = useSWR(
    `${apiUrl}/transaction/getAllSellerTransaction`,
    fetcher
  );
  const transactions = data?.transactions;

  const lastElement = transactions?.[transactions.length - 1];
  const currentBalance = lastElement?.currentTotal || 0;

  const handleOpenModal = () => {
    if (currentBalance > 0) {
      setShowModal(true);
    } else {
      alert("No balance to withdraw.");
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission behavior

    const data = {
      amount: lastElement.currentTotal,
      accountNumber,
      withdrawalMethod,
    };

    try {
      const response = await fetch(`${apiUrl}/withdraw/request`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        setIsSubmitted(true); // Mark the form as successfully submitted
        handleCloseModal(); // Close modal on success
      } else {
        console.error("Error:", response.statusText);
      }
    } catch (error) {
      console.error("Request failed:", error);
    }
  };

  if (isLoading) {
    return <LoadingComponent />;
  }

  return (
    <div className="container">
      <div className="flex items-center">
        <button
          onClick={handleOpenModal}
          className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
        >
          Withdraw
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Withdraw Request
            </h2>

            {isSubmitted ? (
              <div className="text-center text-green-500">
                <p>Your withdraw request has been submitted successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Amount */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Amount</label>
                  <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={lastElement?.currentTotal || 0}
                    readOnly
                    required
                  />
                </div>

                {/* Account Number */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Account Number
                  </label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>

                {/* Withdrawal Method */}
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">
                    Withdrawal Method
                  </label>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="bankTransfer"
                      name="withdrawalMethod"
                      value="bankTransfer"
                      checked={withdrawalMethod === "bankTransfer"}
                      onChange={() => setWithdrawalMethod("bankTransfer")}
                      className="mr-2"
                    />
                    <label htmlFor="bankTransfer" className="mr-6">
                      Bank Transfer
                    </label>
                    <input
                      type="radio"
                      id="bikash"
                      name="withdrawalMethod"
                      value="bikash"
                      checked={withdrawalMethod === "bikash"}
                      onChange={() => setWithdrawalMethod("bikash")}
                      className="mr-2"
                    />
                    <label htmlFor="bikash" className="mr-6">
                      Bikash
                    </label>
                    <input
                      type="radio"
                      id="paypal"
                      name="withdrawalMethod"
                      value="paypal"
                      checked={withdrawalMethod === "paypal"}
                      onChange={() => setWithdrawalMethod("paypal")}
                      className="mr-2"
                    />
                    <label htmlFor="paypal">PayPal</label>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                >
                  Submit Request
                </button>
              </form>
            )}
            <button
              onClick={handleCloseModal}
              className="mt-4 w-full bg-gray-500 text-white py-2 rounded-md hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <History transactions={transactions} />
    </div>
  );
};

export default WithdrawRequestForm;

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
