import React, { useState, useEffect } from "react";

interface PhotoProps {
  title: string;
  img?: string; // URL of the image from the database
  onImageChange: (file: string | File | null) => void;
}

const Photo: React.FC<PhotoProps> = ({ title, img, onImageChange }) => {
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    img || undefined // Set initial value to undefined
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
      setSelectedImage(img); // Set the image URL from the database
    }
  }, [img]);

  return (
    <div className="w-full">
      <p className="flex items-center justify-between">
        <span>{title}</span>
        <span>{selectedImage ? "Image selected" : ""}</span>
      </p>
      <div className="flex flex-col items-center my-2 relative">
        <label
          htmlFor="photoInput"
          className="cursor-pointer w-full flex items-center justify-center"
        >
          {selectedImage ? (
            <img
              src={selectedImage}
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
