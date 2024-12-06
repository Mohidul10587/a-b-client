import { apiUrl } from "@/app/shared/urls";
import CheckoutClient from "@/app/(root)/checkout/[...id]/CheckoutClient";
import { fetchSettings } from "@/app/shared/fetchSettingsData";
import { IProduct } from "@/types/product";
import { Props } from "@/types/pageProps";
import { FC } from "react";

async function fetchProduct(productId: string): Promise<IProduct> {
  try {
    const response = await fetch(`${apiUrl}/product/${productId}`, {
      next: { revalidate: 50 }, // Ensure the freshest data is fetched
    });
    if (!response.ok) {
      throw new Error("Failed to fetch product data");
    }
    return await response.json();
  } catch (error: any) {
    throw new Error(`Error fetching product: ${error.message}`);
  }
}

const Checkout: FC<Props> = async ({ params }) => {
  const resolvedParams = await params;
  const id = resolvedParams.id[0];
  const price = resolvedParams.id[1];

  const title = decodeURIComponent(resolvedParams.id[2]);
  const product = await fetchProduct(id);
  const settings = await fetchSettings();
  if (!product || !settings) {
    return (
      <div className="container">
        <h1>Product not found</h1>
        <p>The product you are looking for does not exist.</p>
      </div>
    );
  }
  return (
    <div>
      <CheckoutClient
        product={product}
        settings={settings}
        variantPrice={parseInt(price)}
        variantTitle={title}
      />
    </div>
  );
};

export default Checkout;
