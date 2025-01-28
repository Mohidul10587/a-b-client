"use client";
import { useState, useEffect } from "react";
import ProductCats from "@/components/ProductCats";
import { IProduct } from "@/types/product";
import { IWriter } from "@/types/writer";
import Spinner from "./Spinner";

interface CategoryProductsProps {
  country: string;
  title: string;
  products: IProduct[];
  writers: IWriter[];
}

const CategoryProducts: React.FC<CategoryProductsProps> = ({
  country,
  title,
  products,
  writers,
}) => {
  const [displayedProducts, setDisplayedProducts] = useState<IProduct[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(20); // Start with displaying 9 products
  const [sortDirection, setSortDirection] = useState<string>("");
  const [selectedWriterId, setSelectedWriterId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let filteredProducts = [...products];

    // Filter products by selected writer
    if (selectedWriterId) {
      filteredProducts = filteredProducts.filter(
        (product) => product.writer._id === selectedWriterId
      );
    }

    // Sort the filtered products by price
    if (sortDirection === "asc") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortDirection === "desc") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    setDisplayedProducts(filteredProducts.slice(0, visibleCount));
  }, [visibleCount, sortDirection, selectedWriterId, products]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        !isLoading
      ) {
        loadMoreProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  const loadMoreProducts = () => {
    if (visibleCount >= products.length) return; // No more products to load
    setIsLoading(true);

    setTimeout(() => {
      setVisibleCount((prev) => prev + 10); // Load 9 more products
      setIsLoading(false);
    }, 1000); // Simulate a delay for loading
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between my-2">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p>Latest deals from {country}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
          {/* Writer Filter */}
          <select
            className="p-2 mt-2 w-full outline-none rounded-md"
            defaultValue=""
            onChange={(e) => setSelectedWriterId(e.target.value)}
          >
            <option value="">All Writers</option>
            {writers.map((writer) => (
              <option key={writer._id} value={writer._id}>
                {writer.title}
              </option>
            ))}
          </select>
          {/* Sort by Price */}
          <select
            className="p-2 mt-2 w-full outline-none rounded-md"
            defaultValue=""
            onChange={(e) => setSortDirection(e.target.value)}
          >
            <option value="">Sort by Price</option>
            <option value="asc">Low to High</option>
            <option value="desc">High to Low</option>
          </select>
        </div>
      </div>

      <ProductCats items={displayedProducts} />

      {isLoading && (
        <div className="flex items-center justify-center py-2">
          <p className="mr-4"> Loading more products </p>
          <Spinner />
        </div>
      )}
    </>
  );
};

export default CategoryProducts;
