import { Metadata, ResolvingMetadata } from "next";
import { apiUrl, clientSideUrl } from "@/app/shared/urls";
import { FC, Key } from "react";
import { fetchSettings } from "@/app/shared/fetchSettingsData";
import { headers } from "next/headers";
import { ProductDetails } from "./ProdutDetails";
import { fetchData } from "@/app/shared/fetchData";
import { IProduct } from "@/types/product";
import { ISettings } from "@/types/settings";

export async function generateMetadata(
  { params }: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;
  const [data, settings]: [FetchDataResponse<IProduct | null>, any] =
    await Promise.all([
      fetchData<IProduct | null>(
        `product/singleForUserFoDetailsPageBySlug/${slug}`
      ),
      fetchSettings(),
    ]);

  if (data.success === false) {
    const fallbackTitle = "Product Not Found | " + settings.websiteTitle;
    const fallbackDescription =
      data.message || "The product you're looking for does not exist.";
    const fallbackUrl = `${clientSideUrl}/product/${slug}`;

    return {
      title: fallbackTitle,
      description: fallbackDescription,
      openGraph: {
        title: fallbackTitle,
        description: fallbackDescription,
        url: fallbackUrl,
        type: "website",
        images: [],
        siteName: settings.websiteTitle,
      },
      twitter: {
        card: "summary",
        title: fallbackTitle,
        description: fallbackDescription,
      },
      alternates: {
        canonical: fallbackUrl,
      },
    };
  }

  const item = data.resData as IProduct;
  const previousImages = (await parent).openGraph?.images || [];
  const metaTitle = item.metaTitle
    ? item.metaTitle
    : `Buy ${item.title} | ${item.stockStatus} | @${settings.country}`;
  const metaDescription =
    item.metaDescription ||
    `Order ${item.title} from ${settings.country} with fast delivery across ${settings.country} and in-store pickup in ${settings.officeAddress}.`;
  const metaImages = [{ url: item.img }, ...previousImages];
  const metaUrl = `${clientSideUrl}/product/${slug}`;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: Array.isArray(item.tags) ? [...item.tags] : [],

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
    alternates: {
      canonical: `${clientSideUrl}/product/${item.slug}`,
    },
  };
}
export async function generateStaticParams() {
  try {
    const res = await fetch(`${apiUrl}/product/allSlugsForUserIndexPage`);
    const slugs: { slug: string }[] = await res.json();

    if (!res.ok || !Array.isArray(slugs)) return [];

    return slugs.map((item) => ({
      slug: item.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

// Define the server component
const IndexPage: FC<any> = async ({ params }: any) => {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const fullUrl = `${protocol}://${host}`;

  // Fetch the product, category products, and setting

  try {
    const data: FetchDataResponse<IProduct | null> = await fetchData(
      `product/singleForUserFoDetailsPageBySlug/${slug}`
    );
    if (data.success === false) {
      return (
        <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
          {data?.message || "Product not found"}
        </div>
      );
    }

    const product = data.resData as IProduct;
    // Extract categoryId from the fetched product
    const categoryId = product.category._id;
    const categorySlug = product.category.slug;

    const settings = await fetchSettings();

    const slideImages = [product.img];

    // Define the product URL
    const productUrl = `${fullUrl}/product/${slug}`;

    // Prepare WhatsApp message
    const message = `Hello, I am interested in purchasing the following product:\n\nProduct Link: ${productUrl}\nProduct Name: ${product.title}\nPrice: ${settings.currencySymbol} ${product.price}\n\nThank you!`;

    // Encode message for URL
    const encodedMessage = encodeURIComponent(message);

    // WhatsApp URL with pre-filled message
    const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodedMessage}`;

    return (
      <ProductDetails
        product={product}
        settings={settings}
        categoryId={categoryId}
        slideImages={slideImages}
        fullUrl={fullUrl}
        whatsappUrl={whatsappUrl}
        // @ts-ignore
        allProducts={product.productsOfSameCategory}
        productId={slug}
        categorySlug={categorySlug}
      />
    );
  } catch (error) {
    console.error("Product fetch error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 text-lg font-semibold">
        Something went wrong while fetching the product.
      </div>
    );
  }
};

export default IndexPage;

// async function fetchProduct(slug: string) {
//   try {
//     const res = await fetch(`${apiUrl}/product/productDetails/${slug}`, {
//       next: { revalidate: 40 },
//     });
//     if (!res.ok) {
//       throw new Error(`Failed to fetch product data: ${res.statusText}`);
//     }
//     const product = await res.json();

//     return product;
//   } catch (error) {
//     console.error("Error fetching product data:", error);
//     return null;
//   }
// }
