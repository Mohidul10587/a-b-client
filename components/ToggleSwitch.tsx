"use client";

import React, { useState, useEffect } from "react";

interface ToggleSwitchProps {
  switch: "enable" | "disable";
  onChange: (newState: boolean) => void; // Add this prop
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  switch: switchProp,
  onChange,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  // Set initial state based on the prop
  useEffect(() => {
    setIsChecked(switchProp === "enable");
  }, [switchProp]);

  const onToggle = () => {
    const newState = !isChecked;
    setIsChecked(newState);
    onChange(newState); // Notify parent about the state change
  };

  return (
    <div>
      <div
        onClick={onToggle}
        className={`relative inline-flex items-center h-6 border rounded-full w-10 cursor-pointer transition-colors duration-300 ${
          isChecked ? "border-main bg-main" : "border-gray-300 bg-white"
        }`}
      >
        <span
          className={`inline-block w-3 h-3 transform rounded-full transition-transform duration-300 ${
            isChecked ? "bg-white translate-x-5" : "translate-x-1 bg-main"
          }`}
        />
      </div>
    </div>
  );
};

export default ToggleSwitch;
