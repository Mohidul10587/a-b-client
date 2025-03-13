"use client";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import Search from "./Search";
import AccountComponent from "@/app/account/account-comp/AccountComp";
import Account from "../Account";
import { useData } from "@/app/DataContext";

const Header: React.FC<{
  menuWithCategories?: any[];
}> = ({ menuWithCategories }) => {
  const [user, setUser] = useState<{
    name?: string;
    image?: string;
    email?: string;
  } | null>(null);
  const { settings } = useData();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const { numberOfCartProduct, user: currentUser } = useData();
  const whatsappUrl = `https://wa.me/${settings?.whatsapp}?text=Hello ! I want to talk with you about your product`;

  return (
    <>
      <div className="bg-white z-50 w-full sticky top-0">
        <div className="container">
          <div className="flex flex-row justify-between items-center md:py-2 py-1">
            <div className="flex items-center">
              <Link href="/" className="outline-none">
                <Image
                  src={settings?.logo}
                  unoptimized
                  width={200}
                  height={50}
                  quality={100}
                  className="h-8 w-min"
                  alt="Logo"
                />
              </Link>
            </div>
            <Search />

            <div className="flex items-center gap-2 justify-end relative">
              <Link
                href="/search"
                className="outline-none md:hidden p-1.5 mr-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="m21 21l-4.343-4.343m0 0A8 8 0 1 0 5.343 5.343a8 8 0 0 0 11.314 11.314"
                  />
                </svg>
              </Link>
              <Link href={"/cart"} className="text-3xl">
                {numberOfCartProduct}
              </Link>
              <AccountComponent />

              <Account
                title={
                  <div className="hidden md:flex items-center hover:text-white text-main border border-main bg-white hover:bg-gray-200 px-4 py-1.5 rounded">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M11.95 18q.525 0 .888-.363t.362-.887t-.362-.888t-.888-.362t-.887.363t-.363.887t.363.888t.887.362m.05 4q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12t-2.325-5.675T12 4T6.325 6.325T4 12t2.325 5.675T12 20m.1-12.3q.625 0 1.088.4t.462 1q0 .55-.337.975t-.763.8q-.575.5-1.012 1.1t-.438 1.35q0 .35.263.588t.612.237q.375 0 .638-.25t.337-.625q.1-.525.45-.937t.75-.788q.575-.55.988-1.2t.412-1.45q0-1.275-1.037-2.087T12.1 6q-.95 0-1.812.4T8.975 7.625q-.175.3-.112.638t.337.512q.35.2.725.125t.625-.425q.275-.375.688-.575t.862-.2"
                      />
                    </svg>
                    <p className="md:block hidden pl-1 font-semibold">Help</p>
                  </div>
                }
                sub={
                  <div>
                    <Link
                      href="/supports"
                      className="p-2 hover:bg-gray-200 block"
                    >
                      Help Center
                    </Link>
                    <Link
                      href="/order-policies"
                      className="p-2 hover:bg-gray-200 block"
                    >
                      Order Policies
                    </Link>
                    <Link
                      href="/privacy-policies"
                      className="p-2 hover:bg-gray-200 block"
                    >
                      Privacy Policies
                    </Link>
                    <Link
                      href="/terms-and-conditions"
                      className="p-2 hover:bg-gray-200 block"
                    >
                      Terms and Conditions
                    </Link>
                    <Link href="/store" className="p-2 hover:bg-gray-200 block">
                      Store Locator
                    </Link>
                  </div>
                }
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
