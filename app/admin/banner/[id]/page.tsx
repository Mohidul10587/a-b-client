"use client";

import useSWR from "swr";
import { useParams } from "next/navigation";
import Form from "../Form";
import { fetcher } from "@/app/shared/fetcher";

const IndexPage = () => {
  const id = useParams().id as string;
  const { data, isLoading } = useSWR(`banner/singleForEditPage/${id}`, fetcher);

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold">Loading...</h1>
      </div>
    );
  return (
    <>
      {data.item && <Form id={id} initialData={data.item} pagePurpose="edit" />}
      {!data.item && (
        <div className="flex justify-center items-center h-screen">
          <h1 className="text-2xl font-bold">{data.message}</h1>
        </div>
      )}
    </>
  );
};

export default IndexPage;
