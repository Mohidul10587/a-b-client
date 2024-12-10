import { Metadata, ResolvingMetadata } from "next";
import { apiUrl, clientSideUrl } from "@/app/shared/urls";
import { FC, Key } from "react";
import { fetchSettings } from "@/app/shared/fetchSettingsData";
import { headers } from "next/headers";
import { PropsWithSlagArray } from "@/types/pageProps";
import { ProductDetails } from "./ProdutDetails";

export async function generateMetadata(
  { params }: PropsWithSlagArray,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const ids = resolvedParams.id;
  const productId = ids[0];

  const [product, settings] = await Promise.all([
    fetchProduct(productId),
    fetchSettings(),
  ]);

  if (!product || !settings) {
    return {
      title: "Product not found",
      description: "The product you are looking for does not exist.",
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const metaTitle = product.metaTitle
    ? product.metaTitle
    : `Buy ${product.title} - ${product.stockStatus} @${settings.country}`;
  const metaDescription =
    product.metaDescription ||
    `Order ${product.title} from ${settings.country} with fast delivery across ${settings.country} and in-store pickup in ${settings.officeAddress}.`;
  const metaImages = [{ url: product.photo }, ...previousImages];
  const metaUrl = `${clientSideUrl}/${productId}`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [...product.tags],

    openGraph: {
      title: metaTitle,
      description: metaDescription,
      type: "website",
      images: metaImages,
      url: metaUrl,
      siteName: settings.websiteTitle,
      locale: "Ke",
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: metaImages,
      site: settings.websiteTitle,
    },
    // icons: {
    //   icon: product.photo,
    // },
    alternates: {
      canonical: `${clientSideUrl}/${product.slug}`,
    },
  };
}

// Define the server component
const IndexPage: FC<PropsWithSlagArray> = async ({
  params,
}: PropsWithSlagArray) => {
  const resolvedParams = await params;
  const ids = resolvedParams.id;
  const slug = ids[0];
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const fullUrl = `${protocol}://${host}`;

  // Fetch the product, category products, and setting

  const product = await fetchProduct(slug);

  if (!product) {
    return (
      <div className="container">
        <h1>Product not found</h1>
        <p>The product you are looking for does not exist.</p>
      </div>
    );
  }

  // Extract categoryId from the fetched product
  const categoryId = product.category._id;
  const categorySlug = product.category.slug;

  const settings = await fetchSettings();

  const slideImages = [product.photo, ...product.attachedFiles];

  // Define the product URL
  const productUrl = `${fullUrl}/${slug}`;

  // Prepare WhatsApp message
  const message = `Hello, I am interested in purchasing the following product:\n\nProduct Link: ${productUrl}\nProduct Name: ${product.title}\nPrice: ${settings.currencySymbol} ${product.price}\n\nThank you!`;

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message);

  // WhatsApp URL with pre-filled message
  const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodedMessage}`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: `Order ${product.title} from ${settings.country}.`,
    image: product.photo,
    url: `${settings.siteUrl}/product/${product.id}`,
    brand: settings.brandName,
    sku: product.sku,
    offers: {
      "@type": "Offer",
      priceCurrency: settings.currency,
      price: product.price,
      itemCondition: "https://schema.org/NewCondition", // Adjust as needed
      availability:
        product.stockStatus === "In Stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url: `${settings.siteUrl}/product/${product.id}`,
    },
  };

  return (
    <ProductDetails
      product={product}
      settings={settings}
      schema={schema}
      categoryId={categoryId}
      slideImages={slideImages}
      fullUrl={fullUrl}
      whatsappUrl={whatsappUrl}
      allProducts={product.productsOfSameCategory}
      productId={slug}
      categorySlug={categorySlug}
    />
  );
};

export default IndexPage;

async function fetchProduct(slug: string) {
  try {
    const res = await fetch(`${apiUrl}/product/productDetails/${slug}`, {
      next: { revalidate: 40 },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch product data: ${res.statusText}`);
    }
    const product = await res.json();

    return product;
  } catch (error) {
    console.error("Error fetching product data:", error);
    return null;
  }
}
