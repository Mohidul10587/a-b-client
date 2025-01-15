// MetaForm.tsx

import React, { useState } from "react";
import Image from "next/image";

// Define the prop types for the Meta component
interface MetaProps {
  formData: any;
  setFormData: (value: any) => void;
}

const Meta: React.FC<MetaProps> = ({ formData, setFormData }) => {
  const [metaValue, setMetaValue] = useState("");
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && metaValue) {
      e.preventDefault();
      setFormData({ ...formData, keywords: [...formData.keywords, metaValue] });
      setMetaValue("");
    }
  };

  const removeTag = (index: number) => {
    setFormData({
      ...formData,
      keywords: [
        ...formData.keywords.filter((_: string, i: number) => i !== index),
      ],
    });
  };

  return (
    <div className="p-4 w-full space-y-4 bg-white mt-4">
      <div>
        <label htmlFor="titleInput" className="text-gray-700">
          Meta Title
        </label>
        <input
          id="titleInput"
          type="text"
          value={formData.metaTitle}
          onChange={(e) =>
            setFormData({ ...formData, metaTitle: e.target.value })
          }
          placeholder="Enter title"
          className="mt-1 p-2 w-full border outline-0 rounded-md"
        />
      </div>

      <div>
        <label htmlFor="descriptionInput" className="text-gray-700">
          Meta Description
        </label>
        <textarea
          id="descriptionInput"
          value={formData.metaDescription}
          onChange={(e) =>
            setFormData({ ...formData, metaDescription: e.target.value })
          }
          placeholder="Enter description"
          className="mt-1 p-2 w-full border outline-0 rounded-md resize-none"
          rows={2}
        />
      </div>
      <div className="flex flex-col items-center my-2 relative">
        <label
          htmlFor="metaImg"
          className="cursor-pointer w-full flex items-center justify-center"
        >
          {formData.metaImg ? (
            <Image
              src={
                formData.metaImg instanceof File
                  ? URL.createObjectURL(formData.metaImg)
                  : formData.metaImg
              }
              width={600}
              height={600}
              alt="Selected"
              loading="lazy"
              className="bg-white p-2 max-w-full h-auto"
            />
          ) : (
            <div className="p-4 bg-white w-full">
              <div className="border-2 border-gray-500 text-gray-500 border-dashed flex flex-col items-center justify-center p-5 w-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-6-6h12"
                  />
                </svg>
                <p>Click to upload</p>
              </div>
            </div>
          )}
          <input
            id="metaImg"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData({ ...formData, metaImg: file });
              }
            }}
          />
        </label>
      </div>
      <div className="mt-2">
        <div className="text-gray-700">Meta Keywords</div>
        <div className="flex items-center flex-wrap border p-2 gap-2 bg-white rounded">
          {formData.keywords?.map((tag: string, index: number) => (
            <div
              key={index}
              className="flex items-center text-gray-700 border rounded-full px-3 py-1"
            >
              <span>{tag}</span>
              <button
                type="button"
                className="ml-2 text-gray-500 hover:text-gray-700"
                onClick={() => removeTag(index)}
              >
                &times;
              </button>
            </div>
          ))}
          <input
            type="text"
            value={metaValue}
            onChange={(e) => setMetaValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Add a keyword"
            className="flex-grow border py-1 px-2 rounded-full outline-none"
          />
        </div>
      </div>
    </div>
  );
};

export default Meta;
