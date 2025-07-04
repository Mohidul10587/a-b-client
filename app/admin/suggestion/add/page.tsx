"use client";
import React from "react";

import Form from "../Form";
import { apiUrl } from "@/app/shared/urls";

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
