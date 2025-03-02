import React from "react";

interface TitleProps {
  title: string;
  sub: string;
  value: string;
  setValue: (value: string) => void;
}

const Email: React.FC<TitleProps> = ({ title, sub, value, setValue }) => {
  return (
    <div className="mb-4 flex items-start flex-col md:flex-row">
      <h1 className="text-xs font-semibold mb-2 w-full md:w-1/5">{title}</h1>
      <input
        type="email"
        className="w-full md:w-4/5 p-2 text-xs max-w-md border outline-none rounded-md"
        placeholder={sub}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export default Email;
