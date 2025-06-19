"use client";
import { useState, useEffect } from "react";
import ProductCats from "@/components/ProductCats";
import { IProduct } from "@/types/product";
import { IWriter } from "@/types/writer";
import Spinner from "@/components/Spinner";

interface CategoryProductsProps {
  country: string;
  title: string;
  products: IProduct[];
  writers: IWriter[];
  suggestions?: any[];
}

const CategoryProducts: React.FC<CategoryProductsProps> = ({
  country,
  title,
  products,
  writers,
  suggestions,
}) => {
  const [displayedProducts, setDisplayedProducts] = useState<IProduct[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(20); // Start with displaying 9 products
  const [sortDirection, setSortDirection] = useState<string>("");
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [stockStatus, setStockStatus] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let filteredProducts = [...products];

    // Filter products by selected brand
    if (selectedBrandId) {
      filteredProducts = filteredProducts.filter(
        (product) => product.writer._id === selectedBrandId
      );
    }
    if (stockStatus) {
      filteredProducts = filteredProducts.filter(
        (product) => product.stockStatus === stockStatus
      );
    }

    // Sort the filtered products by price
    if (sortDirection === "asc") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortDirection === "desc") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    setDisplayedProducts(filteredProducts.slice(0, visibleCount));
  }, [visibleCount, sortDirection, selectedBrandId, products, stockStatus]);

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
        <div className="grid grid-cols-3 gap-2 w-full md:w-auto">
          {/* Brand Filter */}
          <select
            className="p-2 mt-2 w-full outline-none rounded-md"
            defaultValue=""
            onChange={(e) => setSelectedBrandId(e.target.value)}
          >
            <option value="">All writers</option>
            {writers.map((brand) => (
              <option key={brand._id} value={brand._id}>
                {brand.title}
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
          <select
            className="p-2 mt-2 w-full outline-none rounded-md"
            defaultValue=""
            onChange={(e) => setStockStatus(e.target.value)}
          >
            <option value="">Stock</option>
            <option value="In Stock">In Stock</option>
            <option value="Out of Stock">Out of Stock</option>
            <option value="Upcoming">Upcoming</option>
            <option value="Rumored">Rumored</option>
            <option value="Refurbished">Refurbished</option>
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
