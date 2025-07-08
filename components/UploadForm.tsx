"use client";
import { apiUrl } from "@/app/shared/urls";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

const UploadForm: React.FC<{
  mutate: any;
  setActiveTab: React.Dispatch<
    React.SetStateAction<"upload1" | "upload2" | "library">
  >;
}> = ({ mutate, setActiveTab }) => {
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setSelectedFiles(files);

    // Generate preview URLs
    if (files) {
      const previews = Array.from(files).map((file) =>
        URL.createObjectURL(file)
      );
      setPreviewUrls(previews);
    }
  };

  const handleUpload = async () => {
    if (!selectedFiles) return;

    setUploading(true);

    for (const file of Array.from(selectedFiles)) {
      // Step 1: Get Signed URL
      const res = await fetch("/api/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
        }),
      });

      if (!res.ok) {
        console.error("Failed to get upload URL:", res.status);
        continue;
      }

      const { url } = await res.json();

      // Step 2: Upload File to Signed URL
      await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      // Step 3: Construct Final Public URL
      const publicUrl = `${process.env.NEXT_PUBLIC_IMAGE_CDN}/${file.name}`;
      setUploadedUrls((prev) => [...prev, publicUrl]);
      const response = await fetch(`${apiUrl}/gallery/create`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          img: publicUrl,
          title: "Image Name",
          useCase: "others",
        }),
      });
      if (response.ok) {
        mutate();
        setActiveTab("library");
      } else {
        alert("Failed to upload");
      }
    }

    setUploading(false);
    setSelectedFiles(null);
    setPreviewUrls([]);
  };

  // Clean up blob URLs on component unmount or file change
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Upload Images
      </h2>

      <div className="mb-4">
        <input
          type="file"
          id="fileUpload"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />

        <label
          htmlFor="fileUpload"
          className="inline-flex items-center px-5 py-2 bg-blue-600 text-white font-medium rounded cursor-pointer hover:bg-blue-700 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M4 3a2 2 0 00-2 2v4a2 2 0 002 2h1v4a2 2 0 002 2h6a2 2 0 002-2v-4h1a2 2 0 002-2V5a2 2 0 00-2-2H4z" />
          </svg>
          Choose Images
        </label>

        {selectedFiles && (
          <p className="mt-2 text-sm text-gray-600">
            {selectedFiles.length} file{selectedFiles.length > 1 ? "s" : ""}{" "}
            selected
          </p>
        )}
      </div>

      {/* Image Previews */}
      {previewUrls.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
          {previewUrls.map((url, index) => (
            <div
              key={index}
              className="w-full aspect-square rounded overflow-hidden border border-gray-300 shadow-sm hover:shadow-md transition"
            >
              <Image
                src={url}
                alt={`Preview ${index}`}
                width={300}
                height={300}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!selectedFiles || uploading}
        className={`w-full py-2 px-4 rounded text-white font-semibold transition ${
          uploading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {uploading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin mr-2 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              ></path>
            </svg>
            Uploading...
          </span>
        ) : (
          "Upload"
        )}
      </button>

      {/* Uploaded Links */}
      {uploadedUrls.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            Uploaded Files:
          </h3>
          <ul className="list-disc list-inside text-blue-700 space-y-1">
            {uploadedUrls.map((url, index) => (
              <li key={index}>
                <Link
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline break-all"
                >
                  {url}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
export default UploadForm;
