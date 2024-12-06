import React from "react";
import Compares from "@/components/Compares";
import { apiUrl } from "@/app/shared/urls";

interface Product {
  _id: string;
  photo: string;
  title: string;
}

interface Comparison {
  _id: string;
  leftProductId: Product;
  rightProductId: Product;
}

async function getComparisons(): Promise<Comparison[]> {
  const response = await fetch(`${apiUrl}/comparison/all`, {
    next: { revalidate: 50 }, // Ensure no caching for up-to-date data
  });
  if (!response.ok) {
    throw new Error("Failed to fetch comparisons");
  }
  const data = await response.json();
  return data.comparisons;
}

const CompareHistory = async () => {
  let comparisons: Comparison[] = [];
  try {
    comparisons = await getComparisons();
  } catch (error: any) {
    return <p>Error: {error.message}</p>;
  }

  const comparisonItems = comparisons.map((comparison) => ({
    link: `/compare/${comparison.leftProductId?._id}/${comparison.rightProductId?._id}`,
    post: [
      {
        img: comparison.leftProductId?.photo,
        title: comparison.leftProductId?.title,
      },
      {
        img: comparison.rightProductId?.photo,
        title: comparison.rightProductId?.title,
      },
    ],
  }));

  return (
    <>
      <Compares items={comparisonItems} />
    </>
  );
};

export default CompareHistory;
