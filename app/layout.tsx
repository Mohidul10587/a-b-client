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
      <head>
        <style>
          {`
        .history {display:none !important}
        .accent-main {accent-color: ${
          settings?.bgColor || "#235432"
        } !important}
        ::-webkit-scrollbar-thumb {background-color: ${
          settings?.bgColor || "#235432"
        } !important}
        .hover\\:bg-main-50:hover, .bg-main-50 {background-color: ${
          settings?.bgColor ? `${settings?.bgColor}20` : "#23543250"
        } !important;}
        .hover\\:bg-main:hover,
        .bg-main {background-color: ${
          settings?.bgColor || "#235432"
        } !important}
        .hover\\:text-main:hover,
        .fill-main {fill: ${settings?.bgColor || "#235432"} !important}
        .text-main {color: ${settings?.bgColor || "#235432"} !important}
        .hover\\:border-main:hover,
        .border-main {border-color: ${
          settings?.bgColor || "#235432"
        } !important}
        `}
        </style>
      </head>

      <body className="bg-gray-300" cz-shortcut-listen="true">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
