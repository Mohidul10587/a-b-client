

import React from "react";
import UpdateCategory from "./UpdateCategory";
import { Props } from "@/types/pageProps";


const Index: React.FC<Props> =async ({ params }) => {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  return (
  <UpdateCategory id={id}/>
  );
};

export default Index;
