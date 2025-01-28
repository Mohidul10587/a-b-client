"use client";

import { fetcher } from "@/app/shared/fetcher";
import Table from "@/components/Table";

import useSWR from "swr";

const IndexPage: React.FC = () => {
  const { data, error, mutate, isLoading } = useSWR(
    "subcategory/allSubcategoriesForAdminSubCatIndexPage",
    fetcher
  );

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table
          title="Category List"
          link="/admin/subcategory"
          post={data?.respondedData || []}
          mutate={mutate}
        />
      )}
    </>
  );
};
export default IndexPage;
