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
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const openModal = (product: any) => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/product/${id}`, {
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

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <div className="container my-4 px-2 sm:px-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Products</h1>
        <Link
          href="/admin/product/add"
          className="bg-main py-2 px-4 rounded-md text-white"
        >
          Add
        </Link>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white p-4 shadow rounded-lg">
        <table className="w-full divide-y divide-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 w-1/12 py-3 text-left ">Image</th>
              <th className="px-6 w-3/12 py-3 text-left ">Title</th>
              <th className="px-6 w-1/12 py-3 text-left ">Price</th>
              <th className="px-6 w-1/12 py-3 text-left ">Writer</th>
              <th className="px-6 w-3/12 py-3  text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products?.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 w-1/12">
                  <Image
                    src={product.img}
                    width={50}
                    height={50}
                    alt={product.title}
                    className="rounded"
                  />
                </td>
                <td className="px-6 py-4 w-3/12">{product.title}</td>
                <td className="px-6 py-4 w-1/12">{product.price}</td>
                <td className="px-6 py-4 w-2/12">
                  {product.writer?.title || "-"}
                </td>
                <td className="py-3 px-4 text-right space-x-2 ">
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
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-4">
        {products?.map((product) => (
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
    </div>
  );
};

export default IndexPage;
