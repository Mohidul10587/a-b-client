import type { Metadata } from "next";
import "./globals.css";

import ClientLayout from "./clientLayout";
import { fetchSettings } from "./shared/fetchSettingsData";

export const metadata: Metadata = {
  title:
    "Zuricart | Online Shopping Site Kenya - Shop For Phones, Televisions, Electronics and More",
  description: "Online shopping site Kenya",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await fetchSettings();

  return (
    <html lang="en">
      <body className="bg-gray-300" cz-shortcut-listen="true">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
