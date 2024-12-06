"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ClientPageRoot } from "next/dist/client/components/client-page";

interface BannerItem {
  img: string;
  link: string;
  title: string;
}

interface BannerProps {
  elementItem: any;
}

const NewBanner: React.FC<BannerProps> = ({ elementItem }) => {
  const {
    titleAlignment,
    desktopGrid,
    mobileGrid,
    margin,
    padding,
    gridStyle,
    imagePosition,
    bannerId,
    width,
    boxText,
    boxBg,
    height,
  } = elementItem;

  const items = bannerId?.banners;
  const [startIndex, setStartIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(desktopGrid);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSwiping, setIsSwiping] = useState(false);
  const [startX, setStartX] = useState(0);

  const handleNext = () => {
    setStartIndex((prevIndex) => (prevIndex + 1) % items?.length);
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
      else if (window.innerWidth < 768) setItemsToShow(desktopGrid); // Small tablets
      else setItemsToShow(desktopGrid); // Desktops
    };

    updateItemsToShow();
    window.addEventListener('resize', updateItemsToShow);
    return () => window.removeEventListener('resize', updateItemsToShow);
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

  const displayedItems = items?.slice(startIndex, startIndex + itemsToShow)
    .concat(items.slice(0, Math.max(0, startIndex + itemsToShow - items.length)));

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
            className={`flex overflow-hidden w-full ${margin === 0
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
          {displayedItems.map((post: BannerItem, index: number) => (
            <div
              key={index}
              className="transition-opacity duration-500 w-full"
              style={{ flex: `0 0 ${itemWidth}%`}}
            >
              <Link
                href={post.link}
                className="flex-col flex relative rounded overflow-hidden hover:shadow-md w-full"
              >
                <Image
                  src={post.img}
                  width={width}
                  height={height}
                  alt={post.title}
                  quality={100}
                  className={`hover:scale-[1.01] transition-all duration-500 w-full h-full ${
                    padding === 0
                      ? "p-0"
                      : padding === 1
                      ? "p-0.5"
                      : padding === 2
                      ? "p-1"
                      : padding === 3
                      ? "p-1.5"
                      : padding === 4
                      ? "p-2"
                      : padding === 5
                      ? "p-2.5"
                      : padding === 6
                      ? "p-3"
                      : padding === 7
                      ? "p-3.5"
                      : padding === 8
                      ? "p-4"
                      : padding === 9
                      ? "p-[18px]"
                      : padding === 10
                      ? "p-5"
                      : ""
                  }`}
                  style={{
                    backgroundColor: boxBg || "#000000",
                  }}
                />
                {post.title &&
                  <p className={`text-sm pt-0 ${
                    titleAlignment === "left"
                      ? "text-left"
                      : titleAlignment === "right"
                      ? "text-right"
                      : titleAlignment === "center"
                      ? "text-center"
                      : ""
                    } ${
                      padding === 0
                      ? "p-0"
                      : padding === 1
                      ? "p-0.5"
                      : padding === 2
                      ? "p-1"
                      : padding === 3
                      ? "p-1.5"
                      : padding === 4
                      ? "p-2"
                      : padding === 5
                      ? "p-2.5"
                      : padding === 6
                      ? "p-3"
                      : padding === 7
                      ? "p-3.5"
                      : padding === 8
                      ? "p-4"
                      : padding === 9
                      ? "p-[18px]"
                      : padding === 10
                      ? "p-5"
                      : ""
                    }`}
                    style={{
                      color: boxText || "#ffffff",
                      backgroundColor: boxBg || "#000000",
                    }}
                  >
                    {post.title}
                  </p>
                }
              </Link>
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
          className={`grid grid-cols-${mobileGrid} md:grid-cols-${desktopGrid} ${margin === 0
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
          {bannerId?.banners.map((post: any, postIndex: any) => (
            <Link
              href={post.link}
              className="flex-col flex relative rounded overflow-hidden hover:shadow-md"
              key={postIndex}
            >
              <Image
                src={post.img}
                width={width}
                height={height}
                alt={post.title}
                quality={100}
                className={`hover:scale-[1.01] transition-all duration-500 w-full h-full ${
                  padding === 0
                    ? "p-0"
                    : padding === 1
                    ? "p-0.5"
                    : padding === 2
                    ? "p-1"
                    : padding === 3
                    ? "p-1.5"
                    : padding === 4
                    ? "p-2"
                    : padding === 5
                    ? "p-2.5"
                    : padding === 6
                    ? "p-3"
                    : padding === 7
                    ? "p-3.5"
                    : padding === 8
                    ? "p-4"
                    : padding === 9
                    ? "p-[18px]"
                    : padding === 10
                    ? "p-5"
                    : ""
                }`}
                style={{
                  backgroundColor: boxBg || "#000000",
                }}
              />
              {post.title &&
                <p className={`text-sm pt-0 ${
                  titleAlignment === "left"
                    ? "text-left"
                    : titleAlignment === "right"
                    ? "text-right"
                    : titleAlignment === "center"
                    ? "text-center"
                    : ""
                  } ${
                    padding === 0
                    ? "p-0"
                    : padding === 1
                    ? "p-0.5"
                    : padding === 2
                    ? "p-1"
                    : padding === 3
                    ? "p-1.5"
                    : padding === 4
                    ? "p-2"
                    : padding === 5
                    ? "p-2.5"
                    : padding === 6
                    ? "p-3"
                    : padding === 7
                    ? "p-3.5"
                    : padding === 8
                    ? "p-4"
                    : padding === 9
                    ? "p-[18px]"
                    : padding === 10
                    ? "p-5"
                    : ""
                  }`}
                  style={{
                    color: boxText || "#ffffff",
                    backgroundColor: boxBg || "#000000",
                  }}
                >
                  {post.title}
                </p>
              }
            </Link>
          ))}
        </div>
      ) : gridStyle === "3" ? (
        <div className={`col-span-12 grid grid-cols-6 md:grid-cols-12 ${margin === 0
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
            <div className={`grid grid-cols-2 md:grid-cols-1 ${margin === 0
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
              {bannerId.banners.slice(1, 3).map((post: any, postIndex: any) => (
                <Link
                  href={post.link}
                  className="flex-col flex bg-white rounded overflow-hidden hover:shadow-md"
                  key={postIndex}
                >
                  <Image
                    src={post.img}
                    width={width}
                    height={height}
                    alt={post.title}
                    quality={100}
                    className={`w-full h-full ${
                      padding === 0
                        ? "p-0"
                        : padding === 1
                        ? "p-0.5"
                        : padding === 2
                        ? "p-1"
                        : padding === 3
                        ? "p-1.5"
                        : padding === 4
                        ? "p-2"
                        : padding === 5
                        ? "p-2.5"
                        : padding === 6
                        ? "p-3"
                        : padding === 7
                        ? "p-3.5"
                        : padding === 8
                        ? "p-4"
                        : padding === 9
                        ? "p-[18px]"
                        : padding === 10
                        ? "p-5"
                        : ""
                    }`}
                  />
                  {post.title &&
                    <p className={`text-sm pt-0 ${
                      titleAlignment === "left"
                        ? "text-left"
                        : titleAlignment === "right"
                        ? "text-right"
                        : titleAlignment === "center"
                        ? "text-center"
                        : ""
                      } ${
                        padding === 0
                        ? "p-0"
                        : padding === 1
                        ? "p-0.5"
                        : padding === 2
                        ? "p-1"
                        : padding === 3
                        ? "p-1.5"
                        : padding === 4
                        ? "p-2"
                        : padding === 5
                        ? "p-2.5"
                        : padding === 6
                        ? "p-3"
                        : padding === 7
                        ? "p-3.5"
                        : padding === 8
                        ? "p-4"
                        : padding === 9
                        ? "p-[18px]"
                        : padding === 10
                        ? "p-5"
                        : ""
                      }`}
                    >
                      {post.title}
                    </p>
                  }
                </Link>
              ))}
            </div>
          </div>
          <div className={`col-span-12 md:col-span-6 ${imagePosition === "right"
              ? "order-last"
              : imagePosition === "left"
              ? "order-first"
              : ""
              }`}>
            <div className={`grid grid-cols-1 ${margin === 0
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
              {bannerId.banners[0] && (
                <Link
                  href={bannerId.banners[0].link}
                  className="flex-col flex bg-white rounded overflow-hidden hover:shadow-md"
                >
                  <Image
                    src={bannerId.banners[0].img}
                    width={width}
                    height={height}
                    alt={bannerId.banners[0].title}
                    quality={100}
                    className={`w-full h-full ${
                      padding === 0
                        ? "p-0"
                        : padding === 1
                        ? "p-0.5"
                        : padding === 2
                        ? "p-1"
                        : padding === 3
                        ? "p-1.5"
                        : padding === 4
                        ? "p-2"
                        : padding === 5
                        ? "p-2.5"
                        : padding === 6
                        ? "p-3"
                        : padding === 7
                        ? "p-3.5"
                        : padding === 8
                        ? "p-4"
                        : padding === 9
                        ? "p-[18px]"
                        : padding === 10
                        ? "p-5"
                        : ""
                    }`}
                  />
                  {bannerId.banners[0].title &&
                    <p className={`text-sm pt-0 ${
                      titleAlignment === "left"
                        ? "text-left"
                        : titleAlignment === "right"
                        ? "text-right"
                        : titleAlignment === "center"
                        ? "text-center"
                        : ""
                      } ${
                        padding === 0
                        ? "p-0"
                        : padding === 1
                        ? "p-0.5"
                        : padding === 2
                        ? "p-1"
                        : padding === 3
                        ? "p-1.5"
                        : padding === 4
                        ? "p-2"
                        : padding === 5
                        ? "p-2.5"
                        : padding === 6
                        ? "p-3"
                        : padding === 7
                        ? "p-3.5"
                        : padding === 8
                        ? "p-4"
                        : padding === 9
                        ? "p-[18px]"
                        : padding === 10
                        ? "p-5"
                        : ""
                      }`}
                    >
                      {bannerId.banners[0].title}
                    </p>
                  }
                </Link>
              )}
            </div>
          </div>
          <div className="col-span-12 md:col-span-3">
            <div className={`grid grid-cols-2 md:grid-cols-1 ${margin === 0
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
              {bannerId.banners.slice(3).map((post: any, postIndex: any) => (
                <Link
                  href={post.link}
                  className="flex-col flex bg-white rounded overflow-hidden hover:shadow-md"
                  key={postIndex + 3}
                >
                  <Image
                    src={post.img}
                    width={width}
                    height={height}
                    alt={post.title}
                    quality={100}
                    className={`w-full h-full ${
                      padding === 0
                        ? "p-0"
                        : padding === 1
                        ? "p-0.5"
                        : padding === 2
                        ? "p-1"
                        : padding === 3
                        ? "p-1.5"
                        : padding === 4
                        ? "p-2"
                        : padding === 5
                        ? "p-2.5"
                        : padding === 6
                        ? "p-3"
                        : padding === 7
                        ? "p-3.5"
                        : padding === 8
                        ? "p-4"
                        : padding === 9
                        ? "p-[18px]"
                        : padding === 10
                        ? "p-5"
                        : ""
                    }`}
                  />
                  {post.title &&
                    <p className={`text-sm pt-0 ${
                      titleAlignment === "left"
                        ? "text-left"
                        : titleAlignment === "right"
                        ? "text-right"
                        : titleAlignment === "center"
                        ? "text-center"
                        : ""
                      } ${
                        padding === 0
                        ? "p-0"
                        : padding === 1
                        ? "p-0.5"
                        : padding === 2
                        ? "p-1"
                        : padding === 3
                        ? "p-1.5"
                        : padding === 4
                        ? "p-2"
                        : padding === 5
                        ? "p-2.5"
                        : padding === 6
                        ? "p-3"
                        : padding === 7
                        ? "p-3.5"
                        : padding === 8
                        ? "p-4"
                        : padding === 9
                        ? "p-[18px]"
                        : padding === 10
                        ? "p-5"
                        : ""
                      }`}
                    >
                      {post.title}
                    </p>
                  }
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : gridStyle === "4" ? (
        <></>
      ) : (
        <></>
      )}
    </>
  );
};

export default NewBanner;