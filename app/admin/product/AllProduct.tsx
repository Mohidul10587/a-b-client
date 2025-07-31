"use client";
import Link from "next/link";
import { FC, useEffect, useRef, useState } from "react";
import LoadingComponent from "@/components/loading";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";

import useSWR, { mutate } from "swr";
import { fetcher } from "@/app/shared/fetcher";
import { IProduct } from "@/types/product";
import { req } from "@/app/shared/request";

export const AllProduct: FC<{ usingFor: string }> = ({ usingFor }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = parseInt(searchParams.get("page") || "1");
  const itemsPerPage = parseInt(searchParams.get("limit") || "5");
  const searchQuery = searchParams.get("search") || "";
  const displayFilter = searchParams.get("display") || "true";
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const queryUrl = `product/allForAdminIndexPage?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&display=${displayFilter}`;

  const { data, error, mutate, isLoading } = useSWR(queryUrl, fetcher);

  const products = data?.resData || [];
  const totalPages = data?.totalPages || 1;
  const totalActiveCount = data?.totalActiveCount || 0;
  const totalInactiveCount = data?.totalInactiveCount || 0;

  const updateQueryParams = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === "") {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    if (key !== "page") params.set("page", "1");
    router.push(
      `${
        usingFor === "admin" ? "/admin" : "/account"
      }/product?${params.toString()}`
    );
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());

    router.push(
      `${
        usingFor === "admin" ? "/admin" : "/account"
      }/product?${params.toString()}`
    );
  };

  const handleDelete = async (id: string) => {
    const { res, data } = await req(`product/delete/${id}`, "DELETE", {});
    if (res.ok) {
      alert(data.message);
      mutate();
    } else {
      alert("Failed to delete product");
    }
  };

  const handleToggle = async (productId: string, currentStatus: boolean) => {
    try {
      const { res } = await req(`product/updateStatus/${productId}`, "PATCH", {
        display: !currentStatus,
      });
      if (!res.ok) throw new Error("Failed to update status");
      mutate();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container my-4 min-h-screen">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
        {[
          {
            title: "Active Products",
            count: totalActiveCount,
            color: "from-red-500 to-orange-500",
          },
          {
            title: "Inactive Products",
            count: totalInactiveCount,
            color: "from-blue-500 to-indigo-500",
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`bg-gradient-to-r ${item.color} rounded-lg p-2 text-center text-white shadow-md`}
          >
            <h2 className="text-lg font-bold">{item.title}</h2>
            <p className="text-3xl font-semibold">{item.count}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Products</h1>
        <div className="flex items-center md:justify-end w-full gap-3">
          <input
            type="text"
            placeholder="Search products..."
            defaultValue={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              if (debounceRef.current) clearTimeout(debounceRef.current);
              debounceRef.current = setTimeout(() => {
                updateQueryParams("search", value);
              }, 500);
            }}
            className="border rounded-md p-2 w-full md:w-96 outline-0"
          />

          <select
            value={displayFilter}
            onChange={(e) => {
              updateQueryParams("display", e.target.value);
            }}
            className="border rounded-md p-2"
          >
            <option value="all">All</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <Link
            href={`${usingFor === "admin" ? "/admin" : "/account"}/product/add`}
            className="bg-main py-2 px-4 rounded-md text-white"
          >
            Add
          </Link>
        </div>
      </div>

      {isLoading ? (
        <LoadingComponent />
      ) : error ? (
        <p>Error loading products.</p>
      ) : (
        <>
          {products.map((item: IProduct) => (
            <div key={item._id}>
              <div className="flex gap-2 md:flex-row flex-col md:items-center md:justify-between rounded-md bg-white p-2 mb-2">
                <div className="flex items-center justify-start gap-2">
                  <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center">
                    <Image
                      src={item.img || "/default.jpg"}
                      width={100}
                      height={100}
                      alt={item.titleEnglish || "image"}
                      priority={true}
                      className="rounded-md object-cover w-min h-min"
                    />
                  </div>
                  <div>
                    <h1 className="text-base font-medium line-clamp-1">
                      {item.titleEnglish || "No title provided"}
                    </h1>
                    <div className="flex items-center gap-4">
                      <p>
                        <strong> Price : </strong>{" "}
                        {item.sellingPrice.toLocaleString("en")}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center md:justify-end justify-center gap-3">
                  <Link
                    className="btnB"
                    href={`/product/${item.slug}`}
                    target="_blank"
                  >
                    Details
                  </Link>

                  <Link
                    className="btnO"
                    href={`${
                      usingFor === "admin" ? "/admin" : "/account"
                    }/product/edit/${item._id}`}
                  >
                    Edit
                  </Link>
                  {usingFor === "admin" && (
                    <div
                      onClick={() =>
                        handleToggle(item._id as string, item.display)
                      }
                      className={`relative inline-flex items-center h-6 border rounded-full w-10 cursor-pointer transition-colors duration-300 ${
                        item.display
                          ? "border-main bg-main"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      <span
                        className={`inline-block w-3 h-3 transform rounded-full transition-transform duration-300 ${
                          item.display
                            ? "bg-white translate-x-5"
                            : "translate-x-1 bg-main"
                        }`}
                      />
                    </div>
                  )}
                  {usingFor === "seller" && (
                    <div className="btnB">
                      {item.display ? "Active" : "Inactive"}
                    </div>
                  )}
                  <button
                    onClick={() => handleDelete(item._id as string)}
                    className="btnR"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-4">
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
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
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? "bg-gray-300"
                  : "bg-main text-white"
              }`}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};
