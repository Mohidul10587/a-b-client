import React from "react";

import UpdateProduct from "./UpdateProduct";

const Index: React.FC<any> = async ({ params }) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  return <UpdateProduct productId={id} />;
};

export default Index;
