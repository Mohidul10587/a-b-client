import { apiUrl } from "@/app/shared/urls";
import ReadMore from "@/components/ReadMore";
import { fetchSettings } from "@/app/shared/fetchSettingsData";
import { Metadata, ResolvingMetadata } from "next";
import { FC } from "react";
import { Props } from "@/types/pageProps";
import Image from "next/image";
import ProductDiv from "@/components/ProductBox";
import ClientComponent from "./ClientComponent";

// Utility function to fetch all necessary data
async function getData(slug: string) {
  try {
    const [productsRes, writerRes, categoryRes, settings] = await Promise.all([
      fetch(`${apiUrl}/product/writer_products_by_slug/${slug}`, {
        next: { revalidate: 30 },
      }).then((res) => res.json()),
      fetch(`${apiUrl}/writer/singleWriterBySlug/${slug}`, {
        next: { revalidate: 30 },
      }).then((res) => res.json()),
      fetch(`${apiUrl}/category/allCategoryForFiltering`, {
        next: { revalidate: 30 },
      }).then((res) => res.json()),
      fetchSettings(),
    ]);
    return {
      products: productsRes || [],
      writer: writerRes?.writer || null,
      categories: categoryRes?.respondedData || [],
      settings,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      products: [],
      writer: null,
      categories: [],
      settings: null,
    };
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.id;

  // Fetch the writer and settings data
  const { writer, settings } = await getData(slug);

  // Extracting relevant information for metadata
  const title =
    writer.metaTitle || `Buy ${writer?.title} - Writers @${settings?.country}`;
  const description =
    writer.metaDescription ||
    writer?.description.replace(/<\/?[^>]+(>|$)/g, "") ||
    `Explore a wide range of products from ${title}`;
  const image = writer?.photo || "/default-image.png"; // Provide a default image if not available

  return {
    title,
    description,
    keywords: [...writer.tags],
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
    icons: {
      icon: image,
    },
  };
}

const IndexPage: FC<Props> = async ({ params }) => {
  const resolvedParams = await params;

  const writerId = resolvedParams.id;

  // Fetch all necessary data
  const { products, writer, categories, settings } = await getData(writerId);
  console.log(writer, categories, settings);
  if (!writer || !settings) {
    return <div>Failed to load writer data or settings data.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <ClientComponent
        writer={writer}
        products={products}
        categories={categories}
      />
    </div>
  );
};

export default IndexPage;
