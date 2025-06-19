import React from "react";
import ShowElement from "./ShowElement";

const Page: React.FC<any> = async ({ params }) => {
  const resolvedParams = await params;

  return <ShowElement props={resolvedParams} />;
};

export default Page;
