"use client";

import { useEffect, useState } from "react";
import ProductList from "@/app/account/suggested/add/ProductList";
import { apiUrl } from "@/app/shared/urls";

const IndexPage = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${apiUrl}/seller/getAllSellerProductsForOfferPage`,
          {
            credentials: "include",
          }
        );

        if (!res.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await res.json();
        setProducts(data);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchProducts();
  }, []);

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <>
      <ProductList products={products} />
    </>
  );
};

export default IndexPage;
