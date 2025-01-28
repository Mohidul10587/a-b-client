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
                    src={product.img}
                    width={50}
                    height={50}
                    alt={product.title}
                  />
                </td>
                <td className="px-6 py-4 w-2/12">{product.title}</td>

                <td className="px-6 py-4 w-1/12">{product.price}</td>

                {/* <td className="px-6 py-4 w-1/12">{product.writer.title}</td> */}

                <td>
                  <Link href={`/${product.slug}`} target="_blank">
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
                </td>
                <td>
                  <Link href={`/admin/product/${product._id}`}>
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
