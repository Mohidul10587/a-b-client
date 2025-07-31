"use client";
import Link from "next/link";
import { type FC, useRef } from "react";
import LoadingComponent from "@/components/loading";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import useSWR from "swr";
import { fetcher } from "@/app/shared/fetcher";
import type { IProduct } from "@/types/product";
import { req } from "@/app/shared/request";

export const AllProduct: FC<{ usingFor: string }> = ({ usingFor }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentPage = Number.parseInt(searchParams.get("page") || "1");
  const itemsPerPage = Number.parseInt(searchParams.get("limit") || "5");
  const searchQuery = searchParams.get("search") || "";
  const displayFilter = searchParams.get("display") || "all";
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const queryUrl = `product/allForIndexPage?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&display=${displayFilter}`;
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
    if (!confirm("Are you sure you want to delete this product?")) return;

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
    <div className="min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Product Management
          </h1>
          <p className="text-gray-600">Manage your products efficiently</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-400 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Active Products
                </p>
                <p className="text-3xl font-bold text-green-600">
                  {totalActiveCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-200 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-green-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-400 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Inactive Products
                </p>
                <p className="text-3xl font-bold text-red-600">
                  {totalInactiveCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-red-200 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-red-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-400 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Products
                </p>
                <p className="text-3xl font-bold text-blue-600">
                  {totalActiveCount + totalInactiveCount}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-200 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-400 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Current Page
                </p>
                <p className="text-3xl font-bold text-purple-600">
                  {currentPage}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-200 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-400 p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
            <div className="flex-1 max-w-md">
              <label
                htmlFor="search"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search Products
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  placeholder="Search by product name..."
                  defaultValue={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (debounceRef.current) clearTimeout(debounceRef.current);
                    debounceRef.current = setTimeout(() => {
                      updateQueryParams("search", value);
                    }, 500);
                  }}
                  className="w-full pl-10 pr-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div>
                <label
                  htmlFor="filter"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Filter by Status
                </label>
                <select
                  id="filter"
                  value={displayFilter}
                  onChange={(e) => updateQueryParams("display", e.target.value)}
                  className="px-4 py-3 border border-gray-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white min-w-[140px]"
                >
                  <option value="all">All Products</option>
                  <option value="true">Active Only</option>
                  <option value="false">Inactive Only</option>
                </select>
              </div>

              <div className="pt-6">
                <Link
                  href={`${
                    usingFor === "admin" ? "/admin" : "/account"
                  }/product/add`}
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-sm"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Add Product
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Products List */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-400 p-12">
            <LoadingComponent />
          </div>
        ) : error ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-400 p-12 text-center">
            <div className="w-16 h-16 bg-red-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Error Loading Products
            </h3>
            <p className="text-gray-600">
              Please try refreshing the page or contact support if the problem
              persists.
            </p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-400 p-12 text-center">
            <div className="w-16 h-16 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0h-2M4 13h2"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Products Found
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first product.
            </p>
            <Link
              href={`${
                usingFor === "admin" ? "/admin" : "/account"
              }/product/add`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-all"
            >
              Add Your First Product
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {products.map((item: IProduct) => (
              <div
                key={item._id}
                className="bg-white rounded-xl shadow-sm border border-gray-400 hover:shadow-md transition-all duration-200"
              >
                <div className="p-4">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Product Image and Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-14 h-14 lg:w-14 lg:h-14 flex-shrink-0 bg-gray-400 rounded-lg overflow-hidden">
                        <Image
                          src={item.img || "/default.jpg"}
                          width={96}
                          height={96}
                          alt={item.titleEn || "Product image"}
                          priority={true}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                          {item.titleEn || "No title provided"}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="font-medium">
                            Price:{" "}
                            <span className="text-green-600 font-semibold">
                              ${item.sellingPrice.toLocaleString("en")}
                            </span>
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.display
                                ? "bg-green-200 text-green-800"
                                : "bg-red-200 text-red-800"
                            }`}
                          >
                            {item.display ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap lg:flex-nowrap items-center gap-3 lg:justify-end">
                      <Link
                        href={`/product/${item.slug}`}
                        target="_blank"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View
                      </Link>

                      <Link
                        href={`${
                          usingFor === "admin" ? "/admin" : "/account"
                        }/product/edit/${item._id}`}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-200 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                        Edit
                      </Link>

                      {usingFor === "admin" && (
                        <button
                          onClick={() =>
                            handleToggle(item._id as string, item.display)
                          }
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                            item.display ? "bg-green-500" : "bg-gray-400"
                          }`}
                          aria-label={`Toggle product ${
                            item.display ? "inactive" : "active"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              item.display ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(item._id as string)}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {products.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-400 p-6 mt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Showing page <span className="font-medium">{currentPage}</span>{" "}
                of <span className="font-medium">{totalPages}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    currentPage === 1
                      ? "text-gray-400 bg-gray-400 cursor-not-allowed"
                      : "text-gray-700 bg-white border border-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                  }`}
                >
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="hidden sm:flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 hover:bg-gray-400"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    currentPage === totalPages
                      ? "text-gray-400 bg-gray-400 cursor-not-allowed"
                      : "text-gray-700 bg-white border border-gray-400 hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                  }`}
                >
                  Next
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
