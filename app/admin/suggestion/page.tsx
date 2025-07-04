"use client";
import { fetcher } from "@/app/shared/fetcher";
import Table from "@/components/Table";

import useSWR from "swr";

const IndexPage: React.FC = () => {
  const { data, error, mutate, isLoading } = useSWR(
    "suggestion/allForAdminIndexPage",
    fetcher
  );

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table
          title="Suggestion List"
          link="suggestion"
          post={data?.items || []}
          mutate={mutate}
        />
      )}
    </>
  );
};
export default IndexPage;
