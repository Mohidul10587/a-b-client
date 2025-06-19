"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiUrl } from "@/app/shared/urls";
import LoadingComponent from "@/components/loading";
import Image from "next/image";

interface Banner {
  _id: string;
  title: string;
  banners: { img: string }[];
}

const IndexPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${apiUrl}/banner/all`, {
          method: "GET",
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setBanners(data);
        } else {
          setIsError(true);
        }
      } catch (error) {
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBanners();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this banner?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${apiUrl}/banner/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setBanners((prev) => prev.filter((b) => b._id !== id));
        alert("Banner deleted successfully.");
      } else {
        alert("Failed to delete banner.");
      }
    } catch (error) {
      alert("Failed to delete banner.");
    }
  };

  const filteredBanners = banners.filter((b) =>
    b.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentBanners = filteredBanners.slice(indexOfFirst, indexOfLast);

  const nextPage = () => {
    if (indexOfLast < filteredBanners.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (isLoading) return <LoadingComponent />;
  if (isError) return <p>Failed to load banners.</p>;

  return (
    <div className="container my-6 px-2 sm:px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="text-xl font-bold">Banners</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to first page on search
            }}
            className="border px-2 py-1 rounded w-full md:w-64"
          />
          <Link
            href="/admin/banner/add"
            className="bg-main py-2 px-4 rounded-md text-white"
          >
            Add
          </Link>
        </div>
      </div>

      {/* Banner Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow p-4">
        <table className="w-full table-auto text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4">Image</th>
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentBanners.map((banner) => (
              <tr key={banner._id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <Image
                    src={banner?.banners?.[0]?.img || "/placeholder.jpg"}
                    alt={banner.title}
                    width={80}
                    height={60}
                    className="w-20 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="py-3 px-4 font-medium">{banner.title}</td>
                <td className="py-3 px-4 text-right space-x-2">
                  <Link
                    href={`/admin/banner/${banner._id}`}
                    className="btnOrange inline-block"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="btnRed inline-block"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {currentBanners.length === 0 && (
              <tr>
                <td colSpan={3} className="text-center py-6 text-gray-500">
                  No banners found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
          disabled={indexOfLast >= filteredBanners.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default IndexPage;
