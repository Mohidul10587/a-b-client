"use client";

import { useData } from "@/app/DataContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const PopUp = () => {
  const { settings } = useData();
  const [isVisible, setIsVisible] = useState(true);
  const handleClose = () => {
    setIsVisible(false);
  };
  if (!isVisible) return null;
  return (
    <>
      {settings?.popUpImgStatus && (
        <div className="fixed bottom-16 md:bottom-3 left-3 z-50 group">
          <div className="relative">
            <Link
              href={settings?.popUpImgLink || "#"}
              className="relative fadeInLeft"
            >
              <Image
                src={settings?.popUpImg}
                width={300}
                height={300}
                alt="PopUp"
                className="w-min md:max-w-80 max-w-60 h-min rounded"
              />
            </Link>
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 bg-white opacity-20 group-hover:opacity-100 rounded-full p-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="15"
                height="15"
                viewBox="0 0 16 16"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  d="m7.116 8l-4.558 4.558l.884.884L8 8.884l4.558 4.558l.884-.884L8.884 8l4.558-4.558l-.884-.884L8 7.116L3.442 2.558l-.884.884z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default PopUp;
