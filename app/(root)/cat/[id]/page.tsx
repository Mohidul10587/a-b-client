import Link from "next/link";
import ReadMore from "@/components/ReadMore";
import { apiUrl, clientSideUrl } from "@/app/shared/urls";
import CategoryProducts from "./CategoryProduct";
import { Metadata, ResolvingMetadata } from "next";
import { fetchSettings } from "@/app/shared/fetchSettingsData";
import ElementSection from "../../a-root-comp/ElementSection";
import { FC } from "react";
import { Props } from "@/types/pageProps";

import { fetchElement } from "@/app/shared/fetchElements";
import ProductDiv from "@/components/ProductBox";
import Image from "next/image";

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
    `Buy ${category?.categoryName} | Category | @${settings?.country}` ||
    "Category Title";
  const description =
    category.metaDescription ||
    category?.description?.replace(/<\/?[^>]+(>|$)/g, "") || // Remove HTML tags from description
    `Explore a wide range of products in the ${title} category at ${settings.country}.`;
  const image = category?.photoUrl || "/default-image.png"; // Provide a default image if not available

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
    settings,
  } = await fetchData(slug);
  const element = await fetchElement(category._id, "category");

  return (
    <div className="max-w-6xl m-auto">
      <div className="grid grid-cols-5">
        <div className="col-span-1 bg-green-700">this is div</div>
        <div className="col-span-4 w-full">
          <div className="flex justify-between mb-2">
            <div className="w-2/12">
              <div className="flex justify-center h-44 items-center">
                <Image
                  src={category?.photo || "/default.jpg"}
                  alt="Author Image"
                  width={100}
                  height={94}
                  className="rounded-full "
                />
              </div>
            </div>
            <div className="w-10/12">
              <span className="font-semibold text-2xl">
                {category.categoryName}
              </span>

              <ReadMore height="h-24">
                {category && (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: category.description,
                    }}
                  ></div>
                )}
              </ReadMore>
            </div>
          </div>

          <div className="">
            <ProductDiv products={products} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;

async function fetchData(slug: string) {
  try {
    const [data, settings] = await Promise.all([
      fetch(`${apiUrl}/product/products_by_category_slug/${slug}`, {
        next: { revalidate: 30 },
      }).then((res) => res.json()),
      fetchSettings(),
    ]);

    const products = data.products;
    const writers = data.writers;
    const category = data.category;

    return {
      products,
      writers,
      category,
      settings,
    };
  } catch (error) {
    console.error("Error fetching category data:", error);
    return {
      products: [],
      writers: [],
      category: null,
      settings: null,
      elementsData: null,
    };
  }
}
