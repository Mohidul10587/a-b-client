"use client";
import { apiUrl } from "@/app/shared/urls";
import { useData } from "@/app/DataContext";
import { useState } from "react";

const UpdateSlugForm = () => {
  const { user } = useData();
  const userId = user._id;
  const [slug, setSlug] = useState<string>(user.slug);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSlugUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/seller/updateSlug`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update slug");
      }

      setMessage("Slug updated successfully!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-56 w-56 border border-black rounded p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Update Slug</h2>
      <form onSubmit={handleSlugUpdate} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="slug"
            className="block text-sm font-medium text-gray-700"
          >
            New Slug
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Enter new slug"
            required
          />
        </div>

        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded focus:outline-none disabled:bg-gray-400"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Slug"}
        </button>

        {message && <p className="text-green-600 text-sm">{message}</p>}
        {error && <p className="text-red-600 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default UpdateSlugForm;
