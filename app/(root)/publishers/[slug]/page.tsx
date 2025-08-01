import { apiUrl, clientSideUrl } from "@/app/shared/urls";
import { Metadata, ResolvingMetadata } from "next";
import { fetchSettings } from "@/app/shared/fetchSettingsData";
import { FC } from "react";

import ClientComponent from "./ClientComponent";
export async function generateMetadata(
  { params }: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Fetch the publisher data
  const { settings, publisher } = await fetchData(slug);

  // Extracting relevant information for metadata
  const title =
    publisher.metaTitle ||
    `Buy ${publisher?.title} | Category | @${settings?.country}` ||
    "Category Title";
  const description =
    publisher.metaDescription ||
    publisher?.description?.replace(/<\/?[^>]+(>|$)/g, "") || // Remove HTML keywords from description
    `Explore a wide range of products in the ${title} publisher at ${settings.country}.`;
  const image = publisher?.img || "/default-image.png"; // Provide a default image if not available

  return {
    title,
    description,
    keywords: [...publisher.keywords],
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
      canonical: `${clientSideUrl}/category/${publisher.slug}`,
    },
  };
}

const IndexPage: FC<any> = async ({ params }) => {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;

  // Destructure the object returned by getData
  const {
    products = [],
    writers = [],
    publisher = null,
    categories = [],
    settings,
  } = await fetchData(slug);
  // const element = await fetchElement(publisher._id, "publisher");

  return (
    <div className="max-w-6xl mx-auto">
      <ClientComponent
        publisher={publisher}
        products={products}
        categories={categories}
        writers={writers}
      />
    </div>
  );
};

export default IndexPage;

async function fetchData(slug: string) {
  try {
    const [data, settings] = await Promise.all([
      fetch(`${apiUrl}/product/products_by_punishers_slug/${slug}`, {
        next: { revalidate: 30 },
      }).then((res) => res.json()),

      fetchSettings(),
    ]);

    const products = data.products;
    const writers = data.writers;
    const categories = data.categories;
    const publisher = data.publisher;

    return {
      products,
      writers,
      publisher,
      categories,
      settings,
    };
  } catch (error) {
    console.error("Error fetching publisher data:", error);
    return {
      products: [],
      writers: [],
      publisher: null,
      settings: null,
      categories: [],
      elementsData: null,
    };
  }
}
