import Categories from "./Categories";
import { Metadata } from "next";
import ElementSection from "@/app/(root)/a-root-comp/ElementSection";

import { fetchElement } from "@/app/shared/fetchElements";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Categories | Price in Kenya",
    description:
      "Explore a wide range of categories and find the best deals on products at Price in Kenya.",
  };
}

const IndexPage: React.FC = async () => {
  const element = await fetchElement("category-main", "category-main");
  return (
    <div className="max-w-6xl mx-auto">
      <ElementSection elementsData={element} />
      <div className="container my-4">
        <h2 className="text-xl font-semibold">Featured</h2>
        <p>Latest deals from Price in Kenya</p>
        <Categories width={60} height={60} />
      </div>
    </div>
  );
};
export default IndexPage;
