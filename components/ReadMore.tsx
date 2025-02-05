"use client";
import { useState, isValidElement, Children, ReactNode } from "react";

interface ReadMoreProps {
  height: string;
  children: ReactNode;
}

const ReadMore = ({ height, children }: ReadMoreProps) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  const text = Children.toArray(children)
    .filter(Boolean)
    .map((child) => {
      if (isValidElement(child) && child.type) {
        return child.props.children;
      }
      return null;
    })
    .filter(Boolean)
    .join(" ");

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="relative description">
      <div
        className={`overflow-hidden description ${isExpanded ? "" : height}`}
      >
        {children}
      </div>
      <button
        onClick={toggleReadMore}
        className="text-main hover:text-main cursor-pointer uppercase font-bold outline-none block"
      >
        {isExpanded ? "Read More" : "Read Less"}
      </button>
    </div>
  );
};

export default ReadMore;
