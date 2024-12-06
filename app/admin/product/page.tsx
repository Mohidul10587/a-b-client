"use client";
import { apiUrl } from "@/app/shared/urls";
import { fetchWithTokenRefresh } from "@/app/shared/fetchWithTokenRefresh";
import { IProduct } from "@/types/product";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import EditVariantModal from "./EditVariantModal";

const IndexPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null); //

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
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetchWithTokenRefresh(`${apiUrl}/product/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    return <p>Loading...</p>;
  }

  return (
    <div className="container my-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Products</h1>
        <Link
          href="/admin/product/add"
          className="bg-main py-2 px-4 rounded-md text-white"
        >
          Add
        </Link>
      </div>
      <div className="bg-white p-4 shadow rounded-lg">
        <table className="w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-6 w-2/12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 w-2/12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>

              <th className="px-6 w-1/12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>

              <th className="px-6 w-1/12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Writer
              </th>
              <th className="px-6 w-1/12 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products?.map((product) => (
              <tr key={product._id}>
                <td className="px-6 py-4 w-2/12">
                  <Image
                    src={product.photo}
                    width={50}
                    height={50}
                    alt={product.title}
                  />
                </td>
                <td className="px-6 py-4 w-2/12">{product.title}</td>

                <td className="px-6 py-4 w-1/12">{product.price}</td>

                {/* <td className="px-6 py-4 w-1/12">{product.writer.title}</td> */}
                <td>
                  <Link href={`/admin/product/${product._id}`}>
                    <span className="border border-orange-300 px-2 py-1 rounded">
                      Edit
                    </span>
                  </Link>
                </td>

                <td className="px-6 py-4 w-1/12">
                  <button
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
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
    </div>
  );
};

export default IndexPage;
