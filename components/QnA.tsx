"use client";

import { useState } from "react";

type QnAProps = {
  data: any; // Use the previously defined CategoryData type
  setData: any;
};

const QnA: React.FC<QnAProps> = ({ data, setData }) => {
  const [isChecked, setIsChecked] = useState<boolean>(false); // State for toggle switch

  // Function to add a new field
  const addField = () => {
    setData((prevData: any) => ({
      ...prevData,
      queAndAnsArray: [
        ...prevData.queAndAnsArray,
        { title: "", description: "" },
      ],
    }));
  };

  // Function to remove a field
  const removeField = (index: number) => {
    setData((prevData: any) => {
      const updatedArray = [...prevData.queAndAnsArray];
      updatedArray.splice(index, 1);
      return { ...prevData, queAndAnsArray: updatedArray };
    });
  };

  // Function to handle toggle switch
  const handleToggle = () => {
    setIsChecked(!isChecked);
  };

  // Function to handle input changes
  const handleInputChange = (
    index: number,
    field: "title" | "description",
    value: string
  ) => {
    setData((prevData: any) => {
      const updatedArray = [...prevData.queAndAnsArray];
      updatedArray[index][field] = value;

      return { ...prevData, queAndAnsArray: updatedArray };
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between py-3">
        <h1>QnA</h1>
        <div
          onClick={handleToggle}
          className={`relative inline-flex items-center h-5 border rounded-full w-10 cursor-pointer transition-colors duration-300 ${
            isChecked ? "border-main" : "border-gray-400"
          }`}
        >
          <span
            className={`inline-block w-3 h-3 transform bg-main rounded-full transition-transform duration-300 ${
              isChecked ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </div>
      </div>
      {isChecked && (
        <>
          {data.queAndAnsArray.map((field: any, index: number) => (
            <div key={index}>
              <input
                type="text"
                value={field.title}
                onChange={(e) =>
                  handleInputChange(index, "title", e.target.value)
                }
                className="mb-2 p-2 border bg-white w-full outline-0"
                placeholder="Title"
              />
              <textarea
                value={field.description}
                onChange={(e) =>
                  handleInputChange(index, "description", e.target.value)
                }
                className="mb-2 p-2 border bg-white w-full outline-0"
                placeholder="Description"
              />
              <button
                className="bg-red-100 p-1 mb-2 text-center w-full block"
                onClick={() => removeField(index)}
                type="button"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            className="bg-main text-white w-full p-2 block"
            onClick={addField}
            type="button"
          >
            Add QnA
          </button>
        </>
      )}
    </div>
  );
};

export default QnA;
