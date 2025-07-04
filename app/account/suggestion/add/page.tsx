"use client";
import Form from "@/app/admin/suggestion/Form";
import React from "react";

const SeriesAddPage: React.FC = () => {
  const initialData = {
    title: "",
    products: [],
  };
  return (
    <Form
      submitText="Create Series"
      initialData={initialData}
      pagePurpose="add"
    />
  );
};

export default SeriesAddPage;
