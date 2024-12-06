

import React,{ FC } from "react";

import { Props } from "@/types/pageProps";
import OrderDetails from "./OrderDetails";


const Index:FC<Props> =async ({ params }) => {
  const resolvedParams = await params
  const id = resolvedParams.id;




  return <OrderDetails id ={id}/>
};

export default Index;
