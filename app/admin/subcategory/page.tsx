"use client";

import useSWR from "swr";
import { fetcher } from "@/app/shared/fetcher";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import LoadingComponent from "@/components/loading";

interface Post {
  _id: string;
  img: string;
  title: string;
}

const IndexPage: React.FC = () => {
  const { data, isLoading, mutate } = useSWR(
    "subcategory/allSubcategoriesForAdminSubCatIndexPage",
    fetcher
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const posts: Post[] = data?.respondedData || [];

  const filteredPosts = posts.filter((p) =>
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

  const handleDelete = async (id: string) => {
    const confirmed = confirm(
      "Are you sure you want to delete this subcategory?"
    );
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/admin/subcategory/delete/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete subcategory");
      mutate(); // re-fetch updated data
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="container my-6 px-2 sm:px-4">
      {/* Top Bar */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className="text-xl font-bold">Subcategory List</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-2 py-1 rounded w-full md:w-64"
          />
          <Link
            href="/admin/subcategory/add"
            className="bg-main py-2 px-4 rounded-md text-white"
          >
            Add
          </Link>
        </div>
      </div>

      {/* Loading Spinner */}
      {isLoading ? (
        <LoadingComponent />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="py-2 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentPosts.map((p) => (
                  <tr key={p._id} className="border-t">
                    <td className="px-4 py-2">
                      <Image
                        src={p.img || "/default.jpg"}
                        alt={p.title}
                        width={80}
                        height={60}
                        className="w-20 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-2">{p.title}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        href={`/admin/subcategory/edit/${p._id}`}
                        className="btnO"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(p._id)}
                        className="btnR"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {currentPosts.map((p) => (
              <div
                key={p._id}
                className="bg-white rounded shadow p-4 flex flex-col sm:flex-row gap-4"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={p.img || "/default.jpg"}
                    alt={p.title}
                    width={80}
                    height={60}
                    className="w-20 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{p.title}</p>
                  </div>
                </div>
                <div className="mt-2 flex gap-4">
                  <Link
                    href={`/admin/subcategory/edit/${p._id}`}
                    className="btnO"
                  >
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(p._id)} className="btnR">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between mt-4">
            <button
              onClick={prevPage}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={nextPage}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
              disabled={currentPage * postsPerPage >= filteredPosts.length}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default IndexPage;
