"use client";
import { apiUrl } from "@/app/shared/urls";
import Link from "next/link";
// import Table from "@/components/Table";

import useSWR from "swr";
import Table from "../components/Table";
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch data");
    return res.json();
  });
const IndexPage: React.FC = () => {
  const { data, error, mutate, isLoading } = useSWR(
    `${apiUrl}/publishers/allForIndexPage`,
    fetcher
  );

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <Table
          title="Publishers List"
          link="publishers"
          post={data}
          mutate={mutate}
        />
      )}
    </>
  );
};
export default IndexPage;
