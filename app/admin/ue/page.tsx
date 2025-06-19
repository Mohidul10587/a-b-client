"use client";
// pages/admin/update-email.tsx
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiUrl } from "@/app/shared/urls";

const UpdateEmail = () => {
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState(""); // New password state
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/admin/update-email`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newEmail, password }), // Include password in the request body
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Email updated successfully!");
        // Optionally navigate to another page, such as admin dashboard
        router.push("/admin");
      } else {
        setMessage(data.message || "Email update failed.");
      }
    } catch (error) {
      console.error("Error updating email:", error);
      setMessage("An error occurred while updating the email.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 space-y-6">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Update Admin Email
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Enter your current and new email along with your password to update
          your admin email address.
        </p>

        <form onSubmit={handleEmailUpdate} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Current Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="newEmail"
              className="block text-sm font-medium text-gray-700"
            >
              New Email
            </label>
            <input
              id="newEmail"
              name="newEmail"
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="newadmin@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your password"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Update Email
            </button>
          </div>
        </form>

        {message && (
          <div
            className={`mt-4 p-4 text-sm rounded-lg ${
              message.includes("successfully")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default UpdateEmail;
