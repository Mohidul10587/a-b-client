import Header from "@/components/globlal/Header";
import React from "react";
import ClientLayout from "./clientLayout";

const RootLayout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  return (
    <ClientLayout>
      <Header />
      <main> {children}</main>
    </ClientLayout>
  );
};

export default RootLayout;
