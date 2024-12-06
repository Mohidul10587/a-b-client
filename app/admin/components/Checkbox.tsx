"use client";

import React, { useState } from "react";

interface CheckboxProps {
  title: string;
  items: { title: string; checked?: boolean }[];
  onChange: (selectedItems: string[]) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ title, items, onChange }) => {
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    items.map((item) => !!item.checked)
  );

  const handleCheckboxChange = (index: number) => {
    const newCheckedItems = [...checkedItems];
    newCheckedItems[index] = !checkedItems[index];
    setCheckedItems(newCheckedItems);

    const selectedItems = items
      .filter((_, i) => newCheckedItems[i])
      .map((item) => item.title);
    onChange(selectedItems);
  };

  return (
    <div className="my-2">
      <p>{title}</p>
      <div className="w-full bg-white p-2 overflow-y-auto max-h-60 mt-2 rounded-md">
        {items.map((item, index) => (
          <label key={index} className="flex items-center">
            <input
              type="checkbox"
              checked={checkedItems[index]}
              onChange={() => handleCheckboxChange(index)}
              className="form-checkbox h-5 w-5 mr-1 text-blue-600"
            />
            <span>{item.title}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Checkbox;
