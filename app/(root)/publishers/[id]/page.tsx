import { apiUrl } from "@/app/shared/urls";
import Link from "next/link";
import ReadMore from "@/components/ReadMore";
import { fetchSettings } from "@/app/shared/fetchSettingsData";
import { Metadata, ResolvingMetadata } from "next";

import ElementSection from "@/app/(root)/a-root-comp/ElementSection";
import { FC } from "react";
import { Props } from "@/types/pageProps";
import { fetchElement } from "@/app/shared/fetchElements";
import Image from "next/image";
import ProductDiv from "@/components/ProductBox";

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
  console.log(writer, categories, settings);
  if (!writer || !settings) {
    return <div>Failed to load writer data or settings data.</div>;
  }
  const element = await fetchElement("home-main", "home-main");
  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-5">
        <div className="col-span-1 bg-green-700">this is div</div>

        <div className="col-span-4">
          <div className="flex justify-between mb-2 ">
            <div className="w-2/12">
              <div className="flex justify-center h-44 items-center">
                <Image
                  src={writer.photo}
                  alt="Author Image"
                  width={100}
                  height={94}
                  className="rounded-full "
                />
              </div>
            </div>
            <div className="w-10/12">
              <span className="font-semibold text-2xl">{writer.title}</span>

              <ReadMore height="h-24">
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

          {/* Products after query */}

          <ProductDiv products={products} />
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
