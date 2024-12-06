"use client";

import { useState, ChangeEvent } from "react";
import Image from "next/image";
import { IProduct, IVariant } from "@/types/product";
import { apiUrl } from "@/app/shared/urls";
import { fetchWithTokenRefresh } from "@/app/shared/fetchWithTokenRefresh";

interface EditVariantModalProps {
  product: IProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function EditVariantModal({
  product,
  isOpen,
  onClose,
}: EditVariantModalProps) {
  const [variantTitle, setVarianTitle] = useState(product?.variantTitle);
  const [variantSections, setVariantSections] = useState<IVariant[]>(
    product?.variantSectionInfo || [{ img: null, title: "", variantPrice: 0 }]
  );

  const handleVariantSectionChange = (
    index: number,
    field: keyof IVariant,
    value: string | File | null
  ) => {
    setVariantSections((prevSections) => {
      const updatedSections = [...prevSections];
      updatedSections[index] = { ...updatedSections[index], [field]: value };
      return updatedSections;
    });
  };

  const handleImageChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleVariantSectionChange(index, "img", file);
    }
  };

  const addVariantSection = () => {
    setVariantSections((prevSections) => [
      ...prevSections,
      { img: null, title: "", variantPrice: 0 },
    ]);
  };

  const removeVariantSection = (index: number) => {
    setVariantSections((prevSections) =>
      prevSections.filter((_, i) => i !== index)
    );
  };

  const handleSaveChanges = async () => {
    if (!product) return;

    // Prepare the data to be sent
    const formData = new FormData();
    formData.append("variantTitle", variantTitle ?? ""); // Ensure variantTitle is never undefined
    const variantSectionsInfo: any[] = [];

    variantSections.forEach((section) => {
      if (section.img instanceof File) {
        formData.append("variantSectionsImage", section.img);
      }
      variantSectionsInfo.push({
        title: section.title,
        variantPrice: section.variantPrice,
        img: section.img instanceof File ? "" : section.img,
      });
    });
    formData.append("variantSectionsInfo", JSON.stringify(variantSectionsInfo));
    try {
      const response = await fetchWithTokenRefresh(
        `${apiUrl}/product/updateVariant/${product._id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update variant");
      }

      onClose();
      console.log("Variant updated successfully");
    } catch (error) {
      console.log(error);
      console.error("Error updating variant:", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Edit Variant</h2>

        <label className="block mb-2 font-medium">Product Variant Title:</label>
        <input
          type="text"
          value={variantTitle}
          onChange={(e) => setVarianTitle(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full mb-4"
        />

        <div className="flex items-center justify-between my-4 font-bold">
          <h1>Variant Section</h1>
          <button
            type="button"
            onClick={addVariantSection}
            className="bg-main text-white px-4 py-2 rounded"
          >
            Add New
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {variantSections.map((section, index) => (
            <div
              key={index}
              className="bg-white w-full p-2 relative flex flex-col items-center space-y-2"
            >
              <label
                htmlFor={`photoInput_${index}`}
                className="cursor-pointer w-full h-32 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg overflow-hidden"
              >
                {section.img ? (
                  <Image
                    src={
                      section.img instanceof File
                        ? URL.createObjectURL(section.img)
                        : (section.img as string)
                    }
                    width={150}
                    height={150}
                    alt="Variant Image"
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex flex-col items-center text-gray-500 p-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="50"
                      height="50"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 6v12m-6-6h12" />
                    </svg>
                    <p>Click to upload</p>
                  </div>
                )}
                <input
                  id={`photoInput_${index}`}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(index, e)}
                />
              </label>

              <input
                type="text"
                value={section.title ?? ""}
                onChange={(e) =>
                  handleVariantSectionChange(index, "title", e.target.value)
                }
                className="border border-gray-300 p-2 rounded w-full"
                placeholder="Title"
              />
              <input
                type="number"
                value={section.variantPrice}
                onChange={(e) =>
                  handleVariantSectionChange(
                    index,
                    "variantPrice",
                    e.target.value
                  )
                }
                className="border border-gray-300 p-2 rounded w-full"
                placeholder="Price"
              />
              <button
                type="button"
                onClick={() => removeVariantSection(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M19 5L5 19M5 5l14 14" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 mr-2"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveChanges}
            className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
