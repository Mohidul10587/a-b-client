import React from "react";
import { Props } from "@/types/pageProps";
import UpdateWriter from "./UpdateWriter";

const Index: React.FC<Props> = async ({ params }) => {
  const resolvedParams = await params;
  const writerId = resolvedParams.id;

  return <UpdateWriter writerId={writerId} />;
};

export default Index;
