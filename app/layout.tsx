import { Metadata } from "next";
import { SettingsProvider } from "./context/AppContext";
import "./globals.css";
import { fetchSettings } from "./shared/fetchSettingsData";

// Generate metadata dynamically
export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();

  return {
    title: settings?.websiteTitle || "Default Title",
    description: settings?.metaDescription || "Default Description",
  };
}

interface RootLayoutProps {
  children: React.ReactNode;
}

async function RootLayout({ children }: RootLayoutProps) {
  // Fetch settings to use across the application
  const settings = await fetchSettings();

  return (
    <html lang="en">
      <head>
        <style>{`
  history {display:none !important} 
  .bg-main {background-color: ${
    settings?.bgColor || "#235432"
  } !important} /* Fallback color for backgrounds */
  .text-main {color: ${
    settings?.bgColor || "#235432"
  } !important} /* Fallback color for text */
  .border-main {border-color: ${
    settings?.bgColor || "#235432"
  } !important} /* Fallback color for borders */
`}</style>
      </head>
      <body className="bg-gray-200" cz-shortcut-listen="true">
        {/* Provide settings globally */}
        <SettingsProvider value={settings}>{children}</SettingsProvider>
      </body>
    </html>
  );
}

export default RootLayout;
