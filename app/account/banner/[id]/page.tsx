
import React from "react";
import { Props } from "@/types/pageProps";
import BannerManager from "./BannerManager";


const IndexPage: React.FC<Props> = async ({ params }) => {
  const resolvedParams = await params;
  const bannerId = resolvedParams.id;



  return (
    <div className="container my-4">
      <BannerManager bannerId={bannerId}  />
    </div>
  );
};

export default IndexPage;
