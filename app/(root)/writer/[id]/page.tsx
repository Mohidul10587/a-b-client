import { apiUrl } from "@/app/shared/urls";
import Link from "next/link";
import ReadMore from "@/components/ReadMore";
import { fetchSettings } from "@/app/shared/fetchSettingsData";
import { Metadata, ResolvingMetadata } from "next";

import ElementSection from "@/components/ElementSection";
import { FC } from "react";
import { Props } from "@/types/pageProps";
import WriterProducts from "./WriterPoducts";

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
      fetch(`${apiUrl}/category/all`, { next: { revalidate: 30 } }).then(
        (res) => res.json()
      ),
      fetchSettings(),
    ]);

    return {
      products: productsRes || [],
      writer: writerRes?.writer || null,
      categories: categoryRes?.categories || [],
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

  if (!writer || !settings) {
    return <div>Failed to load writer data or settings data.</div>;
  }

  return (
    <>
      <div className="container mb-4">
        <ol className="hidden lg:flex items-center mb-1.5 pt-1.5 pb-0 px-4 flex-wrap gap-4 gap-y-1 bg-white rounded-b-md text-sm shadow-sm">
          <li>
            <Link
              href="/"
              title="Price in Kenya"
              className="hover:text-gray-600 bg-gray-200 px-3 py-1 rounded max-w-sm inline-block truncate"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/writer"
              title="All Writers"
              className="hover:text-gray-600 bg-gray-200 px-3 py-1 rounded max-w-sm inline-block truncate"
            >
              Writers
            </Link>
          </li>
          <li>
            <Link
              href={`/writer/${writer?.slug}`}
              title="All writers"
              className="hover:text-gray-600 bg-gray-200 px-3 py-1 rounded max-w-sm inline-block truncate"
            >
              {writer?.title}
            </Link>
          </li>
        </ol>
      </div>
      <ElementSection id={writerId} page="writer" />
      {/* <Banner items={banners} /> */}
      <div className="container">
        <WriterProducts
          products={products}
          categories={categories}
          writerTitle={writer.title}
        />
      </div>

      <div className="container my-4">
        <div className="bg-white p-4 border text-lg leading-7">
          <h1 className="text-2xl font-bold mb-2">
            Buy {writer?.title} in {settings.country}
          </h1>
          <ReadMore height="h-20">
            {writer && (
              <div
                dangerouslySetInnerHTML={{
                  __html: writer.description,
                }}
              ></div>
            )}
          </ReadMore>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
