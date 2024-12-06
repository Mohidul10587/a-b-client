"use client";
import React, { useState, Dispatch, SetStateAction } from "react";
import Image from "next/image";

interface AttachFilesProps {
  onFilesChange: Dispatch<SetStateAction<File[]>>;
}

const AttachFiles: React.FC<AttachFilesProps> = ({ onFilesChange }) => {
  const [filePreviews, setFilePreviews] = useState<(string | ArrayBuffer)[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;

    if (selectedFiles) {
      const newPreviews: (string | ArrayBuffer)[] = [];
      const maxFiles = 4;

      if (selectedFiles.length + filePreviews.length > maxFiles) {
        setError(`Maximum ${maxFiles} files allowed.`);
        return;
      } else {
        setError(null);
      }

      const filesArray = Array.from(selectedFiles);
      onFilesChange((prevFiles) => [...prevFiles, ...filesArray]);

      filesArray.forEach((file) => {
        const reader = new FileReader();

        reader.onload = () => {
          // If the file is an image, display the image preview
          if (file.type.startsWith("image/")) {
            newPreviews.push(reader.result as string);
          } else {
            // For non-image files, display the file name
            newPreviews.push(file.name);
          }

          setFilePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
        };

        reader.readAsDataURL(file);
      });
    }
  };

  const handleCancelClick = (index: number) => {
    const newPreviews = [...filePreviews];
    newPreviews.splice(index, 1);
    setFilePreviews(newPreviews);
    onFilesChange((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-start">
      <label
        htmlFor="fileInput"
        className="cursor-pointer flex items-center bg-white mt-2 px-3 py-2 space-x-2"
      >
        <span>Attach Files</span>
        <input
          id="fileInput"
          type="file"
          className="hidden"
          onChange={handleFileChange}
          multiple
        />
      </label>

      {error && <div className="text-red-500">{error}</div>}

      {filePreviews.length > 0 && (
        <div className="text-sm text-gray-600 w-full mt-4 mb-8">
          <b>File Previews:</b>
          <div className="grid md:grid-cols-4 grid-cols-2 gap-4">
            {filePreviews.map((preview, index) => (
              <div
                key={index}
                className="flex items-center relative justify-center bg-gray-100 p-1"
              >
                {typeof preview === "string" ? (
                  preview.startsWith("data:image") ? (
                    <Image
                      src={preview as string}
                      width={50}
                      height={50}
                      alt="Preview"
                      className="h-24 w-full object-cover"
                    />
                  ) : (
                    <span>{preview}</span>
                  )
                ) : (
                  <span>{String(preview)}</span>
                )}
                <p
                  onClick={() => handleCancelClick(index)}
                  className="absolute text-red-500 right-1 top-1 cursor-pointer"
                >
                  X
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AttachFiles;
