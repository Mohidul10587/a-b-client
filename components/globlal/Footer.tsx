import React from "react";
import Image from "next/image";
import Link from "next/link";
import FooterMenu from "./FooterMenu";
import { fetchSettings } from "@/app/shared/fetchSettingsData";

// Server component
const FooterPage = async () => {
  const settings = await fetchSettings();

  return (
    <>
      <FooterMenu
        items={[
          {
            icon: (
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mx-auto"
              >
                <path
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            ),
            title: "Home",
            link: "/",
          },
          {
            icon: (
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mx-auto"
              >
                <path
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            ),
            title: "Categories",
            link: "/cat",
          },
          {
            icon: (
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mx-auto"
              >
                <path
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            ),
            title: "Writers",
            link: "/writer",
          },
          {
            icon: (
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mx-auto"
              >
                <path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </svg>
            ),
            title: "Search",
            link: "/search",
          },
        ]}
      />
      <div className="fixed md:bottom-8 bottom-16 right-4 flex flex-col">
        {settings.whatsapp && (
          <Link
            href={`https://wa.me/${settings?.whatsapp}`}
            target="_blank"
            className="rounded-full bg-white shadow-lg flex items-center justify-center p-1 mt-2"
          >
            <Image
              src="/whatsapp.svg"
              width={40}
              height={40}
              alt="Logo"
              className="w-8"
            />
          </Link>
        )}
        {settings?.telegram && (
          <Link
            href={`https://t.me/${settings?.telegram}`}
            target="_blank"
            className="rounded-full bg-white shadow-lg flex items-center justify-center p-1 mt-2"
          >
            <Image
              src="/telegram.svg"
              width={40}
              height={40}
              alt="Logo"
              className="w-8"
            />
          </Link>
        )}
      </div>
      <div className="bg-main text-white py-2 mt-2">
        <div className="container">
          <div className="flex flex-col md:flex-row md:justify-between">
            {settings ? (
              <div
                dangerouslySetInnerHTML={{ __html: settings?.copyright }}
              ></div>
            ) : (
              <p>Failed to load data</p>
            )}
            <div className="flex space-x-2 md:justify-end md:items-center">
              <Link href="/privacy-policies">Privacy Policies</Link>
              <Link href="/terms-and-conditions">Terms and Conditions</Link>
              <Link href="/order-policies">Order Policies</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FooterPage;
