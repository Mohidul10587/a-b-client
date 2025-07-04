"use client";
import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";
import Form from "../../Form";
import { fetcher } from "@/app/shared/fetcher";
const ProductList: React.FC = () => {
  const id = useParams().id as string;
  const { data, isLoading } = useSWR(
    `suggestion/singleForEditPage/${id}`,
    fetcher
  );
  if (isLoading) return <p>Loading...</p>;

  return (
    <Form
      initialData={data.item}
      submitText="Update Series"
      id={id}
      pagePurpose={"update"}
    />
  );
};

export default ProductList;
