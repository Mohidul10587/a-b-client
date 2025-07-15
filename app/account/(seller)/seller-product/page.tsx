"use client";

import { apiUrl } from "@/app/shared/urls";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const IndexPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen_2, setIsModalOpen_2] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [displayFilter, setDisplayFilter] = useState("all");
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${apiUrl}/seller/searchAllForSeller?page=${currentPage}&limit=${itemsPerPage}&search=${debouncedSearch}&display=${displayFilter}`,
        { credentials: "include" }
      );

      const data = await res.json();
      setProducts(data.resData || []);
      setTotalPages(Math.ceil(data.totalPages || 0));
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch when debouncedSearch or page changes
  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, currentPage, displayFilter]);

  const openModal = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const openModal_2 = (product: any) => {
    setSelectedProduct(product);
    setIsModalOpen_2(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const closeModal_2 = () => {
    setIsModalOpen_2(false);
    setSelectedProduct(null);
  };
  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/seller/deleteBySeller/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setProducts(products.filter((product) => product._id !== id));
      } else {
        alert("Failed to delete the product");
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };
  const handleToggle = async (productId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(
        `${apiUrl}/seller/updateProductStatusBySeller/${productId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ display_2: !currentStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update status");
      const data = await response.json();
      if (data.success) {
        // Update UI immediately
        setProducts((prevProducts) =>
          prevProducts.map((product) =>
            product._id === productId
              ? { ...product, display_2: !currentStatus }
              : product
          )
        );
      }
      // mutate(); // re-fetch products
    } catch (err) {
      console.error(err);
    }
  };
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Products</h1>
        <div className="flex items-center md:justify-end w-full gap-3">
          <select
            value={displayFilter}
            onChange={(e) => setDisplayFilter(e.target.value)}
            className="border rounded-md p-2"
          >
            <option value="all">All Products</option>
            <option value="onlyDisplayTrue">Active</option>
            <option value="onlyDisplayFalse">Inactive</option>
          </select>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded-md p-2 w-full md:w-96 outline-0"
          />
          <Link
            href="/account/seller-product/add"
            className="bg-main py-2 px-4 rounded-md text-white"
          >
            Add
          </Link>
          <button
            className="hidden"
            onClick={async () => {
              const res = await fetch(`/api/revalidate?path=/df`, {
                method: "POST",
              });
              const data = await res.json();
            }}
          >
            Cache
          </button>
        </div>
      </div>
      {products.map((product) => (
        <div
          key={product._id}
          className="flex gap-2 md:flex-row flex-col md:items-center md:justify-between rounded-md bg-white p-2 mb-2"
        >
          <div className="flex items-center justify-start gap-2">
            <Image
              src={product.photo || "/default.jpg"}
              width={50}
              height={50}
              alt={product.title}
              loading="lazy"
            />
            <div>
              <h1 className="text-base font-medium line-clamp-1  max-w-3xl">
                {product.title}
              </h1>
              <div className="flex items-center gap-2">
                <p>Price: {product.price}</p>
                <p>Sku: {product.sku}</p>

                <p>Brands: {product.brand?.title}</p>

                <p>
                  Seller:{" "}
                  {product.sellerInfo?.companyName || product.seller?.name}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center md:justify-end justify-center gap-3">
            <Link href={`/product/${product.slug}`} target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 32 32"
              >
                <path
                  fill="currentColor"
                  d="M.034 16.668C.388 25.179 7.403 32 16 32s15.612-6.821 15.966-15.332A.5.5 0 0 0 32 16.5c0-.036-.013-.067-.02-.1c.003-.134.02-.265.02-.4c0-8.822-7.178-16-16-16S0 7.178 0 16c0 .135.017.266.02.4c-.007.033-.02.064-.02.1c0 .06.015.115.034.168m24.887 6.074a22 22 0 0 0-4.215-1.271c.158-1.453.251-2.962.28-4.47h4.98c-.091 2.054-.456 3.993-1.045 5.741M26.965 17h3.984a14.9 14.9 0 0 1-2.663 7.579a17 17 0 0 0-2.457-1.44c.645-1.869 1.042-3.943 1.136-6.139m-14.576 5.286A23.4 23.4 0 0 1 16 22c1.224 0 2.433.102 3.61.286C18.916 27.621 17.4 31 16 31s-2.916-3.379-3.611-8.714m1.519 8.378c-2.751-.882-5.078-3.471-6.482-6.984a21 21 0 0 1 3.99-1.217c.459 3.496 1.298 6.542 2.492 8.201m-1.634-19.955A24.4 24.4 0 0 0 16 11a24.4 24.4 0 0 0 3.726-.291c.172 1.62.274 3.388.274 5.291h-8c0-1.903.102-3.671.274-5.291M19.985 17a49 49 0 0 1-.26 4.291A24.4 24.4 0 0 0 16 21a24.4 24.4 0 0 0-3.726.291a49 49 0 0 1-.26-4.291zm.6 5.463c1.404.282 2.743.692 3.99 1.217c-1.404 3.513-3.731 6.102-6.482 6.984c1.193-1.659 2.032-4.705 2.492-8.201M21 16c0-1.836-.102-3.696-.294-5.47c1.48-.292 2.896-.72 4.215-1.271C25.605 11.288 26 13.574 26 16zm-.415-6.463c-.46-3.496-1.298-6.543-2.493-8.201c2.751.882 5.078 3.471 6.482 6.984a20.8 20.8 0 0 1-3.989 1.217m-.974.177C18.433 9.898 17.224 10 16 10s-2.433-.102-3.611-.286C13.084 4.379 14.6 1 16 1s2.916 3.379 3.611 8.714m-8.196-.177a21 21 0 0 1-3.99-1.217c1.404-3.513 3.731-6.102 6.482-6.984c-1.193 1.659-2.032 4.705-2.492 8.201m-.121.993A51 51 0 0 0 11 16H6c0-2.426.395-4.712 1.079-6.742c1.319.552 2.735.979 4.215 1.272m-.28 6.47c.029 1.508.122 3.017.28 4.471c-1.48.292-2.896.72-4.215 1.271c-.589-1.748-.954-3.687-1.045-5.742zM6.17 23.139a17 17 0 0 0-2.456 1.44A14.9 14.9 0 0 1 1.051 17h3.984c.094 2.196.491 4.27 1.135 6.139M4.313 25.38a16 16 0 0 1 2.207-1.305c1.004 2.485 2.449 4.548 4.186 5.943a15.05 15.05 0 0 1-6.393-4.638m16.981 4.637c1.738-1.394 3.182-3.458 4.186-5.943c.79.384 1.522.826 2.207 1.305a15.03 15.03 0 0 1-6.393 4.638M27 16c0-2.567-.428-4.987-1.17-7.139c.88-.422 1.698-.907 2.457-1.44A14.9 14.9 0 0 1 31 16zm.688-9.38c-.685.479-1.417.921-2.207 1.305c-1.004-2.485-2.449-4.549-4.186-5.943a15.06 15.06 0 0 1 6.393 4.638M10.706 1.983C8.968 3.377 7.524 5.441 6.52 7.926A16 16 0 0 1 4.313 6.62a15.04 15.04 0 0 1 6.393-4.637M3.714 7.421a17 17 0 0 0 2.456 1.44A22 22 0 0 0 5 16H1c0-3.19 1.009-6.145 2.714-8.579"
                />
              </svg>
            </Link>
            <Link href={`/account/seller-product/${product._id}`}>
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
                  strokeLinejoin="round"
                  strokeWidth="2"
                >
                  <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                </g>
              </svg>
            </Link>

            <button
              onClick={() => openModal_2(product)}
              className="cursor-pointer border border-orange-300 px-2 py-1 rounded"
            >
              {product.variantSectionInfo_2.length > 0
                ? "Size edit"
                : "Size add"}
            </button>

            <button
              onClick={() => openModal(product)}
              className="cursor-pointer border border-orange-300 px-2 py-1 rounded"
            >
              {product.variantSectionInfo.length > 0
                ? "Color Edit"
                : "Color Add"}
            </button>
            <div
              onClick={() => handleToggle(product._id, product.display_2)}
              className={`relative inline-flex items-center h-6 border rounded-full w-10 cursor-pointer transition-colors duration-300 ${
                product.display_2
                  ? "border-main bg-main"
                  : "border-gray-300 bg-white"
              }`}
            >
              <span
                className={`inline-block w-3 h-3 transform rounded-full transition-transform duration-300 ${
                  product.display_2
                    ? "bg-white translate-x-5"
                    : "translate-x-1 bg-main"
                }`}
              />
            </div>
            <button onClick={() => handleDelete(product._id)}>
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
                ></path>
              </svg>
            </button>
          </div>
        </div>
      ))}
      <div className="flex flex-col items-center mt-4 gap-2">
        {/* Previous & Next Buttons */}
        <div className="flex justify-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            className={`px-4 py-2 rounded ${
              currentPage === 1 ? "bg-gray-300" : "bg-main text-white"
            }`}
          >
            Previous
          </button>
          {/* Scrollable Page Numbers */}
          <div className=" overflow-x-auto scrollbar-custom w-96">
            <div className="flex gap-2 min-w-max px-2 py-1 ">
              {[...Array(totalPages)].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1 rounded ${
                      currentPage === pageNum
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages ? "bg-gray-300" : "bg-main text-white"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
