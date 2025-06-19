import React, { FC } from "react";

import OrderDetails from "./OrderDetails";

const Index: FC<any> = async ({ params }) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return <OrderDetails id={id} />;
};

export default Index;
