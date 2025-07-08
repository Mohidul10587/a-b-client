"use client";
import type React from "react";
import { useState } from "react";
import Image from "next/image";

import useSWR from "swr";
import UploadForm from "./UploadForm";
import { apiUrl } from "@/app/shared/urls";
import { fetcher } from "@/app/shared/fetcher";

interface MediaProps {
  onClose: any;
  handleImage: any;
}

interface MediaItem {
  _id: string;
  img: string;
  name: string;
  title: string;
  useCase: string;
}

export default function ImageGalleryJsx({ onClose, handleImage }: MediaProps) {
  const [activeTab, setActiveTab] = useState<"upload1" | "upload2" | "library">(
    "library"
  );
  const [selectedMediaItem, setSelectedMediaItem] = useState<MediaItem | null>(
    null
  );
  const [useCaseFilter, setUseCaseFilter] = useState("");
  const [searchText, setSearchText] = useState("");
  // Construct query string
  const queryString = new URLSearchParams({
    ...(useCaseFilter && { useCase: useCaseFilter }),
    ...(searchText && { search: searchText }),
  }).toString();

  const { data, mutate } = useSWR(`gallery/all?${queryString}`, fetcher);
  const mediaItems = data ? data.result : [];
  
  const handleSelectMediaItem = (item: MediaItem) => {
    if (selectedMediaItem?._id === item._id) {
      setSelectedMediaItem(null); // Deselect if already selected
    } else {
      setSelectedMediaItem(item); // Select if not already selected
    }
  };

  // Helper function to check if an image is selected in the current context

  const handleUpdateMediaItem = async () => {
    if (!selectedMediaItem) return;

    try {
      const res = await fetch(
        `${apiUrl}/gallery/update/${selectedMediaItem._id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(selectedMediaItem),
        }
      );

      if (!res.ok) throw new Error("Failed to update");
      const data = await res.json();
      mutate(); // refresh media list
      alert(data.message);
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to update media item.");
    }
  };

  // utils/api/deleteGalleryItem.ts

  const deleteGalleryItem = async (id: string) => {
    try {
      const res = await fetch(`${apiUrl}/gallery/delete/${id}`, {
        credentials: "include",
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        setSelectedMediaItem(null);
        mutate();
      }
    } catch (error: any) {
      return {
        success: false,
        message: "Something went wrong while deleting.",
      };
    }
  };
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black bg-opacity-50 py-12">
      <div className="relative bg-white p-6 rounded-lg shadow-lg overflow-y-auto h-[600px] w-8/12">
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-5xl h-[80vh] bg-white rounded-lg shadow-xl flex flex-col">
            {/* Modal Tabs */}
            <div className="flex border-b">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "library"
                    ? "bg-white border-b-2 border-blue-600"
                    : "bg-gray-100"
                }`}
                onClick={() => setActiveTab("library")}
              >
                Media Library
              </button>

              <button
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "upload2"
                    ? "bg-white border-b-2 border-blue-600"
                    : "bg-gray-100"
                }`}
                onClick={() => setActiveTab("upload2")}
              >
                Upload files with cloudflare
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-auto">
              {activeTab === "library" && (
                <div className="flex h-full">
                  {/* Left side - Media Grid */}
                  <div className="flex-1 p-4 overflow-auto">
                    <div className="mb-4">
                      <div className="flex items-center justify-end gap-x-2 ">
                        <select
                          className="px-3 py-2 pr-8 text-sm border border-gray-300 rounded appearance-none"
                          value={useCaseFilter}
                          onChange={(e) => setUseCaseFilter(e.target.value)}
                        >
                          <option value="">All Use Cases</option>
                          <option value="product">Product</option>
                          <option value="category">Category</option>
                          <option value="brand">Brand</option>
                          <option value="logo">Logo</option>
                          <option value="banner">Banner</option>
                          <option value="popup">Popup</option>
                          <option value="others">Others</option>
                        </select>

                        <input
                          type="text"
                          placeholder="Search media"
                          className="px-3 py-2 text-sm border border-gray-300 rounded"
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-5 gap-4">
                      {mediaItems.map((item: any, index: number) => (
                        <div
                          key={item._id}
                          onClick={() => handleSelectMediaItem(item)}
                          className={`relative cursor-pointer border rounded overflow-hidden ${
                            selectedMediaItem?._id === item._id
                              ? "border-blue-500 ring-2 ring-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          <div className="relative h-24">
                            <Image
                              src={item.img || "/placeholder.svg"}
                              alt={item.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            {selectedMediaItem?._id === item._id && (
                              <div className="absolute top-0 left-0 w-6 h-6 bg-blue-500 flex items-center justify-center">
                                <svg
                                  className="w-4 h-4 text-white"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right side - Media Details */}
                  {selectedMediaItem && (
                    <div className="w-1/3 p-4 border-l border-gray-300 overflow-auto">
                      <h3 className="mb-4 text-lg font-medium">
                        ATTACHMENT DETAILS
                      </h3>

                      <div className="mb-4">
                        <div className="relative h-40 mb-2">
                          <Image
                            src={selectedMediaItem.img || "/placeholder.svg"}
                            alt={selectedMediaItem.title}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <label className="block mb-1 text-sm font-medium">
                          Title
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
                          defaultValue={selectedMediaItem.title}
                          onChange={(e) =>
                            setSelectedMediaItem((prev) =>
                              prev ? { ...prev, title: e.target.value } : null
                            )
                          }
                        />
                      </div>
                      <div className="">
                        <label className="block mb-1 text-sm font-medium">
                          Image Use Case
                        </label>

                        <select
                          value={selectedMediaItem.useCase}
                          onChange={(e) =>
                            setSelectedMediaItem((prev) =>
                              prev ? { ...prev, useCase: e.target.value } : null
                            )
                          }
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded"
                        >
                          <option value="">All Use Cases</option>
                          <option value="product">Product</option>
                          <option value="category">Category</option>
                          <option value="subcategory">Subcategory</option>
                          <option value="childCategory">Child Category</option>
                          <option value="brand">Brand</option>
                          <option value="logo">Logo</option>
                          <option value="banner">Banner</option>
                          <option value="popup">Popup</option>
                          <option value="others">Others</option>
                        </select>
                      </div>
                      <div className="flex justify-center">
                        <button
                          className="btnR text-xs"
                          onClick={() =>
                            deleteGalleryItem(selectedMediaItem._id)
                          }
                        >
                          Delete Image
                        </button>
                        <button
                          className="btnO text-xs"
                          onClick={handleUpdateMediaItem}
                        >
                          Update Info
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {activeTab === "upload2" && (
                <UploadForm mutate={mutate} setActiveTab={setActiveTab} />
              )}
            </div>

            {/* Modal Footer */}

            <div className="flex items-center justify-end p-4 border-t">
              <button
                onClick={onClose}
                className="px-4 py-2 mr-2 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              {selectedMediaItem && (
                <button
                  onClick={() => handleImage(selectedMediaItem)}
                  className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                  disabled={selectedMediaItem === null}
                >
                  Get featured image
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
