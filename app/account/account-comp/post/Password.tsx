import React, { useState } from "react";

interface TitleProps {
  title: string;
  sub: string;
  value: string;
  setValue: (value: string) => void;
}

const Password: React.FC<TitleProps> = ({ title, sub, value, setValue }) => {
  const [showPassword, setShowPassword] = useState(false);

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="mb-4 flex items-center flex-col md:flex-row">
      {title && (
        <h1 className="text-xs font-semibold mb-2 w-full md:w-1/5">{title}</h1>
      )}
      <div className="relative w-full md:w-4/5">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full p-2 max-w-md text-xs border outline-none rounded-md"
          placeholder={sub}
          autoComplete="new-password" // Use this value to avoid autofill
          autoCorrect="off"
          spellCheck="false"
          id="newPassword" // Unique id
        />

        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
    </div>
  );
};

export default Password;
