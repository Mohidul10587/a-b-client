import Link from "next/link";
import ReadMore from "@/components/ReadMore";
import { apiUrl } from "@/app/shared/urls";
import CategoryProducts from "@/components/CategoryProduct";
import { Metadata, ResolvingMetadata } from "next";
import { fetchSettings } from "@/app/shared/fetchSettingsData";
import ElementSection from "@/components/ElementSection";
import { FC } from "react";
import { Props } from "@/types/pageProps";

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
    category.metaDescription ||
    `Buy ${category?.categoryName} - Category @${settings?.country}` ||
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
    category = null,
    settings,
  } = await fetchData(slug);

  return (
    <>
      <div className="container mb-4">
        <ol className="hidden lg:flex items-center mb-1.5 pt-1.5 pb-0 px-4 flex-wrap gap-4 gap-y-1 bg-white rounded-b-md text-sm shadow-sm">
          <li>
            <Link
              href="/"
              title={settings?.title}
              className="hover:text-gray-600 bg-gray-200 px-3 py-1 rounded max-w-sm inline-block truncate"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/cat"
              title="All categories"
              className="hover:text-gray-600 bg-gray-200 px-3 py-1 rounded max-w-sm inline-block truncate"
            >
              Categories
            </Link>
          </li>
          <li>
            <Link
              href={`/cat/${category?.slug}`}
              title="All categories"
              className="hover:text-gray-600 bg-gray-200 px-3 py-1 rounded max-w-sm inline-block truncate"
            >
              {category?.categoryName}
            </Link>
          </li>
        </ol>
      </div>
      <ElementSection id={category._id} page="category" />

      <div className="container">
        <CategoryProducts
          country={settings.country}
          categoryName={category?.categoryName}
          products={products}
          writers={writers}
        />
      </div>
      {category?.description && (
        <div className="container my-4">
          <div className="bg-white p-4 border text-lg leading-7">
            <h1 className="text-xl font-bold mb-2">
              Buy {category?.categoryName} in {settings?.country}
            </h1>
            <ReadMore height="h-20">
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
      )}
    </>
  );
};

export default IndexPage;

async function fetchData(slug: string) {
  try {
    const [products, writers, category, settings] = await Promise.all([
      fetch(`${apiUrl}/product/products_by_category_slug/${slug}`, {
        next: { revalidate: 30 },
      }).then((res) => res.json()),
      fetch(`${apiUrl}/writer/all2`, { next: { revalidate: 30 } }).then((res) =>
        res.json()
      ),
      fetch(`${apiUrl}/category/category_by_slug/${slug}`, {
        next: { revalidate: 30 },
      }).then((res) => res.json()),
      fetchSettings(),
    ]);

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
