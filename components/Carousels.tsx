"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

interface CarouselItem {
  img: string;
  link: string;
  title: string;
  featured: string;

  sellingPrice: string;
}

interface CarouselProps {
  items: CarouselItem[];
  desktops: number;
  tablets: number;
  mobile: number;
}

const Carousels: React.FC<CarouselProps> = ({
  items,
  desktops,
  tablets,
  mobile,
}) => {
  const [startIndex, setStartIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(desktops);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handlePrevious = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  // Autoplay functionality
  useEffect(() => {
    const interval = setInterval(handleNext, 10000); // Change every 9 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Update the number of items to show based on the screen size
  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 640) setItemsToShow(mobile); // Mobile
      else if (window.innerWidth < 768)
        setItemsToShow(tablets); // Small tablets
      else setItemsToShow(desktops); // Desktops
    };

    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, [desktops, tablets, mobile]);

  const displayedItems = items
    .slice(startIndex, startIndex + itemsToShow)
    .concat(
      items.slice(0, Math.max(0, startIndex + itemsToShow - items.length))
    );

  const itemWidth = 100 / itemsToShow;

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="flex overflow-hidden transition-transform duration-500"
      >
        {displayedItems.map((item, index) => (
          <div
            key={index}
            className="p-0.5 transition-opacity duration-500"
            style={{
              flex: `0 0 ${itemWidth}%`,
              transform: `transform: translateX(0.5rem)`,
            }}
          >
            <Link
              href={item.link}
              className="block border bg-white p-2 rounded-md"
            >
              <div className="flex items-center justify-center relative h-44 md:h-60">
                <Image
                  src={item.img}
                  width={600}
                  height={600}
                  alt={item.title}
                  className="w-min h-full object-cover"
                />
              </div>
              <div className="mt-1 flex flex-col items-start space-y-1">
                <h3 className="text-md leading-tight line-clamp-2">
                  {item.title}
                </h3>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <div>
        <button onClick={handlePrevious} className="border rounded-sm">
          Previous
        </button>
        <button onClick={handleNext} className="border rounded-sm">
          Next
        </button>
      </div>
    </div>
  );
};

export default Carousels;
