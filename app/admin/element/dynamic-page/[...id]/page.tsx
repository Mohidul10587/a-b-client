import React from "react";

import { Props } from "@/types/pageProps";
import ShowElement from "./ShowElement";




const Page: React.FC<Props> = async ({ params }) => {
  const resolvedParams = await params;


  return <ShowElement props={resolvedParams}/>
};

export default Page;
