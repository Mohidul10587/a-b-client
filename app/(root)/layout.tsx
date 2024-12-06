import React from "react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RootLayout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow"> {children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default RootLayout;
