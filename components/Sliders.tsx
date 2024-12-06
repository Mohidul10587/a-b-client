"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

interface SliderItem {
  img: string;
  link: string;
}

interface SlidersProps {
  items: SliderItem[];
}

const Sliders: React.FC<SlidersProps> = ({ items }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [autoplayInterval, setAutoplayInterval] = useState(30000); // Default autoplay interval is 30 seconds

  const nextImage = () => {
    setCurrentImage((prevIndex) =>
      prevIndex === items.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImage((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextImage();
    }, autoplayInterval);

    return () => clearInterval(interval);
  }, [autoplayInterval]); // Re-run effect if autoplayInterval changes

  const handleDotClick = (index: number) => {
    setCurrentImage(index);
  };

  return (
    <div className="relative group">
      <div className="w-full bg-white p-2 relative h-40 md:h-96 flex items-center justify-center">
        <Image
          width={1900}
          height={600}
          src={items[currentImage]?.img || "/default.jpg"}
          alt={`Slide ${currentImage + 1}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute flex md:group-hover:flex md:hidden justify-between w-full items-center gap-2">
          <div
            onClick={prevImage}
            className="bg-black flex items-center justify-center opacity-50 w-8 md:h-16 h-10 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="m15 4l2 2l-6 6l6 6l-2 2l-8-8z"
              />
            </svg>
          </div>
          <div
            onClick={nextImage}
            className="bg-black flex items-center justify-center opacity-50 w-8 md:h-16 h-10 text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                fillRule="evenodd"
                d="m9.005 4l8 8l-8 8L7 18l6.005-6L7 6z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute bottom-4 left-0 right-0 group-hover:flex hidden justify-center">
        {items.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full mx-1 cursor-pointer ${
              currentImage === index ? "bg-black" : "bg-gray-300"
            }`}
            onClick={() => handleDotClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sliders;
