"use client";
import React from "react";
import useSWR from "swr";
import { useParams } from "next/navigation";

import { fetcher } from "@/app/shared/fetcher";
import Form from "@/app/admin/suggestion/Form";
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
