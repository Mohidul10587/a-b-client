import React, { useState } from "react";
import Image from "next/image";
import { BsChevronLeft, BsChevronRight } from "react-icons/bs";
import Link from "next/link";
interface Product {
  originalPrice: React.JSX.Element;
  rating: number;
  photo?: string;
  title?: string;
  slug: string;
  price?: number;
  writer: { title: string };
}

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 5;

  // Calculate the total number of pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Get the products for the current page
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(
    startIndex,
    startIndex + productsPerPage
  );

  // Handle navigation
  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };
  console.log(currentProducts);
  return (
    <div>
      <h2 className="text-lg font-semibold border-b pb-2">Related Products</h2>
      {products.length > 0 && (
        <>
          <div className="space-y-4 min-h-[465px]">
            {currentProducts.map((product, index) => (
              <div key={index}>
                <Link href={`/${product.slug}`}>
                  <div className="flex items-center space-x-4">
                    <Image
                      src={product.photo || "/related-product-1.jpg"} // Use actual image path or fallback
                      alt={product.title || "Related Product"}
                      width={50}
                      height={70}
                      className="rounded h-20 w-16"
                    />
                    <div>
                      <h3 className="text-sm font-medium">
                        {product.title || "Unnamed Product"}
                      </h3>
                      <h3 className="text-sm font-medium">
                        {product.writer?.title || ""}
                      </h3>
                      <p className="text-xs text-gray-500">
                        TK. {product.price || "N/A"}{" "}
                        {product.originalPrice && (
                          <span className="line-through">
                            TK. {product.originalPrice}
                          </span>
                        )}
                      </p>

                      {/* Review Section */}
                      <div className="flex items-center space-x-1 mt-1">
                        {Array(5)
                          .fill(0)
                          .map((_, starIndex) => (
                            <svg
                              key={starIndex}
                              xmlns="http://www.w3.org/2000/svg"
                              fill={
                                starIndex < (product.rating || 0)
                                  ? "gold"
                                  : "gray"
                              }
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-4 h-4"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
                              />
                            </svg>
                          ))}
                        <span className="text-xs text-gray-600 ml-2">
                          {product.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Pagination Buttons */}
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={handlePrevious}
              disabled={currentPage === 1}
              className={`px-4 py-1 bg-blue-500 text-white rounded ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <BsChevronLeft />
            </button>
            <button
              onClick={handleNext}
              disabled={currentPage === totalPages}
              className={`px-4 py-1 bg-blue-500 text-white rounded ${
                currentPage === totalPages
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <BsChevronRight />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RelatedProducts;
