"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useData } from "@/app/DataContext";
import { req } from "@/app/shared/request";

interface Banner {
  img: string;
  title: string;
  link: string;
}

const Form: React.FC<Props<IBanner>> = ({
  id,
  initialData,
  pagePurpose = "add",
}) => {
  const { showModal } = useData();
  const [data, setData] = useState<IBanner>(initialData);

  const handleBannerChange = (
    index: number,
    field: keyof Banner,
    value: string
  ) => {
    const updatedBanners = [...data.banners];
    updatedBanners[index] = {
      ...updatedBanners[index],
      [field]: value,
    };
    setData((prev) => ({ ...prev, banners: updatedBanners }));
  };

  const addBanner = () => {
    setData((prev) => ({
      ...prev,
      banners: [...prev.banners, { img: "", title: "", link: "" }],
    }));
  };

  const removeBanner = (index: number) => {
    setData((prev) => ({
      ...prev,
      banners: prev.banners.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.title.trim()) {
      showModal("Title is required", "info");
      return;
    }
    const url = pagePurpose === "add" ? "banner/create" : `banner/update/${id}`;
    const method = pagePurpose === "add" ? "POST" : `PUT`;

    try {
      const { res, data: resData } = await req(url, method, data);
      showModal(resData.message, res.ok ? "success" : "error");
    } catch (error) {
      showModal("Failed to upload product due to an unexpected error", "error");
    } finally {
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Title + Submit Button */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <div className="w-full">
          <label className="font-medium text-gray-700">
            Title <sup className="text-red-600">*</sup>
          </label>
          <input
            type="text"
            placeholder="Enter title"
            value={data.title}
            onChange={(e) =>
              setData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
          />
        </div>
        <button
          type="submit"
          onClick={handleSubmit}
          className="h-[45px] bg-main text-white px-6 py-2 rounded-md shadow-md hover:bg-main/90 transition"
        >
          Publish
        </button>
      </div>

      {/* Banner Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Banners</h2>
        <button
          onClick={addBanner}
          className="bg-main text-white px-4 py-2 rounded-md shadow hover:bg-main/90 transition"
        >
          Add New
        </button>
      </div>

      {/* Banner Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {data.banners.map((banner, index) => (
          <div
            key={index}
            className="relative bg-white p-4 rounded-xl shadow-md flex flex-col gap-3"
          >
            {/* Remove Button */}
            <button
              onClick={() => removeBanner(index)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M19 5L5 19M5 5l14 14"
                />
              </svg>
            </button>

            {/* Banner Image */}
            <div className="w-full aspect-[4/3] overflow-hidden rounded-lg border border-gray-200">
              <Image
                src={banner.img || "/default.jpg"}
                width={300}
                height={200}
                alt="Banner"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Title Input */}
            <input
              type="text"
              value={banner.title}
              onChange={(e) =>
                handleBannerChange(index, "title", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
              placeholder="Title"
            />

            {/* Link Input */}
            <input
              type="text"
              value={banner.link}
              onChange={(e) =>
                handleBannerChange(index, "link", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
              placeholder="Link"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Form;
