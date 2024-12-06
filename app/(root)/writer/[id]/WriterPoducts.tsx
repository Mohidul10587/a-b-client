"use client";
import { useState, useEffect } from "react";
import { IProduct } from "@/types/product";
import Spinner from "../../../../components/Spinner";
import ProductCats from "../../../../components/ProductCats";

interface CategoryProductsProps {
  products: IProduct[];
  categories: any;
  writerTitle: string;
}

const WriterProducts: React.FC<CategoryProductsProps> = ({
  products,
  categories,
  writerTitle,
}) => {
  const [displayedProducts, setDisplayedProducts] = useState<IProduct[]>([]);
  const [visibleCount, setVisibleCount] = useState<number>(20); // Start with displaying 15 products
  const [sortDirection, setSortDirection] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    let filteredProducts = [...products];

    // Filter products by selected category
    if (selectedCategoryId) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category._id === selectedCategoryId
      );
    }

    // Sort the filtered products by price
    if (sortDirection === "asc") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortDirection === "desc") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    setDisplayedProducts(filteredProducts.slice(0, visibleCount));
  }, [visibleCount, sortDirection, selectedCategoryId, products]);

  useEffect(() => {
    const handleScroll = () => {
      // Check if user is near the bottom of the page
      if (
        window.innerHeight + window.scrollY >=
          document.documentElement.scrollHeight - 100 &&
        !isLoading &&
        visibleCount < products.length
      ) {
        loadMoreProducts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, visibleCount, products.length]);

  const loadMoreProducts = () => {
    setIsLoading(true);

    setTimeout(() => {
      setVisibleCount((prev) => prev + 10); // Load 15 more products
      setIsLoading(false);
    }, 2000); // Simulate a delay for loading
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between my-2">
        <div>
          <h2 className="text-xl font-semibold">{writerTitle}</h2>
          <p>Latest deals from Price in Kenya</p>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
          {/* Category Filter */}
          <select
            className="p-2 mt-2 w-full outline-none rounded-md"
            defaultValue=""
            onChange={(e) => setSelectedCategoryId(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((category: any) => (
              <option key={category._id} value={category._id}>
                {category.categoryName}
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

export default WriterProducts;
