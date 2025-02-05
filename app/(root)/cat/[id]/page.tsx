import { apiUrl, clientSideUrl } from "@/app/shared/urls";

import { Metadata, ResolvingMetadata } from "next";
import { fetchSettings } from "@/app/shared/fetchSettingsData";

import { FC } from "react";
import { Props } from "@/types/pageProps";

import { fetchElement } from "@/app/shared/fetchElements";

import ClientComponent from "./ClientComponent";

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.id;

  // Fetch the category data
  const { settings, category } = await fetchData(slug);

  // Extracting relevant information for metadata
  const title =
    category.metaTitle ||
    `Buy ${category?.title} | Category | @${settings?.country}` ||
    "Category Title";
  const description =
    category.metaDescription ||
    category?.description?.replace(/<\/?[^>]+(>|$)/g, "") || // Remove HTML tags from description
    `Explore a wide range of products in the ${title} category at ${settings.country}.`;
  const image = category?.img || "/default-image.png"; // Provide a default image if not available

  return {
    title,
    description,
    keywords: [...category.tags],
    openGraph: {
      title,
      description,
      images: [
        {
          url: image,
          alt: `${title} Image`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    // icons: {
    //   icon: image,
    // },
    alternates: {
      canonical: `${clientSideUrl}/cat/${category.slug}`,
    },
  };
}

const IndexPage: FC<Props> = async ({ params }) => {
  const resolvedParams = await params;
  const slug = resolvedParams.id;

  // Destructure the object returned by getData
  const {
    products = [],
    writers = [],
    category = null,
    publishers = [],
    settings,
  } = await fetchData(slug);
  const element = await fetchElement(category._id, "category");

  return (
    <ClientComponent
      products={products}
      category={category}
      publishers={publishers}
      writers={writers}
    />
  );
};

export default IndexPage;

async function fetchData(slug: string) {
  try {
    const [data, publishersRes, settings] = await Promise.all([
      fetch(`${apiUrl}/product/products_by_category_slug/${slug}`, {
        next: { revalidate: 30 },
      }).then((res) => res.json()),
      fetch(`${apiUrl}/publishers/allPublisherForFiltering`, {
        next: { revalidate: 30 },
      }).then((res) => res.json()),
      fetchSettings(),
    ]);

    const products = data.products;
    const writers = data.writers;
    const category = data.category;
    const publishers = publishersRes?.respondedData || [];

    return {
      products,
      writers,
      category,
      publishers,
      settings,
    };
  } catch (error) {
    console.error("Error fetching category data:", error);
    return {
      products: [],
      writers: [],
      category: null,
      publishers: [],
      settings: null,
      elementsData: null,
    };
  }
}
