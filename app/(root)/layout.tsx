import Header from "@/components/globlal/Header";
import React from "react";

const RootLayout: React.FC<{ children: React.ReactNode }> = async ({
  children,
}) => {
  return (
    <div>
      <Header />
      <main className="min-h-screen flex flex-col"> {children}</main>
      {/* <Footer /> */}
    </div>
  );
};

export default RootLayout;
