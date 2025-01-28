"use client";

import { fetcher } from "@/app/shared/fetcher";
import Image from "next/image";
import { ReactNode, useEffect, useState } from "react";
import useSWR from "swr";

const ImageGallery: React.FC<{
  children?: ReactNode;
  isOpen: boolean;
  setData: any;
  data: any;
  onClose: () => void;
  img: string;
}> = ({ isOpen, onClose, setData, img, data: formData }) => {
  const [query, setQuery] = useState<string>("");
  const [useCase, setUseCase] = useState<string>("");
  const [timeFilter, setTimeFilter] = useState<string>(""); // New state for time filter
  const [filteredResults, setFilteredResults] = useState<any[]>([]);

  const { data, error, isLoading } = useSWR(`gallery/all`, fetcher);

  useEffect(() => {
    if (data?.result) {
      const lowerCaseQuery = query.toLowerCase();
      const now = new Date();

      const filtered = data.result
        .filter((item: any) => {
          const title = item.title.toLowerCase();
          const matchesTitle = lowerCaseQuery
            .split("")
            .every((char) => title.includes(char));
          const matchesUseCase = useCase ? item.useCase === useCase : true;

          // Time filter logic
          let matchesTime = true;
          if (timeFilter) {
            const itemDate = new Date(item.createdAt);
            switch (timeFilter) {
              case "lastDay":
                matchesTime =
                  now.getTime() - itemDate.getTime() <= 24 * 60 * 60 * 1000;
                break;
              case "lastWeek":
                matchesTime =
                  now.getTime() - itemDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
                break;
              case "lastMonth":
                matchesTime =
                  now.getTime() - itemDate.getTime() <=
                  30 * 7 * 24 * 60 * 60 * 1000;
                break;
            }
          }

          return matchesTitle && matchesUseCase && matchesTime;
        })
        .sort((a: any, b: any) => {
          const titleA = a.title.toLowerCase();
          const titleB = b.title.toLowerCase();

          const aIncludesQuery = titleA.includes(lowerCaseQuery);
          const bIncludesQuery = titleB.includes(lowerCaseQuery);

          if (aIncludesQuery && !bIncludesQuery) return -1;
          if (!aIncludesQuery && bIncludesQuery) return 1;

          const aMatchCount = lowerCaseQuery
            .split("")
            .filter((char) => titleA.includes(char)).length;
          const bMatchCount = lowerCaseQuery
            .split("")
            .filter((char) => titleB.includes(char)).length;

          return bMatchCount - aMatchCount;
        });

      setFilteredResults(filtered);
    }
  }, [data, query, useCase, timeFilter]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 py-12">
        <div className="relative bg-white p-6 rounded-lg shadow-lg overflow-y-auto h-[600px] w-8/12">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            Close
          </button>

          <div className="max-w-4xl mx-auto my-4 p-4">
            <h1 className="text-2xl font-semibold mb-4">Search Gallery</h1>
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by title..."
                className="p-2 border border-gray-300 rounded-md flex-grow"
              />
              <select
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="">All Use Cases</option>
                <option value="product">Product</option>
                <option value="category">Category</option>
                <option value="subcategory">Subcategory</option>
                <option value="childCategory">Child Category</option>
                <option value="brand">Brand</option>
                <option value="logo">Logo</option>
                <option value="banner">Banner</option>
                <option value="popup">Popup</option>
                <option value="others">Others</option>
              </select>

              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="p-2 border border-gray-300 rounded-md"
              >
                <option value="">Any time</option>
                <option value="lastDay">Last day</option>
                <option value="lastWeek">Last 7 days</option>
                <option value="lastMonth">Last 30 days</option>
              </select>
            </div>

            {isLoading && <p className="mt-4 text-lg">Loading...</p>}
            {error && <p className="mt-4 text-red-500">{error.message}</p>}

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredResults.length > 0 ? (
                filteredResults.map((item: any) => (
                  <div
                    key={item._id}
                    className="border p-4 rounded-md shadow-md"
                  >
                    <Image
                      src={`${item.img}`}
                      width={250}
                      height={50}
                      alt={item.title}
                      className="rounded-md"
                    />
                    <h2 className="text-xl font-semibold">{item.title}</h2>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          img === "img" &&
                            setData({ ...formData, img: item.img });
                          img == "metaImg" &&
                            setData({ ...formData, metaImg: item.img });
                          img == "attachedImgs" &&
                            setData({
                              ...formData,
                              attachedImgs: [
                                ...formData.attachedImgs,
                                item.img,
                              ],
                            });
                          onClose();
                        }}
                        className="text-red-500 hover:underline"
                      >
                        Use this image
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="mt-4">No results found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImageGallery;
