// pages/thank-you.js
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const ThankYouPage = () => {
  const router = useRouter();

  //   useEffect(() => {
  //     // Optionally redirect to home page after a few seconds (e.g., 5 seconds)
  //     setTimeout(() => {
  //       router.push("/");
  //     }, 5000);
  //   }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-green-600 mb-4">
          Thank You for Your Order!
        </h1>
        <p className="text-lg text-gray-700 mb-4">
          Your order has been successfully placed. We are processing it, and you
          will receive a confirmation email shortly.
        </p>
        <p className="text-md text-gray-500">
          If you have any questions, feel free to{" "}
          <Link href="/contact" className="text-blue-500">
            contact us
          </Link>
          .
        </p>
        <div className="mt-6">
          <button
            onClick={() => router.push("/")}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Return to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
