// MetaForm.tsx

import React from "react";
import Image from "next/image";

// Define the prop types for the Meta component
interface MetaProps {
  tags: string[];
  setTags: (tags: string[]) => void;
  metaValue: string;
  setMetaValue: (value: string) => void;
}

const Keywords: React.FC<MetaProps> = ({
  tags,
  setTags,
  metaValue,
  setMetaValue,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMetaValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && metaValue) {
      setTags([...tags, metaValue]);
      setMetaValue("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 w-full space-y-4 bg-white mt-4">
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

export default Keywords;
