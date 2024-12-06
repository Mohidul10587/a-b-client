"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiUrl } from "@/app/shared/urls";
import Banner from "@/components/Banner.admin";
import LoadingComponent from "@/components/loading";
import Image from "next/image";

interface Banner {
  _id: string;
  title: string;
  banners: any;
}

const IndexPage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${apiUrl}/banner/all`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
    const token = localStorage.getItem("accessToken");
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this banner?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${apiUrl}/banner/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (isError) {
    return <p>Failed to load banners.</p>;
  }

  return (
    <div className="container my-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Banners</h1>
        <Link
          href="/admin/banner/add"
          className="bg-main py-2 px-4 rounded-md text-white"
        >
          Add banners
        </Link>
      </div>

      <>
        {banners?.map((banner) => (
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
              />
              <h3 className="text-base font-medium mb-2">{banner.title}</h3>
            </div>
            <div className="flex justify-between items-center space-x-2">
              <Link
                href={`/admin/banner/${banner._id}`}
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
      </>
    </div>
  );
};

export default IndexPage;
