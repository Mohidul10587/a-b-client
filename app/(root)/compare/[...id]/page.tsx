// app/compare/page.tsx (Server Component)
import { apiUrl } from "@/app/shared/urls";
import { fetchSettings } from "@/app/shared/fetchSettingsData";
import Compare from "@/app/(root)/compare/[...id]/Compare";
import { IProduct } from "@/types/product";
import { PropsWithSlagArray } from "@/types/pageProps";
import { FC } from "react";

const fetchProductByIds = async (leftId: string, rightId: string) => {
  try {
    const response = await fetch(
      `${apiUrl}/product/by-ids/${leftId}/${rightId}`,
      {
        next: { revalidate: 59 },
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    const products: [IProduct, IProduct] = await response.json();
    return products;
  } catch (error) {
    console.error(error);
    return null;
  }
};

const ComparePageContainer: FC<PropsWithSlagArray> = async ({
  params,
}: PropsWithSlagArray) => {
  const resolvedParams = await params;
  const [leftSideProductID, rightSideProductID, categoryID] =
    resolvedParams.id || [];
  const products = await fetchProductByIds(
    leftSideProductID,
    rightSideProductID
  );

  if (!products) {
    return <div>Error loading products</div>;
  }

  const [leftSideProduct, rightSideProduct] = products;
  const settings = await fetchSettings();

  return (
    <Compare
      leftSideProduct={leftSideProduct}
      rightSideProduct={rightSideProduct}
      categoryID={categoryID}
      categoryName={leftSideProduct.category.categoryName}
      settings={settings}
    />
  );
};

export default ComparePageContainer;
