
'use client'
import { apiUrl } from "@/app/shared/urls";
import { IProduct } from "@/types/product";
import React, { useEffect, useState } from "react";
import ProductBox from "../../../../components/ProductBox"; // Adjust the path as needed

interface ProductFetcherProps {
  searchText: string;
}

const SearchResult: React.FC<ProductFetcherProps> = ({ searchText }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // Set loading to true when the search text changes
    fetch(`${apiUrl}/product/search/search-by-title?title=${searchText}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, [searchText]);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (products.length == 0) {
    return <div>No result Found</div>;
  }

  return <ProductBox items={products} />;
};

export default SearchResult;
