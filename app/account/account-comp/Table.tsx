"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import ToggleSwitch from "./ToggleSwitch";

interface Deal {
  title: string;
  link: string;
  img: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  merchant: string;
  activity: {
    likes: number;
    comments: number;
    views: number;
  };
}

interface TableProps {
  title: string;
  link?: string;
  items: Deal[];
}

const Table: React.FC<TableProps> = ({ items, title, link }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter items based on the search query
  const filteredItems = items.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalItems = filteredItems.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearch}
            className="mt-2 md:mt-0 p-2 border outline-0 rounded-md w-full max-w-sm"
          />
          {title && (
            <Link
              href={`link`}
              className="bg-main text-white px-4 py-2 rounded ml-2 text-nowrap"
            >
              {title} add
            </Link>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Merchant</th>
              <th className="py-3 px-6 text-left">Activity</th>
              <th className="py-3 px-6 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedItems.map((deal, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="py-3 px-6">
                  <Link
                    href={deal.link}
                    className="flex items-center md:max-w-sm md:w-full w-96"
                  >
                    <Image
                      src={deal.img}
                      width={70}
                      height={50}
                      alt=""
                      className="mr-2"
                    />
                    <span className="line-clamp-2 font-normal text-sm w-full">
                      {deal.title}
                    </span>
                  </Link>
                </td>
                <td className="py-3 px-6 text-sm">
                  <div className="flex items-center">
                    <span className="font-semibold text-lg">{deal.price}</span>
                    {deal.originalPrice && (
                      <del className="ml-2 text-gray-400 font-normal">
                        {deal.originalPrice}
                      </del>
                    )}
                  </div>
                  {deal.discount && (
                    <span className="text-green-700">{deal.discount}</span>
                  )}
                </td>
                <td className="py-3 px-6 text-sm text-nowrap whitespace-nowrap">
                  {deal.merchant}
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center divide-x gap-3 text-nowrap whitespace-nowrap">
                    <span className="flex items-center text-nowrap whitespace-nowrap">
                      👍 {deal.activity.likes}
                    </span>
                    <span className="flex items-center text-nowrap whitespace-nowrap">
                      💬 {deal.activity.comments}
                    </span>
                    <span className="flex items-center text-nowrap whitespace-nowrap">
                      👁️ {deal.activity.views.toLocaleString()}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-6">
                  <div className="text-sm flex items-center justify-end gap-2">
                    <Link href="/">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="25"
                        height="25"
                        viewBox="0 0 24 24"
                      >
                        <g
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                        >
                          <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                          <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                        </g>
                      </svg>
                    </Link>
                    <Link href="/">
                      <svg
                        className="text-red-500"
                        xmlns="http://www.w3.org/2000/svg"
                        width="35"
                        height="35"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fill="currentColor"
                          d="M7.616 20q-.672 0-1.144-.472T6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.153T16.384 20zM17 6H7v12.385q0 .269.173.442t.443.173h8.769q.23 0 .423-.192t.192-.424zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z"
                        />
                      </svg>
                    </Link>
                    <ToggleSwitch switch="enable" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
