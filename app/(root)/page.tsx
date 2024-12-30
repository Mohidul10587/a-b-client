import ReadMore from "@/components/ReadMore";
import { fetchSettings } from "@/app/shared/fetchSettingsData";
import { Metadata } from "next";
import React from "react";

import ElementSection from "@/app/(root)/a-root-comp/ElementSection";
import { fetchElement } from "../shared/fetchElements";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await fetchSettings();
  return {
    title: settings?.websiteTitle,
    description: settings.metaDescription,
    icons: {
      icon: settings?.favicon,
    },
  };
}

const IndexPage = async () => {
  const settings = await fetchSettings();
  const element = await fetchElement("home-main", "home-main");
  return (
    <>
      <ElementSection elementsData={element} />
      {settings.description && (
        <div className="container my-4">
          <div className="bg-white p-4 border leading-normal">
            <ReadMore height="h-40">
              <div
                dangerouslySetInnerHTML={{ __html: settings?.description }}
              />
            </ReadMore>
          </div>
        </div>
      )}
    </>
  );
};

export default IndexPage;
