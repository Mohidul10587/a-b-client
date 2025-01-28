"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

import { mutate } from "swr";

export interface Post {
  _id: string;
  img: string;
  link: string;
  title: string;
}

interface TableProps {
  title: string;
  link: string;
  post: Post[];
  mutate?: () => void;
}

const Table: React.FC<TableProps> = ({ post, title, link }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const filteredPosts = post.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const nextPage = () => {
    if (currentPage * postsPerPage < filteredPosts.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="container my-4">
      <div className="mb-4 flex space-y-2 md:space-y-0 flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-xl font-bold">{title}</h1>
        <div className="flex items-center justify-between md:justify-normal space-x-2">
          <input
            type="text"
            placeholder="Search"
            className="p-1 border rounded outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {link && (
            <Link
              href={`${link}/add`}
              className="bg-main py-1 px-4 rounded-md text-white"
            >
              Add
            </Link>
          )}
        </div>
      </div>

      <table className="w-full text-left bg-white border">
        <thead>
          <tr className="w-full p-2 flex text-left border-b">
            <th className="w-[90px]">Image</th>
            <th className="w-[80%]">Title</th>
            <th className="w-[13%] hidden md:block">Action</th>
          </tr>
        </thead>
        <tbody className="w-full divide-y">
          {currentPosts.map((p, index) => (
            <tr
              key={index}
              className="w-full p-2 flex flex-row md:items-center text-left"
            >
              <td className="w-[80px] mr-2">
                <Image
                  src={p.img || "/default.jpg"}
                  width={100}
                  height={500}
                  alt={p.title}
                  className="w-20 h-16 object-cover"
                />
              </td>
              <td className="w-[72%] md:w-[75%]">
                <Link
                  href={`brand/${p._id}`}
                  target="_blank"
                  className="text-blue-500 hover:underline line-clamp-2"
                >
                  {p.title}
                </Link>
              </td>
              <td className="md:w-[16%]">
                <div className="flex md:flex-row flex-col md:items-center items-end justify-end md:space-x-4 md:space-y-0 space-y-2 font-bold">
                  <Link href={`${link}/edit/${p._id}`} className="">
                    Edit
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex justify-between mt-4">
        <button
          onClick={prevPage}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded disabled:opacity-50"
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <button
          onClick={nextPage}
          className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded disabled:opacity-50"
          disabled={currentPage * postsPerPage >= filteredPosts.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
