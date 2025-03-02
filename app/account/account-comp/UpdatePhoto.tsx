"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface ImageUploaderProps {
  initialImage?: string;
  onImageChange: (file: File | null) => void;
}
export const UpdateImage: React.FC<ImageUploaderProps> = ({
  initialImage,
  onImageChange,
}) => {
  const fallbackImage = "/user/default.jpg"; // Replace with your actual fallback path
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    initialImage || fallbackImage
  );

  // Update selectedImage if initialImage changes
  useEffect(() => {
    setSelectedImage(initialImage || fallbackImage);
  }, [initialImage]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      onImageChange(file);
    }
  };

  return (
    <div className="">
      <div className="flex flex-col items-center my-2 relative">
        <label
          htmlFor="photoInput"
          className="cursor-pointer w-full flex items-center justify-center"
        >
          {selectedImage ? (
            <Image
              src={selectedImage}
              alt="Selected"
              className="bg-white p-2 max-w-full h-auto"
              height={200}
              width={200}
              unoptimized
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
