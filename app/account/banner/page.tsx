"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiUrl } from "@/app/shared/urls";
import Banner from "@/components/Banner.admin";
import LoadingComponent from "@/components/loading";
import Image from "next/image";
import { useData } from "@/app/DataContext";

interface Banner {
  _id: string;
  title: string;
  banners: any;
}

const IndexPage: React.FC = () => {
  const { user, sessionStatus } = useData();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/seller/banner/all/${user.slug}`,
          {
            method: "GET",
            credentials: "include",
          }
        );
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

    if (user.slug) {
      fetchBanners();
    }
  }, [user]);

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
        setBanners(banners.filter((banner) => banner._id !== id));
        alert("Banner deleted successfully.");
      } else {
        alert("Failed to delete banner.");
      }
    } catch (error) {
      alert("Failed to delete banner.");
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredBanners = banners.filter((banner) =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredBanners.length / itemsPerPage);
  const displayedBanners = filteredBanners.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (isLoading || sessionStatus === "loading") {
    return <LoadingComponent />;
  }

  if (isError) {
    return <p>Failed to load banners.</p>;
  }

  return (
    <div className="container my-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h1 className="text-xl font-bold">Banners</h1>
        <div className="flex gap-2 items-center md:justify-end md:mt-0 mt-2">
          <input
            type="text"
            placeholder="Search banners..."
            className="border rounded outline-0 p-2 w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Link
            href="/account/banner/add"
            className="bg-main py-2 px-4 rounded-md text-white"
          >
            Add
          </Link>
        </div>
      </div>

      <>
        {displayedBanners.map((banner) => (
          <div
            key={banner._id}
            className="border p-2 bg-white mb-2 rounded-lg shadow hover:shadow-lg transition-shadow duration-200 flex justify-between"
          >
            <div className="flex items-center space-x-2">
              <Image
                src={banner?.banners[0].img}
                alt=""
                width={200}
                height={200}
                className="w-20 h-16 object-cover rounded"
                loading="lazy"
              />
              <h3 className="text-base font-medium mb-2">{banner.title}</h3>
            </div>
            <div className="flex justify-between items-center space-x-2">
              <Link
                href={`/account/banner/${banner._id}`}
                className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition-colors duration-200"
              >
                Edit
              </Link>

              <button
                onClick={() => handleDelete(banner._id)}
                className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition-colors duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredBanners.length > itemsPerPage && (
          <div className="flex justify-between mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1 ? "bg-gray-300" : "bg-main text-white"
              }`}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300"
                  : "bg-main text-white"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </>
    </div>
  );
};

export default IndexPage;
