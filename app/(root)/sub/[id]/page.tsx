import Link from "next/link";
import ReadMore from "@/components/ReadMore";
import { apiUrl } from "@/app/shared/urls";
import CategoryProducts from "@/components/CategoryProduct";
import { Metadata, ResolvingMetadata } from "next";
import { fetchSettings } from "@/app/shared/fetchSettingsData";
import { ISubcategory } from "@/types/category";
import ElementSection from "@/app/(root)/a-root-comp/ElementSection";
import { IProduct } from "@/types/product";
import { IWriter } from "@/types/writer";
import { ISettings } from "@/types/settings";
import { FC } from "react";
import { Props } from "@/types/pageProps";

type FetchResponse = {
  products: IProduct[];
  writers: IWriter[];
  subcategory: ISubcategory;
  settings: ISettings | null;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.id;

  // Fetch the category data
  const { subcategory, settings } = await getData(slug);

  // Extracting relevant information for metadata
  const title =
    subcategory.metaTitle ||
    `Buy ${subcategory?.title} - Subcategory @${settings?.country}` ||
    "Category Title";
  const description =
    subcategory.metaDescription ||
    subcategory?.description.replace(/<\/?[^>]+(>|$)/g, "") || // Remove HTML tags from description
    `Explore a wide range of products in the ${title} category at ${settings?.country}.`;
  const image = subcategory?.photo || "/default-image.png"; // Provide a default image if not available

  return {
    title,
    description,
    keywords: [...subcategory.tags],
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
  const slug = resolvedParams.id;

  // Destructure the object returned by getData
  const {
    products = [],
    writers = [],
    subcategory,
    settings,
  } = await getData(slug);
  if (!subcategory) {
    return <div>Failed to load category data.</div>;
  }
  return (
    <>
      <div className="container mb-4">
        <ol className="hidden lg:flex items-center mb-1.5 pt-1.5 pb-0 px-4 flex-wrap gap-4 gap-y-1 bg-white rounded-b-md text-sm shadow-sm">
          <li>
            <Link
              href="/"
              className="hover:text-gray-600 bg-gray-200 px-3 py-1 rounded max-w-sm inline-block truncate"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href={`/sub/${subcategory.title}`}
              className="hover:text-gray-600 bg-gray-200 px-3 py-1 rounded max-w-sm inline-block truncate"
            >
              {subcategory.title}
            </Link>
          </li>
        </ol>
      </div>

      <ElementSection id={subcategory._id} page="subcategory" />

      <div className="container">
        <CategoryProducts
          country={settings?.country || "Country name"}
          categoryName={subcategory.title}
          products={products}
          writers={writers}
        />
      </div>

      {subcategory?.description && (
        <div className="container my-4">
          <div className="bg-white p-4 border text-lg leading-7">
            <h1 className="text-xl font-bold mb-2">
              Buy {subcategory?.title} in {settings?.country}
            </h1>
            <ReadMore height="h-20">
              {subcategory && (
                <div
                  dangerouslySetInnerHTML={{
                    __html: subcategory.description,
                  }}
                />
              )}
            </ReadMore>
          </div>
        </div>
      )}
    </>
  );
};

export default IndexPage;

async function fetchData(url: string, errorMsg: string) {
  return fetch(url, { next: { revalidate: 30 } })
    .then((res) => {
      if (!res.ok) throw new Error(errorMsg);
      return res.json();
    })
    .catch((error) => {
      console.error(error);
      return errorMsg.includes("category") ? null : [];
    });
}

async function getData(slug: string): Promise<FetchResponse> {
  const products = await fetchData(
    `${apiUrl}/product/product_by_subcategory_slug/${slug}`,
    "Failed to fetch products"
  );
  const writers = await fetchData(
    `${apiUrl}/writer/all2`,
    "Failed to fetch writers"
  );
  const subcategoryData = await fetchData(
    `${apiUrl}/category/subCategoryBySlug/${slug}`,
    "Failed to fetch category"
  );
  const subcategory = subcategoryData.subcategory;
  const settings = await fetchSettings();

  return { products, writers, subcategory, settings };
}
