"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

type Slide = {
  image: string;
};

type SliderProps = {
  slides: Slide[];
};

const Slider: React.FC<SliderProps> = ({ slides }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const prevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    // Auto-play functionality
    const intervalId = setInterval(() => {
      nextImage();
    }, 10000); // Change the interval time (in milliseconds) as needed

    return () => {
      clearInterval(intervalId);
    };
  }, [currentImage]); // Reset the interval whenever the currentImage changes

  return (
    <div className="flex flex-col group items-start md:mb-8">
      {slides.length > 1 && (
        <div className="w-full bg-white p-2 relative h-72 md:h-96 flex items-center justify-center">
          <Image
            width={600}
            height={600}
            src={slides[currentImage].image || "/default.jpg"}
            alt={`Slide ${currentImage + 1}`}
            className="md:h-min h-full w-fit"
          />
          <div className="absolute group-hover:flex hidden justify-between w-full items-center gap-2">
            <div
              onClick={prevImage}
              className="bg-black flex items-center justify-center opacity-50 w-10 h-10 rounded-full text-white"
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
              className="bg-black flex items-center justify-center opacity-50 w-10 h-10 rounded-full text-white"
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
      )}
      {slides.length <= 1 && (
        <div className="w-full bg-white p-4 relative max-h-72 flex items-center justify-center">
          <Image
            src={slides[0]?.image || "/default.jpg"}
            alt={"Product image"}
            width={500}
            height={500}
            className="h-full w-min"
          />
        </div>
      )}
      {slides.length > 1 && (
        <div className="flex md:flex-wrap flex-row gap-1 md:overflow-auto overflow-x-auto w-full mt-2">
          {slides.map((slide, index) => (
            <Image
              width={50}
              height={50}
              key={index}
              src={slide.image || "/default.jpg"}
              alt={`Thumbnail ${index + 1}`}
              className={`flex-none cursor-pointer w-20 h-20 object-cover bg-white border-2 ${
                currentImage === index ? "border-blue-500" : "border-white"
              }`}
              onClick={() => setCurrentImage(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Slider;
