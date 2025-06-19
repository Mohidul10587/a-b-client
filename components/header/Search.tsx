"use client";
import React, { useState, useEffect, useRef } from "react";
import useSWR from "swr";
import { apiUrl } from "@/app/shared/urls";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useData } from "@/app/DataContext";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }
    return res.json();
  });

const Search = () => {
  const { settings } = useData();
  const [query, setQuery] = useState(""); // Default search query
  const [isDisplay, setIsDisplay] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const path = usePathname();
  useEffect(() => {
    setIsDisplay(false);
    setQuery("");
  }, [path]);
  // Fetch data using SWR
  const { data, error, isLoading } = useSWR(
    query ? `${apiUrl}/product/search?title=${query}` : null,
    fetcher
  );

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsDisplay(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={searchRef} className="w-full max-w-xl hidden md:block">
      <div className="relative w-full">
        <div className="flex border bg-white items-center rounded overflow-hidden">
          <input
            type="text"
            placeholder="Search your products"
            value={query}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setQuery(event.target.value);
            }}
            onFocus={() => setIsDisplay(true)}
            className="px-4 py-2 w-full outline-none text-sm text-gray-700"
          />
        </div>
        {/* Display search results */}
        {isDisplay && (
          <div className="absolute border bg-white rounded w-full max-h-[500px] overflow-y-auto mt-2">
            {isLoading ? (
              <p className="p-4 text-sm text-gray-500">Loading...</p>
            ) : error ? (
              <p className="p-4 text-sm text-red-500">
                Failed to load results. Please try again.
              </p>
            ) : (
              <>
                {data && (
                  <div>
                    {data.products.map((item: any) => (
                      <Link href={`/${item.slug}`} key={item._id}>
                        <div className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
                          <Image
                            src={item.photo || "/default.jpg"}
                            height={40}
                            width={40}
                            alt={item.title}
                            className="rounded w-12 h-12"
                          />
                          <div className="flex flex-col">
                            <h3 className="text-sm font-medium text-gray-800 line-clamp-1">
                              {item.title}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {settings?.currencySymbol}{" "}
                              {new Intl.NumberFormat().format(item.price)}
                            </p>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {data?.sellers?.map((item: any) => (
                      <Link
                        key={item._id}
                        href={`/seller/${item.sellerId.slug}`}
                      >
                        <div className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
                          <Image
                            src={item.photo || "/default.jpg"}
                            height={40}
                            width={40}
                            alt={item.companyName}
                            className="h-12 w-12 rounded"
                          />
                          <div className="flex items-center justify-between w-full">
                            <h3 className="font-bold text-sm">
                              {item.companyName}
                            </h3>
                            <p className="text-xs">Sellers</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {data?.categories?.map((item: any) => (
                      <Link key={item._id} href={`/category/${item.slug}`}>
                        <div className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
                          <Image
                            src={item.photoUrl || "/default.jpg"}
                            height={40}
                            width={40}
                            alt={item.categoryName}
                            className="h-12 w-12 rounded"
                          />
                          <div className="flex items-center justify-between w-full">
                            <h3 className="font-bold text-sm">
                              {item.categoryName}
                            </h3>
                            <p className="text-xs">Categories</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {data?.brands?.map((item: any) => (
                      <Link key={item._id} href={`/brand/${item.slug}`}>
                        <div className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
                          <Image
                            src={item.photo || "/default.jpg"}
                            height={40}
                            width={40}
                            alt={item.title}
                            className="h-12 w-12 rounded"
                          />
                          <div className="flex items-center justify-between w-full">
                            <h3 className="font-bold text-sm">{item.title}</h3>
                            <p className="text-xs">Brands</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                    {data?.subCategories?.map((item: any) => (
                      <Link key={item._id} href={`/sub/${item.slug}`}>
                        <div className="flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer">
                          <Image
                            src={item.photo || "/default.jpg"}
                            height={40}
                            width={40}
                            alt={item.title}
                            className="h-12 w-12 rounded"
                          />
                          <div className="flex items-center justify-between w-full">
                            <h3 className="font-bold text-sm">{item.title}</h3>
                            <p className="text-xs">SubCategorie</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
