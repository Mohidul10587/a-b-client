"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IBanner } from "@/types/banner";

interface BannerItem {
  img: string;
  link: string;
  title: string;
}

interface BannerProps {
  items: IBanner[];
}

const Banner: React.FC<BannerProps> = ({ items }) => {
  // State for controlling the current image index in the slider
  const [currentImage, setCurrentImage] = useState(0);

  // Function to handle the click on the next image in the slider
  const nextImage = () => {
    setCurrentImage((prevIndex) =>
      prevIndex === items[currentImage].banners.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to handle the click on the previous image in the slider
  const prevImage = () => {
    setCurrentImage((prevIndex) =>
      prevIndex === 0 ? items[currentImage].banners.length - 1 : prevIndex - 1
    );
  };

  // Function to handle click on the dot in the slider to navigate to specific image
  const handleDotClick = (index: number) => {
    setCurrentImage(index);
  };

  // Sort items based on position
  const sortedItems = [...items].sort((a, b) => a.position - b.position);

  return (
    <>
      {sortedItems?.map((item, index) => (
        <div className="container my-2" key={index}>
          {item.display == "2" ? (
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p>Popular categories on Price in Kenya</p>
              </div>
              <Link
                href="/category"
                className="bg-white px-3 py-1.5 font-bold hover:shadow-md rounded-md hidden md:block"
              >
                All categories
              </Link>
            </div>
          ) : null}
          {item.style === "1" ? (
            <div className="relative group">
              <div className="w-full bg-white p-2 relative flex items-center justify-center">
                <Image
                  width={1900}
                  height={600}
                  src={item.banners[currentImage]?.img} // Add optional chaining here
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
                {item.banners.map((_, index) => (
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
          ) : (
            <div
              className={`grid grid-cols-${item.mobileGrid} md:grid-cols-${item.desktopGrid} gap-2`}
              // className={`grid grid-cols-${item.mgrid} md:grid-cols-6 gap-2`}
            >
              {item.banners.map((post: any, postIndex: any) => (
                <Link
                  href={"post.link"}
                  className="p-2 flex-col flex items-center bg-white rounded-md hover:shadow-md"
                  key={postIndex}
                >
                  <Image
                    src={post.img}
                    width={item.width}
                    height={item.height}
                    alt={post.title}
                  />
                  {post.title && <p className="pt-2">{post.title}</p>}
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </>
  );
};

export default Banner;
