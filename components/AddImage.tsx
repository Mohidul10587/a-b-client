"use client";
import React, { useState } from "react";

import { UploadButton } from "@/components/uploadthing";
import { apiUrl } from "@/app/shared/urls";

export interface IImage {
  img: File | string;
  title: string;
  useCase:
    | "product"
    | "category"
    | "subcategory"
    | "childCategory"
    | "brand"
    | "logo"
    | "banner"
    | "popup"
    | "others"
    | "";
}

const Add: React.FC<{ mute: any }> = ({ mute }) => {
  const [formData, setFormData] = useState<IImage>({
    title: "",
    img: "",
    useCase: "",
  });

  const handleUploadComplete = async (res: any) => {
    const response = await fetch(`${apiUrl}/gallery/create`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        img: res[0].url,
        title: formData.title,
        useCase: formData.useCase !== "" ? formData.useCase : "others",
      }),
    });

    if (response.ok) {
      mute();
    } else {
      alert("Failed to upload");
    }
  };

  return (
    <>
      <div className="container my-4">
        <div className=" flex items-center gap-x-3 h-12">
          <div className="flex items-center gap-x-2 ">
            <p>Image Title</p>
            <input
              type="text"
              name="title"
              value={formData?.title || ""}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Title"
              className="p-2  outline-none rounded-md border border-gray-300"
            />
          </div>

          <select
            value={formData.useCase}
            onChange={(e) =>
              setFormData({
                ...formData,
                useCase: e.target.value as IImage["useCase"],
              })
            }
            className="p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select use Cases</option>
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

          <div className={`${formData.title.trim() ? "block" : "hidden"}`}>
            <UploadButton
              endpoint="imageUploader"
              onClientUploadComplete={handleUploadComplete}
              onUploadError={(error: Error) => {
                alert(`ERROR! ${error.message}`);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Add;
