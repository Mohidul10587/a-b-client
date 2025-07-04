"use client";

import Form from "../Form";
import { initialData } from "../initialData";

const IndexPage = () => {
  return <Form initialData={initialData} pagePurpose="add" />;
};

export default IndexPage;
