"use client";
import React, { useState } from "react";
import Image from "next/image";
import { apiUrl } from "@/app/shared/urls";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });
interface DynamicItem {
  text: string; // Text value for the field
  photo: File | null; // Optional photo (base64 string or null)
  _id?: string;
}

interface BlueFormData {
  title: string;

  photo: File | null | string; // Optional main photo
  items: DynamicItem[]; // Dynamic fields
}

const Blue: React.FC<{
  target: {
    productId: any;
    sectionId: string;
    fieldId: string;
    extraInfo: {
      title: string;
      shortDescription: string;
      description: string;
      photo: File | null | string;
      items: DynamicItem[];
    };
  };
}> = ({ target }) => {
  // Dynamic import for SunEditor

  const { extraInfo } = target;
  const [description, setDescription] = useState(extraInfo?.description || "");
  const [shortDescription, setShortDescription] = useState(
    extraInfo?.shortDescription || ""
  );

  // Initial data based on the provided structure
  const [formData, setFormData] = useState<BlueFormData>({
    title: extraInfo?.title || "",

    photo: (extraInfo?.photo === "null" ? null : extraInfo?.photo) || null,
    items: extraInfo?.items || [],
  });

  const [showPopup, setShowPopup] = useState(false);

  const handleMainPhotoChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        photo: file,
      });
    }
  };

  const handleItemTextChange = (index: number, value: string) => {
    const updatedItems = [...formData.items];
    updatedItems[index].text = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const handleItemPhotoChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const updatedItems = [...formData.items];
      updatedItems[index].photo = file;
      setFormData({ ...formData, items: updatedItems });
    }
  };

  const handleAddItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { text: "", photo: null }],
    });
  };

  const handleRemoveItem = (index: number) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = async () => {
    const formDataToSend = new FormData();
    // ---fixed fields data start here----//
    // Append text fields
    formDataToSend.append("title", formData.title);
    formDataToSend.append("shortDescription", shortDescription);
    formDataToSend.append("description", description);

    // hello chat gpt when add this main photo  part in the backend give this error

    // main photo code
    if (formData.photo instanceof File) {
      formDataToSend.append("mainPhoto", formData.photo);
    } else {
      formDataToSend.append("mainPhoto", formData.photo as string);
    }

    formDataToSend.append("itemsArray", JSON.stringify(formData.items));

    // ---fixed fields data start here----//
    // Map over the `items` array and append each file and its text
    formData.items.forEach((item, index) => {
      // Append the photo file
      if (item.photo) {
        formDataToSend.append(`items[${index}][photo]`, item.photo);
      }
    });
    formDataToSend.append("target", JSON.stringify(target));

    try {
      const response = await fetch(`${apiUrl}/extraProductInfo/create`, {
        method: "POST",
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error("Failed to upload items");
      }

      const result = await response.json();

      alert(result.message);
      setShowPopup(false);
    } catch (error) {
      console.error("Error uploading items:", error);
    }
  };

  return (
    <div>
      <svg
        onClick={() => setShowPopup(true)}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path
          fill="currentColor"
          d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10s-4.477 10-10 10m-1-7v2h2v-2zm2-1.645A3.502 3.502 0 0 0 12 6.5a3.5 3.5 0 0 0-3.433 2.813l1.962.393A1.5 1.5 0 1 1 12 11.5a1 1 0 0 0-1 1V14h2z"
        />
      </svg>

      {showPopup && (
        <div className="fixed top-0 font-normal left-0 w-full h-full z-[900] py-4 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-4xl h-full overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowPopup(false)}
              className="text-gray-500 float-right"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-4">Form</h2>
            <div className="flex flex-col md:flex-row w-full gap-2">
              <div className="w-full md:w-9/12">
                {/* Title Input */}
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Title"
                  className="border p-2 w-full mb-4 outline-0"
                />

                {/* Short Description Input */}
                <div>
                  <h2 className="text-xl font-bold mb-4">Short Description</h2>
                  <SunEditor
                    setOptions={{
                      buttonList: [
                        ["undo", "redo"],
                        ["font", "fontSize"],
                        // ['paragraphStyle', 'blockquote'],
                        [
                          "bold",
                          "underline",
                          "italic",
                          "strike",
                          "subscript",
                          "superscript",
                        ],
                        ["fontColor", "hiliteColor"],
                        ["align", "list", "lineHeight"],
                        ["outdent", "indent"],

                        ["table", "horizontalRule", "link", "image", "video"],

                        ["preview", "print"],
                        ["removeFormat"],
                      ],
                      defaultTag: "div",

                      showPathLabel: false,
                    }}
                    defaultValue={shortDescription}
                    onChange={(content) => setShortDescription(content)}
                  />
                </div>

                <div>
                  <h2 className="text-xl font-bold mb-4">Description</h2>
                  {/* Description Input */}

                  <SunEditor
                    setOptions={{
                      buttonList: [
                        ["undo", "redo"],
                        ["font", "fontSize"],
                        // ['paragraphStyle', 'blockquote'],
                        [
                          "bold",
                          "underline",
                          "italic",
                          "strike",
                          "subscript",
                          "superscript",
                        ],
                        ["fontColor", "hiliteColor"],
                        ["align", "list", "lineHeight"],
                        ["outdent", "indent"],

                        ["table", "horizontalRule", "link", "image", "video"],

                        ["preview", "print"],
                        ["removeFormat"],
                      ],
                      defaultTag: "div",

                      showPathLabel: false,
                    }}
                    defaultValue={description}
                    onChange={(content) => setDescription(content)}
                  />
                </div>
              </div>
              {/* Main Photo Upload */}
              <div className="w-full md:w-3/12">
                <label
                  htmlFor="mainPhotoInput"
                  className="cursor-pointer border w-full flex items-center justify-center mb-4"
                >
                  {formData.photo ? (
                    <Image
                      src={
                        formData.photo instanceof File
                          ? URL.createObjectURL(formData.photo)
                          : formData.photo
                      }
                      width={200}
                      height={200}
                      alt="Main Photo"
                      className="bg-white p-2 w-full object-contain"
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
                    id="mainPhotoInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleMainPhotoChange}
                  />
                </label>
              </div>
            </div>

            {/* Dynamic Items */}
            {formData.items.map((item, index) => (
              <div key={index} className="mb-4 border p-4 rounded">
                <h2 className="text-xl font-bold mb-4">Text</h2>
                <div className="flex justify-between items-center mb-2">
                  <SunEditor
                    setOptions={{
                      buttonList: [
                        ["undo", "redo"],
                        ["font", "fontSize"],
                        // ['paragraphStyle', 'blockquote'],
                        [
                          "bold",
                          "underline",
                          "italic",
                          "strike",
                          "subscript",
                          "superscript",
                        ],
                        ["fontColor", "hiliteColor"],
                        ["align", "list", "lineHeight"],
                        ["outdent", "indent"],

                        ["table", "horizontalRule", "link", "image", "video"],

                        ["preview", "print"],
                        ["removeFormat"],
                      ],
                      defaultTag: "div",

                      showPathLabel: false,
                    }}
                    defaultValue={item.text}
                    onChange={(content) => handleItemTextChange(index, content)}
                  />
                  <button
                    type="button"
                    className="text-red-500 ml-4"
                    onClick={() => handleRemoveItem(index)}
                  >
                    ✖
                  </button>
                </div>
                <h2 className="text-xl font-bold mb-4">Image</h2>
                <label
                  htmlFor={`itemPhotoInput-${index}`}
                  className="cursor-pointer border w-full flex items-center justify-center"
                >
                  {" "}
                  {item.photo ? (
                    <Image
                      src={
                        item.photo instanceof File
                          ? URL.createObjectURL(item.photo)
                          : item.photo
                      }
                      width={600}
                      height={600}
                      alt={`Item ${index}`}
                      className="bg-white p-2  object-contain"
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
                    id={`itemPhotoInput-${index}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleItemPhotoChange(index, e)}
                  />
                </label>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddItem}
              className="bg-main text-white px-4 py-2 rounded mb-4"
            >
              Add Field
            </button>

            <button
              type="button"
              onClick={handleSubmit}
              className="bg-main text-white px-4 py-2 rounded w-full"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blue;
