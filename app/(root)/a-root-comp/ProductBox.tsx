"use client";
import React, { useState, useEffect, useRef } from "react";
import { IProduct } from "@/types/product";
import Product from "@/components/Product.home";

interface ProductBoxProps {
  items: IProduct[];
  elementItem?: any;
}

const ProductBox: React.FC<ProductBoxProps> = ({ items, elementItem }) => {
  const { desktopGrid, mobileGrid, gridStyle, margin, imagePosition } =
    elementItem;

  const [startIndex, setStartIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(desktopGrid);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const handlePrevious = () => {
    setStartIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  // Autoplay functionality
  useEffect(() => {
    const interval = setInterval(handleNext, 10000); // Change every 10 seconds
    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Update the number of items to show based on the screen size
  useEffect(() => {
    const updateItemsToShow = () => {
      if (window.innerWidth < 640) setItemsToShow(mobileGrid); // Mobile
      else setItemsToShow(desktopGrid); // Desktops
    };

    updateItemsToShow();
    window.addEventListener("resize", updateItemsToShow);
    return () => window.removeEventListener("resize", updateItemsToShow);
  }, [desktopGrid, mobileGrid]);

  // Handling swipe functionality
  const handleMouseDown = (event: React.MouseEvent) => {
    setStartX(event.clientX);
    setIsSwiping(true);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isSwiping) return;
    const moveX = event.clientX - startX;

    if (moveX > 50) {
      handlePrevious();
      setIsSwiping(false);
    } else if (moveX < -50) {
      handleNext();
      setIsSwiping(false);
    }
  };

  const handleMouseUp = () => {
    setIsSwiping(false);
  };

  const displayedItems = items
    .slice(startIndex, startIndex + itemsToShow)
    .concat(
      items.slice(0, Math.max(0, startIndex + itemsToShow - items.length))
    );

  const itemWidth = 100 / itemsToShow;

  // Add event listeners for mouse events
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.addEventListener("mousemove", handleMouseMove);
      containerRef.current.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("mousemove", handleMouseMove);
        containerRef.current.removeEventListener("mouseup", handleMouseUp);
      }
    };
  }, [isSwiping]);

  return (
    <>
      {gridStyle === "1" ? (
        <div className="relative group">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            style={{ cursor: isSwiping ? "grabbing" : "grab" }}
            className={`flex overflow-hidden w-full ${
              margin === 0
                ? "gap-0"
                : margin === 1
                ? "gap-0.5"
                : margin === 2
                ? "gap-1"
                : margin === 3
                ? "gap-1.5"
                : margin === 4
                ? "gap-2"
                : margin === 5
                ? "gap-2.5"
                : margin === 6
                ? "gap-3"
                : margin === 7
                ? "gap-3.5"
                : margin === 8
                ? "gap-4"
                : margin === 9
                ? "gap-[18px]"
                : margin === 10
                ? "gap-5"
                : null
            }`}
          >
            {displayedItems.map((item, index) => (
              <div
                key={index}
                className="transition-opacity duration-500 w-full h-full"
                style={{ flex: `0 0 ${itemWidth}%` }}
              >
                <Product key={index} {...item} />
              </div>
            ))}
          </div>

          <div className="absolute -translate-y-1/2 top-1/2 flex md:group-hover:flex md:hidden justify-between w-full items-center gap-2">
            <div
              onClick={handlePrevious}
              className="bg-black/50 flex items-center justify-center opacity-50 w-6 h-10 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
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
              onClick={handleNext}
              className="bg-black/50 flex items-center justify-center opacity-50 w-6 h-10 text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
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
      ) : gridStyle === "2" ? (
        <div
          className={`grid grid-cols-${mobileGrid} md:grid-cols-${desktopGrid} ${
            margin === 0
              ? "gap-0"
              : margin === 1
              ? "gap-0.5"
              : margin === 2
              ? "gap-1"
              : margin === 3
              ? "gap-1.5"
              : margin === 4
              ? "gap-2"
              : margin === 5
              ? "gap-2.5"
              : margin === 6
              ? "gap-3"
              : margin === 7
              ? "gap-3.5"
              : margin === 8
              ? "gap-4"
              : margin === 9
              ? "gap-[18px]"
              : margin === 10
              ? "gap-5"
              : null
          }`}
        >
          {items?.map((item, index) => (
            <Product key={index} {...item} />
          ))}
        </div>
      ) : gridStyle === "3" ? (
        <div
          className={`col-span-12 grid grid-cols-6 md:grid-cols-12 ${
            margin === 0
              ? "gap-0"
              : margin === 1
              ? "gap-0.5"
              : margin === 2
              ? "gap-1"
              : margin === 3
              ? "gap-1.5"
              : margin === 4
              ? "gap-2"
              : margin === 5
              ? "gap-2.5"
              : margin === 6
              ? "gap-3"
              : margin === 7
              ? "gap-3.5"
              : margin === 8
              ? "gap-4"
              : margin === 9
              ? "gap-[18px]"
              : margin === 10
              ? "gap-5"
              : null
          }`}
        >
          <div className="col-span-12 md:col-span-3">
            <div
              className={`grid grid-cols-2 md:grid-cols-1 ${
                margin === 0
                  ? "gap-0"
                  : margin === 1
                  ? "gap-0.5"
                  : margin === 2
                  ? "gap-1"
                  : margin === 3
                  ? "gap-1.5"
                  : margin === 4
                  ? "gap-2"
                  : margin === 5
                  ? "gap-2.5"
                  : margin === 6
                  ? "gap-3"
                  : margin === 7
                  ? "gap-3.5"
                  : margin === 8
                  ? "gap-4"
                  : margin === 9
                  ? "gap-[18px]"
                  : margin === 10
                  ? "gap-5"
                  : null
              }`}
            >
              {items?.slice(1, 3).map((item, index) => (
                <Product key={index} {...item} />
              ))}
            </div>
          </div>
          <div
            className={`col-span-12 md:col-span-6 ${
              imagePosition === "right"
                ? "order-last"
                : imagePosition === "left"
                ? "order-first"
                : ""
            }`}
          >
            <div
              className={`grid grid-cols-1 ${
                margin === 0
                  ? "gap-0"
                  : margin === 1
                  ? "gap-0.5"
                  : margin === 2
                  ? "gap-1"
                  : margin === 3
                  ? "gap-1.5"
                  : margin === 4
                  ? "gap-2"
                  : margin === 5
                  ? "gap-2.5"
                  : margin === 6
                  ? "gap-3"
                  : margin === 7
                  ? "gap-3.5"
                  : margin === 8
                  ? "gap-4"
                  : margin === 9
                  ? "gap-[18px]"
                  : margin === 10
                  ? "gap-5"
                  : ""
              }`}
            >
              {items?.slice(0, 1).map((item, index) => (
                <Product key={index} {...item} />
              ))}
            </div>
          </div>
          <div className="col-span-12 md:col-span-3">
            <div
              className={`grid grid-cols-2 md:grid-cols-1 ${
                margin === 0
                  ? "gap-0"
                  : margin === 1
                  ? "gap-0.5"
                  : margin === 2
                  ? "gap-1"
                  : margin === 3
                  ? "gap-1.5"
                  : margin === 4
                  ? "gap-2"
                  : margin === 5
                  ? "gap-2.5"
                  : margin === 6
                  ? "gap-3"
                  : margin === 7
                  ? "gap-3.5"
                  : margin === 8
                  ? "gap-4"
                  : margin === 9
                  ? "gap-[18px]"
                  : margin === 10
                  ? "gap-5"
                  : null
              }`}
            >
              {items?.slice(3).map((item, index) => (
                <Product key={index} {...item} />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default ProductBox;
