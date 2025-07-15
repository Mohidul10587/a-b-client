"use client";
import React from "react";
import { useData } from "@/app/DataContext";
import Form from "@/app/admin/product/Form";
import { initialData } from "@/app/admin/product/initialData";

const Page = () => {
  const { user } = useData();
  return <Form initialData={initialData} pagePurpose={"edit"} />;
};
export default Page;
