"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

interface PhotoProps {
  title: string;
  img?: string;
  onImageChange: (file: File | null) => void;
  requiredSing?: boolean;
}

const Photo: React.FC<PhotoProps> = ({
  title,
  img,
  onImageChange,
  requiredSing,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    img || null
  );

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      onImageChange(file); // Call the callback with the selected file
    }
  };

  useEffect(() => {
    if (img) {
      setSelectedImage(img);
    }
  }, [img]);

  return (
    <div className="mb-4 flex items-center flex-col md:flex-row">
      {title && (
        <h1 className="text-xs font-semibold mb-2 w-full md:w-1/5">{title}</h1>
      )}
      <div className="w-full md:w-4/5 p-2 max-w-md text-xs border outline-none rounded-md">
        <label
          htmlFor="photoInput"
          className="cursor-pointer w-full flex items-center justify-center"
        >
          {selectedImage ? (
            <Image
              src={selectedImage}
              width={600}
              height={600}
              alt="Selected"
              className="bg-white p-2 w-full max-h-40 object-contain"
            />
          ) : (
            <div className="p-4 bg-white w-full h-36">
              <div className="border-2 h-auto border-gray-200 text-gray-500 border-dashed flex flex-col items-center justify-center p-5 w-full">
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
            id="photoInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>
    </div>
  );
};

export default Photo;
