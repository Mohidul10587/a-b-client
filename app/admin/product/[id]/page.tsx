
import React from "react"
import { Props } from "@/types/pageProps";
import UpdateProduct from "./UpdateProduct";


const Index: React.FC<Props> =async ({ params }) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  return (
  <UpdateProduct productId={id}/>
  );
};

export default Index;
