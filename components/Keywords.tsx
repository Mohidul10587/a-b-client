// MetaForm.tsx
"use client";
import React, { useState } from "react";
// Define the prop types for the Meta component
interface MetaProps {
  data: any;
  setData: any;
  usingFor?: string;
}

const Keywords: React.FC<MetaProps> = ({
  data,
  setData,
  usingFor = "metaKeywords",
}) => {
  const [metaValue, setMetaValue] = useState("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetaValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && metaValue) {
      usingFor === "metaKeywords" &&
        setData({ ...data, keywords: [...data.keywords, metaValue] });
      usingFor === "youtubeVideos" &&
        setData({ ...data, youtubeVideos: [...data.youtubeVideos, metaValue] });

      setMetaValue("");
    }
  };

  const removeTag = (index: number) => {
    usingFor === "metaKeywords" &&
      setData({
        ...data,
        keywords: data.keywords.filter((_: string, i: number) => i !== index),
      });
    usingFor === "youtubeVideos" &&
      setData({
        ...data,
        youtubeVideos: data.youtubeVideos.filter(
          (_: string, i: number) => i !== index
        ),
      });
  };

  return (
    <div className="p-4 w-full space-y-4 bg-white mt-4">
      <div className="mt-2">
        <div className="text-gray-700">
          {usingFor === "youtubeVideos" && "Youtube video"}
          {usingFor === "metaKeywords" && "Meta Keywords"}
        </div>
        <div className="flex items-center flex-wrap border p-2 gap-2 bg-white rounded">
          {usingFor === "metaKeywords" &&
            data.keywords?.map((tag: string, index: number) => (
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
          {usingFor === "youtubeVideos" &&
            data.youtubeVideos?.map((tag: string, index: number) => (
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

export default Keywords;
