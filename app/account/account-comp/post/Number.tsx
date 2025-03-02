import React from 'react';

interface TitleProps {
  title: string;
  sub: string;
}

const Number: React.FC<TitleProps> = ({ title, sub }) => {
  return (
    <div className="mb-4 flex items-start flex-col md:flex-row">
      {title &&
        <h1 className="text-xs font-semibold mb-2 w-full md:w-1/5">
            {title}
        </h1>
      }
      <input
        type='number'
        className="w-full md:w-4/5 p-2 text-xs max-w-md border outline-none rounded-md"
        placeholder={sub}
      />
    </div>
  );
};

export default Number;