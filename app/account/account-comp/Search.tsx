"use client";
import { useSettings } from "@/app/context/AppContext";
import { apiUrl } from "@/app/shared/urls";
import { IProduct } from "@/types/product";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Spinner from "./Spinner";

const Search = () => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState<IProduct[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchedProductTitle, setSearchProductTitle] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
        setSearchText("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchText && searchText !== "") {
      setIsLoading(true);
      fetch(`${apiUrl}/product/search/search-by-title?title=${searchText}`)
        .then((response) => response.json())
        .then((data) => {
          setResults(data);
          setIsDropdownVisible(true);
          setIsLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching search results:", error);
          setIsLoading(false);
        });
    } else {
      setIsDropdownVisible(false);
    }
  }, [searchText]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  const handleDropdownClick = (product: IProduct) => {
    setSearchProductTitle(product.title);
    setIsDropdownVisible(false);
    setSearchText("");
  };

  const settings = useSettings();

  return (
    <div className="w-full max-w-xl">
      <div className="relative w-full" ref={containerRef}>
        <div className="w-full flex bg-white items-center overflow-hidden md:rounded-full rounded">
          <input
            type="text"
            placeholder="Search your products"
            value={searchText}
            onChange={handleInputChange}
            className="px-4 h-10 w-full outline-none"
          />
          {isLoading && <Spinner />}
        </div>
        {isDropdownVisible && (
          <div className="absolute divide-y w-full p-2 bg-white z-10 rounded-2xl overflow-y-auto max-h-96">
            {results.length > 0 ? (
              <ul>
                {results.map((product) => (
                  <li
                    key={product._id}
                    className="py-1 cursor-pointer"
                    onClick={() => handleDropdownClick(product)}
                  >
                    <Link href={`/${product.slug}`}>
                      <div className="flex w-full gap-x-2 items-center">
                        <div className="w-16">
                          <Image
                            src={product.img}
                            alt={product.title}
                            width={50}
                            height={16}
                            className="border"
                            unoptimized
                          />
                        </div>
                        <div>
                          <h3 className="text-base font-semibold">
                            {product.title}
                          </h3>
                          <div className="flex justify-between w-full items-center line-clamp-1">
                            <p className="text-gray-500">
                              {settings?.currencySymbol}{" "}
                              {new Intl.NumberFormat().format(product.price)}
                            </p>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 12 24"
                            >
                              <path
                                fill="currentColor"
                                fillRule="evenodd"
                                d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414"
                              />
                            </svg>
                            <p className="text-gray-500 flex items-center">
                              <span>{product.stockStatus}</span>
                            </p>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              viewBox="0 0 12 24"
                            >
                              <path
                                fill="currentColor"
                                fillRule="evenodd"
                                d="M10.157 12.711L4.5 18.368l-1.414-1.414l4.95-4.95l-4.95-4.95L4.5 5.64l5.657 5.657a1 1 0 0 1 0 1.414"
                              />
                            </svg>
                            <p className="text-gray-500 flex items-center">
                              <span> {product.category.categoryName}</span>
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center">Oops! No product found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
