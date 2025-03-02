"use client";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import { IProduct } from "@/types/product";
import { useSettings } from "@/app/context/AppContext";
import OfferProduct from "./OfferProduct";

const ProductList: React.FC<{ products: IProduct[] }> = ({ products }) => {
  const [items, setItems] = useState<IProduct[]>([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const settings = useSettings();

  // Filtered products based on search term, excluding products already in items
  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !items.some((item) => item._id === product._id) // Exclude products in items
  );

  // Get only the products up to the current visible count
  let displayedProducts = filteredProducts.slice(0, visibleCount);

  useEffect(() => {
    // Reset visible count when search term changes
    setVisibleCount(10);
  }, [searchTerm]);

  useEffect(() => {
    // Infinite scroll handler
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading &&
        visibleCount < filteredProducts.length
      ) {
        setLoading(true);
        setTimeout(() => {
          setVisibleCount((prevCount) => prevCount + 10);
          setLoading(false);
        }, 1000);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, visibleCount, filteredProducts.length]);

  const handleAddItem = (newItem: IProduct) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    const removedItem = items[index];
    setItems((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  return (
    <div className="container my-4">
      <OfferProduct items={items} onRemove={handleRemoveItem} />
      <div className="mt-2">
        <h2 className="text-sm mb-2">Add Product List</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 border rounded outline-0 w-full mb-2"
          />
          <div className="w-full md:overflow-y-auto">
            {displayedProducts.map((product, index) => (
              <div
                key={product._id}
                className="flex items-center bg-white justify-between p-2 border mb-2 rounded"
              >
                <div className="flex items-center">
                  <Image
                    src={product.img}
                    alt={product.title}
                    width={50}
                    height={50}
                    className="object-cover"
                    loading="lazy"
                  />
                  <div className="ml-4">
                    <h3 className="text-sm line-clamp-1">{product.title}</h3>
                    <p className="text-sm text-gray-600">
                      {settings?.currencySymbol}{" "}
                      {new Intl.NumberFormat().format(product.price)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleAddItem(product)}
                  className="bg-main text-white px-4 py-2 ml-4 rounded"
                >
                  Add
                </button>
              </div>
            ))}
            {loading && (
              <div className="text-center py-2 text-gray-500">Loading...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
