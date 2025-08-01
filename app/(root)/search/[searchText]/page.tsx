import React, { FC } from "react";
import SearchResult from "@/app/(root)/search/[searchText]/SearchResult"; // Adjust the import path

const IndexPage: FC<any> = async ({ params }) => {
  const resolvedParams = await params;
  const searchText = resolvedParams.searchText;

  return (
    <div>
      <div className="container">
        <h2 className="text-xl font-semibold">Products for {searchText}</h2>
        <SearchResult searchText={searchText} />
      </div>
    </div>
  );
};

export default IndexPage;
