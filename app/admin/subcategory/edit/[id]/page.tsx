"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import { fetcher } from "@/app/shared/fetcher";
import Form from "../../Form";

const IndexPage = () => {
  const id = useParams().id as string;
  const { data, isLoading } = useSWR(
    `subcategory/singleForEditPage/${id}`,
    fetcher
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  return (
    <>
      {data.item && (
        <Form id={id} initialData={data.item} pagePurpose="update" />
      )}
      {!data.item && (
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-2xl font-bold">{data.message}</h1>
        </div>
      )}
    </>
  );
};

export default IndexPage;
