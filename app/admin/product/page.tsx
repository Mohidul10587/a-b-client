"use client";

import { apiUrl } from "@/app/shared/urls";
import LoadingComponent from "@/components/loading";
import { IProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const IndexPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${apiUrl}/product/allForAdmin`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/product/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        setProducts((prev) => prev.filter((product) => product._id !== id));
      } else {
        alert("Failed to delete the product");
      }
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirst, indexOfLast);

  const nextPage = () => {
    if (indexOfLast < filteredProducts.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  if (loading) return <LoadingComponent />;

  return (
    <div className="container my-4 px-2 sm:px-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h1 className="text-xl font-bold">Products</h1>
        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // reset page on search
            }}
            className="border px-2 py-1 rounded w-full md:w-64"
          />
          <Link
            href="/admin/product/add"
            className="bg-main py-2 px-4 rounded-md text-white"
          >
            Add
          </Link>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white p-4 shadow rounded-lg">
        <table className="w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left w-1/12">Image</th>
              <th className="px-6 py-3 text-left w-3/12">Title</th>
              <th className="px-6 py-3 text-left w-1/12">Price</th>
              <th className="px-6 py-3 text-left w-1/12">Writer</th>
              <th className="px-6 py-3 text-right w-3/12">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentProducts.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4">
                  <Image
                    src={product.img}
                    width={50}
                    height={50}
                    alt={product.title}
                    className="rounded"
                  />
                </td>
                <td className="px-6 py-4">{product.title}</td>
                <td className="px-6 py-4">৳ {product.price}</td>
                <td className="px-6 py-4">{product.writer?.title || "-"}</td>
                <td className="py-3 px-4 text-right space-x-2">
                  <Link
                    href={`/product/${product.slug}`}
                    target="_blank"
                    className="btnBlue"
                  >
                    Details
                  </Link>
                  <Link
                    href={`/admin/product/${product._id}`}
                    className="btnOrange"
                  >
                    Edit
                  </Link>
                  <button
                    className="btnRed"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {currentProducts.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-6 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {currentProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white p-4 shadow rounded-lg space-y-2"
          >
            <div className="flex items-center gap-4">
              <Image
                src={product.img}
                width={60}
                height={60}
                alt={product.title}
                className="rounded"
              />
              <div>
                <p className="font-semibold">{product.title}</p>
                <p className="text-sm text-gray-600">৳ {product.price}</p>
                <p className="text-sm text-gray-500">
                  Writer: {product.writer?.title || "N/A"}
                </p>
              </div>
            </div>
            <div className="flex justify-between gap-2 mt-2">
              <Link
                href={`/product/${product.slug}`}
                target="_blank"
                className="flex-1 bg-blue-500 text-white text-center py-2 rounded-md text-sm"
              >
                View
              </Link>
              <Link
                href={`/admin/product/${product._id}`}
                className="flex-1 bg-main text-white text-center py-2 rounded-md text-sm"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(product._id)}
                className="flex-1 bg-red-500 text-white py-2 rounded-md text-sm"
              >
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
          disabled={indexOfLast >= filteredProducts.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default IndexPage;
