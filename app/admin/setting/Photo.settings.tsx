"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface PhotoProps {
  title: string;
  img: string; // This could be a URL from the API or a locally selected image
  onImageChange: (file: File | null) => void;
  inputId: string;
}

const Photo: React.FC<PhotoProps> = ({
  title,
  img,
  onImageChange,
  inputId,
}) => {
  const [preview, setPreview] = useState<string | ArrayBuffer | null>(img);

  useEffect(() => {
    // Update preview if `img` prop changes (e.g., fetched logo URL)
    setPreview(img);
  }, [img]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result); // Set preview for chosen image
        onImageChange(file);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(img); // Reset preview to fetched image URL if file selection is cancelled
      onImageChange(null);
    }
  };

  return (
    <div className="w-full">
      <p className="flex items-center justify-between">
        <span>{title}</span>
      </p>
      <div className="flex flex-col items-center my-2 relative">
        <label
          htmlFor={inputId}
          className="cursor-pointer w-full flex items-center justify-center"
        >
          {preview ? (
            <Image
              src={preview as string}
              width={600}
              height={600}
              alt="Selected"
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
            id={inputId}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
};

export default Photo;
