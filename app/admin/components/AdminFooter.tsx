"use client";
import Image from "next/image";
import Link from "next/link";

import { useSettings } from "@/app/context/AppContext";

// Server component
const FooterPage = () => {
  const settings = useSettings();
  return (
    <>
      <div className="fixed md:bottom-8 bottom-16 right-4 flex flex-col">
        {settings?.whatsapp && (
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
            {settings && (
              <div
                dangerouslySetInnerHTML={{ __html: settings.copyright }}
              ></div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FooterPage;
