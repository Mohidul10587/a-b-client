// pages/payment-failed.js
import Link from "next/link";

export default function PaymentFailed() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-red-50">
      <div className="p-8 bg-white shadow-md rounded-md text-center">
        <h1 className="text-2xl font-bold text-red-600">Payment Failed</h1>
        <p className="mt-4 text-gray-600">
          Unfortunately, your payment could not be processed. Please try again.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
