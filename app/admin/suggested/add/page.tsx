// app/admin/suggested/page.tsx
import ProductList from "@/app/admin/suggested/add/ProductList";
import { apiUrl } from "@/app/shared/urls";

const IndexPage = async () => {
  const res = await fetch(`${apiUrl}/product/getAllProductsForOfferPage`, {
    next: { revalidate: 60 }, // 2 minutes in seconds
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const products = await res.json();

  return (
    <>
      <ProductList products={products} />
    </>
  );
};

export default IndexPage;
