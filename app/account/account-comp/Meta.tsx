// MetaForm.tsx

import React from "react";
import Image from "next/image";

// Define the prop types for the Meta component
interface MetaProps {
  metaTitle: string;
  setMetaTitle: (value: string) => void;
  metaDescription: string;
  setMetaDescription: (value: string) => void;
  selectedImage: string | null;
  setSelectedImage: (image: string | null) => void;
  tags: string[];
  setTags: (tags: string[]) => void;
  metaValue: string;
  setMetaValue: (value: string) => void;
  setMetaImageFile: (value: File | null) => void;
}

const Meta: React.FC<MetaProps> = ({
  metaTitle,
  setMetaTitle,
  metaDescription,
  setMetaDescription,
  selectedImage,
  setSelectedImage,
  tags,
  setTags,
  metaValue,
  setMetaValue,
  setMetaImageFile,
}) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      setMetaImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetaValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && metaValue) {
      e.preventDefault();
      setTags([...tags, metaValue]);
      setMetaValue("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
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
          value={metaTitle}
          onChange={(e) => setMetaTitle(e.target.value)}
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
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
          placeholder="Enter description"
          className="mt-1 p-2 w-full border outline-0 rounded-md resize-none"
          rows={2}
        />
      </div>

      <div className="flex flex-col items-center my-2 relative">
        <label
          htmlFor="metaImage"
          className="cursor-pointer w-full flex items-center justify-center"
        >
          {selectedImage ? (
            <Image
              src={selectedImage}
              width={1200}
              height={640}
              alt="Selected"
              unoptimized
              className="bg-white p-2 w-full h-full object-contain rounded-md"
            />
          ) : (
            <div className="bg-white w-full">
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
                <p>Click to upload images</p>
                <p>1200x640px</p>
              </div>
            </div>
          )}
          <input
            id="metaImage"
            type="file"
            accept="image/*"
            className="hidden" // Keep this class to hide the input
            onChange={handleImageChange}
          />
        </label>
        {selectedImage && (
          <button
            onClick={handleRemoveImage}
            className="absolute right-1 top-1 px-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            X
          </button>
        )}
      </div>

      <div className="mt-2">
        <div className="text-gray-700">Meta Keywords</div>
        <div className="flex items-center flex-wrap border p-2 gap-2 bg-white rounded">
          {tags?.map((tag, index) => (
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
            onChange={handleChange}
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
