// app/admin/suggested/page.tsx

import { apiUrl } from "@/app/shared/urls";
import ProductList from "./ProductList";

const Index: React.FC<any> = async ({ params }) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  const res = await fetch(`${apiUrl}/product/getAllProductsForOfferPage`, {
    next: { revalidate: 60 }, // 2 minutes in seconds
  });

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const products = await res.json();

  return (
    <>
      <ProductList productsS={products} id={id} />
    </>
  );
};

export default Index;
