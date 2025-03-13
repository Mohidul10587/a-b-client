"use client";

import React from "react";

import { SessionProvider } from "next-auth/react";
import { DataProvider } from "./DataContext";

const ClientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <SessionProvider>
      <DataProvider>{children}</DataProvider>
    </SessionProvider>
  );
};

export default ClientLayout;
