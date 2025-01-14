import { apiUrl } from "@/app/shared/urls";

import ElementSection from "@/app/(root)/a-root-comp/ElementSection";
import { Metadata } from "next";

import Link from "next/link";
import Writers from "./Writers";
import { fetchElement } from "@/app/shared/fetchElements";
import { getWriters } from "@/app/shared/fetchData";
export const generateMetadata = (): Metadata => {
  return {
    title: "Writers | Price in Kenya",
    description:
      "Discover and explore products by writer at Price in Kenya. Browse through a wide range of writers to find the products you love.",
  };
};

const IndexPage: React.FC = async () => {
  const writers: any = await getWriters();
  const element = await fetchElement("home-main", "home-main");
  return (
    <>
      <div className="container mb-4">
        <ol className="hidden lg:flex items-center mb-1.5 pt-1.5 pb-0 px-4 flex-wrap gap-4 gap-y-1 bg-white rounded-b-md text-sm shadow-sm">
          <li>
            <Link
              href="/"
              title="Price in Kenya"
              className="hover:text-gray-600 bg-gray-200 px-3 py-1 rounded max-w-sm inline-block truncate nuxt-link-active"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/writer"
              title="Oppo products from Price in Kenya"
              className="hover:text-gray-600 bg-gray-200 px-3 py-1 rounded max-w-sm inline-block truncate"
            >
              Writers
            </Link>
          </li>
        </ol>
      </div>

      <ElementSection elementsData={element} />
      <div className="container my-4">
        <h2 className="text-xl font-semibold">Writers</h2>
        <p>Find products by writer</p>
        <Writers writers={writers} />
      </div>
    </>
  );
};
export default IndexPage;
