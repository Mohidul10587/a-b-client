"use client";

import { FC, useState, useEffect } from "react";
import Keywords from "./Kewords";
import { apiUrl } from "@/app/shared/urls";
import { useData } from "@/app/DataContext";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const MetaForm: FC = () => {
  const { user } = useData();
  const [tags, setTags] = useState<string[]>([]);
  const [metaValue, setMetaValue] = useState("");
  const [formData, setFormData] = useState({
    sellerId: user._id,
    pageName: "",
    title: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // SWR Hook
  const { data, error, isValidating } = useSWR(
    formData.pageName
      ? `${apiUrl}/meta/getSingleMeta/${user._id}/${formData.pageName}`
      : null,
    fetcher,
    {
      onSuccess: () => setFetchLoading(false),
      onError: () => setFetchLoading(false),
    }
  );

  useEffect(() => {
    if (formData.pageName) {
      setFetchLoading(true);
    }
  }, [formData.pageName]);

  useEffect(() => {
    if (data) {
      setFormData((prev) => ({
        ...prev,
        title: data.meta.title || "",
        description: data.meta.description || "",
      }));
      setTags(data.meta.keywords || []);
      setSuccessMessage("Data fetched successfully");
    }

    if (error) {
      setErrorMessage("Failed to fetch meta data");
    }
  }, [data, error]);

  const handleSubmit = async () => {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");
    try {
      const response = await fetch(`${apiUrl}/meta/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          keywords: tags,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save Meta data");
      }

      setSuccessMessage("Meta data saved successfully!");
    } catch (error: any) {
      setErrorMessage(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto border-black border p-2">
      <h1 className="text-2xl mb-4">Manage Meta Data</h1>

      {/* Loading Messages */}
      {fetchLoading && (
        <p className="text-blue-600 mb-4">Loading page data...</p>
      )}
      {successMessage && (
        <p className="text-green-600 mb-4">{successMessage}</p>
      )}
      {errorMessage && <p className="text-red-600 mb-4">{errorMessage}</p>}

      <p>Select page name</p>
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, pageName: "home" })}
          className={`${
            formData.pageName === "home" && "bg-blue-500 text-white "
          } border border-black rounded p-1`}
        >
          Home page
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, pageName: "about" })}
          className={`${
            formData.pageName === "about" &&
            "bg-blue-500 text-white rounded p-1"
          } border border-black rounded p-1`}
        >
          About page
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, pageName: "products" })}
          className={`${
            formData.pageName === "products" &&
            "bg-blue-500 text-white rounded p-1"
          } border border-black rounded p-1`}
        >
          Products page
        </button>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block font-medium">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            className="w-full p-2 border rounded"
            required
          />
        </div>
        {/* Description */}
        <div>
          <label htmlFor="description" className="block font-medium">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full p-2 border rounded"
            rows={4}
            required
          />
        </div>
        {/* Keywords */}
        <Keywords
          tags={tags}
          setTags={setTags}
          metaValue={metaValue}
          setMetaValue={setMetaValue}
        />
        {/* Submit Button */}
        <div>
          <button
            type="button"
            onClick={handleSubmit}
            className={`w-full p-2 text-white rounded ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MetaForm;
