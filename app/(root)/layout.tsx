import Header from "@/components/globlal/Header";
import React from "react";
import ClientLayout from "./clientLayout";

const RootLayout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default RootLayout;
