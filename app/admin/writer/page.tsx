"use client";

import { apiUrl } from "@/app/shared/urls";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import LoadingComponent from "@/components/loading";

interface Writer {
  _id: string;
  title: string;
  description: string;
  rating: number;
  img: string;
}

const IndexPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [writers, setWriters] = useState<Writer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const postsPerPage = 10;

  // Fetch all writers
  useEffect(() => {
    const fetchWriters = async () => {
      try {
        const response = await fetch(`${apiUrl}/writer/all`);
        if (response.ok) {
          const data = await response.json();
          setWriters(data.writers);
        } else {
          throw new Error("Failed to fetch writers");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchWriters();
  }, []);

  // Filtered + paginated writers
  const filteredWriters = writers.filter((writer) =>
    writer.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentWriters = filteredWriters.slice(indexOfFirst, indexOfLast);

  const nextPage = () => {
    if (indexOfLast < filteredWriters.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const deleteWriter = async (id: string) => {
    const confirmed = confirm("Are you sure you want to delete this writer?");
    if (!confirmed) return;

    try {
      const response = await fetch(`${apiUrl}/writer/deleteWriter/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setWriters((prev) => prev.filter((w) => w._id !== id));
      } else {
        throw new Error("Failed to delete writer");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container my-6 px-2 sm:px-4">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="text-xl font-bold">Writers</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset to first page when searching
            }}
            className="border px-2 py-1 rounded w-full md:w-64"
          />
          <Link
            href="/admin/writer/add"
            className="bg-main py-2 px-4 rounded-md text-white"
          >
            Add
          </Link>
        </div>
      </div>

      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white p-4 rounded shadow">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 text-left">Photo</th>
                  <th className="py-2 text-left">Name</th>
                  <th className="py-2 text-left">Rating</th>
                  <th className="py-2 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentWriters.map((writer) => (
                  <tr key={writer._id} className="border-t">
                    <td className="py-2">
                      <Image
                        src={writer.img || "/defaultUser.jpeg"}
                        alt={writer.title}
                        width={60}
                        height={60}
                        className="w-16 h-16 object-cover rounded-full"
                      />
                    </td>
                    <td className="py-2">{writer.title}</td>
                    <td className="py-2">{writer.rating}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        className="btnO inline-block"
                        href={`/admin/writer/${writer._id}`}
                      >
                        Edit
                      </Link>
                      <button
                        className="btnR inline-block"
                        onClick={() => deleteWriter(writer._id)}
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
            {currentWriters.map((writer) => (
              <div
                key={writer._id}
                className="bg-white p-4 shadow rounded-lg flex flex-col sm:flex-row gap-3"
              >
                <div className="flex gap-4 items-center">
                  <Image
                    src={writer.img || "/defaultUser.jpeg"}
                    alt={writer.title}
                    width={60}
                    height={60}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{writer.title}</h3>
                    <p className="text-sm text-gray-600">
                      Rating: {writer.rating}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    className="flex-1 bg-red-500 text-white py-2 text-sm rounded"
                    onClick={() => deleteWriter(writer._id)}
                  >
                    Delete
                  </button>
                  <Link
                    href={`/admin/writer/${writer._id}`}
                    className="flex-1 bg-orange-500 text-white py-2 text-sm rounded text-center"
                  >
                    Edit
                  </Link>
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
              disabled={indexOfLast >= filteredWriters.length}
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
