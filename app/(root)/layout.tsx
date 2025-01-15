import Header from "@/components/globlal/Header";
import React from "react";

const RootLayout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  return (
    <div>
      <Header />
      <main> {children}</main>
    </div>
  );
};

export default RootLayout;
