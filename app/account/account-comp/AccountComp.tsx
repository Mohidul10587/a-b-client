"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { apiUrl } from "@/app/shared/urls";
import Account from "./Account";
import { useData } from "@/app/DataContext";

const AccountComponent = () => {
  const { user, sessionStatus } = useData();
  async function handleLogOut() {
    try {
      const res = await fetch(`${apiUrl}/user/logout`, {
        credentials: "include",
        method: "POST",
      });
      if (res.ok) {
        localStorage.removeItem("user");
        localStorage.removeItem("isCartSaved");
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
    // Redirect to the sign-out callback URL
    signOut({ callbackUrl: "/auth" });
  }

  if (sessionStatus === "loading") {
    <p>Loading</p>;
  }

  return (
    <Account
      title={
        <div className="flex items-center text-white bg-main md:p-2 p-1 md:rounded rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M19.652 19.405c.552-.115.882-.693.607-1.187c-.606-1.087-1.56-2.043-2.78-2.771C15.907 14.509 13.98 14 12 14s-3.907.508-5.479 1.447c-1.22.728-2.174 1.684-2.78 2.771c-.275.494.055 1.072.607 1.187a37.5 37.5 0 0 0 15.303 0"
            />
            <circle cx="12" cy="8" r="5" fill="currentColor" />
          </svg>
          <p className="md:block hidden pl-1 font-semibold">Account</p>
        </div>
      }
      sub={
        <div>
          <Link
            href="/account"
            className="flex items-center p-2 hover:bg-gray-200"
          >
            <svg
              stroke="currentColor"
              className="mr-1"
              fill="none"
              strokeWidth="2"
              viewBox="0 0 24 24"
              strokeLinecap="round"
              height="25"
              width="25"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            My Account
          </Link>
          {/* <Link
            href="/account/chat"
            className="flex items-center p-2 hover:bg-gray-200"
          >
            <svg
              className="mr-1"
              xmlns="http://www.w3.org/2000/svg"
              width="25"
              height="25"
              viewBox="0 0 256 256"
            >
              <path
                fill="currentColor"
                d="M138 128a10 10 0 1 1-10-10a10 10 0 0 1 10 10m-54-10a10 10 0 1 0 10 10a10 10 0 0 0-10-10m88 0a10 10 0 1 0 10 10a10 10 0 0 0-10-10m58-54v128a14 14 0 0 1-14 14H82.23l-33.16 28.64l-.06.05A13.87 13.87 0 0 1 40 238a14.1 14.1 0 0 1-5.95-1.33A13.88 13.88 0 0 1 26 224V64a14 14 0 0 1 14-14h176a14 14 0 0 1 14 14m-12 0a2 2 0 0 0-2-2H40a2 2 0 0 0-2 2v160a2 2 0 0 0 3.26 1.55l34.82-30.08A6 6 0 0 1 80 194h136a2 2 0 0 0 2-2Z"
              />
            </svg>
            Chating
          </Link> */}
          <Link
            href="/account/wishlist"
            className="flex items-center p-2 hover:bg-gray-200"
          >
            <svg
              className="mr-1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="m8.962 18.91l.464-.588zM12 5.5l-.54.52a.75.75 0 0 0 1.08 0zm3.038 13.41l.465.59zm-8.037-2.49a.75.75 0 0 0-.954 1.16zm-4.659-3.009a.75.75 0 1 0 1.316-.72zm.408-4.274c0-2.15 1.215-3.954 2.874-4.713c1.612-.737 3.778-.541 5.836 1.597l1.08-1.04C10.1 2.444 7.264 2.025 5 3.06C2.786 4.073 1.25 6.425 1.25 9.137zM8.497 19.5c.513.404 1.063.834 1.62 1.16s1.193.59 1.883.59v-1.5c-.31 0-.674-.12-1.126-.385c-.453-.264-.922-.628-1.448-1.043zm7.006 0c1.426-1.125 3.25-2.413 4.68-4.024c1.457-1.64 2.567-3.673 2.567-6.339h-1.5c0 2.198-.9 3.891-2.188 5.343c-1.315 1.48-2.972 2.647-4.488 3.842zM22.75 9.137c0-2.712-1.535-5.064-3.75-6.077c-2.264-1.035-5.098-.616-7.54 1.92l1.08 1.04c2.058-2.137 4.224-2.333 5.836-1.596c1.659.759 2.874 2.562 2.874 4.713zm-8.176 9.185c-.526.415-.995.779-1.448 1.043s-.816.385-1.126.385v1.5c.69 0 1.326-.265 1.883-.59c.558-.326 1.107-.756 1.62-1.16zm-5.148 0c-.796-.627-1.605-1.226-2.425-1.901l-.954 1.158c.83.683 1.708 1.335 2.45 1.92zm-5.768-5.63a7.25 7.25 0 0 1-.908-3.555h-1.5c0 1.638.42 3.046 1.092 4.275z"
              />
            </svg>
            Saved Items
          </Link>
          {sessionStatus === "authenticated" ? (
            <>
              {user.isSeller && (
                <>
                  <Link
                    href={`/seller/${user.slug}`}
                    className="flex items-center p-2 hover:bg-gray-200"
                  >
                    <svg
                      stroke="currentColor"
                      className="mr-2"
                      fill="none"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      strokeLinecap="round"
                      height="25"
                      width="25"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    My Profile
                  </Link>
                  {/* <Link
                    href="/account/seller-dashboard"
                    className="flex items-center p-2 hover:bg-gray-200"
                  >
                    <svg
                      className="mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="m2 8l9.732-4.866a.6.6 0 0 1 .536 0L22 8m-2 3v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8"
                      />
                    </svg>
                    Seller Dashboard
                  </Link> */}
                  {/* <Link
                    href="/account/seller-product"
                    className="flex items-center p-2 hover:bg-gray-200"
                  >
                    <svg
                      className="mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M3 12h.01M3 18h.01M3 6h.01M8 12h13M8 18h13M8 6h13"
                      />
                    </svg>
                    Seller product
                  </Link> */}
                  {/* <Link
                    href="/account/suggestion"
                    className="flex items-center p-2 hover:bg-gray-200"
                  >
                    <svg
                      className="mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 48 48"
                    >
                      <g
                        fill="currentColor"
                        stroke="currentColor"
                        strokeWidth="4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18 6h16v6H18zm0 15h20v6H18zm0 15h26v6H18z"
                        />
                        <circle cx="8" cy="9" r="2" />
                        <circle cx="8" cy="24" r="2" />
                        <circle cx="8" cy="39" r="2" />
                      </g>
                    </svg>
                    Suggested
                  </Link> */}
                  {/* <Link
                    href="/account/seller-withdraw"
                    className="flex items-center p-2 hover:bg-gray-200"
                  >
                    <svg
                      className="mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 28 28"
                    >
                      <path
                        fill="currentColor"
                        d="M18.25 16.5a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5zM2.004 8.75A3.75 3.75 0 0 1 5.754 5H22.25A3.75 3.75 0 0 1 26 8.75v10.5A3.75 3.75 0 0 1 22.25 23H5.755a3.75 3.75 0 0 1-3.75-3.75zm3.75-2.25a2.25 2.25 0 0 0-2.25 2.25v.75H24.5v-.75a2.25 2.25 0 0 0-2.25-2.25zm-2.25 12.75a2.25 2.25 0 0 0 2.25 2.25H22.25a2.25 2.25 0 0 0 2.25-2.25V11H3.505z"
                      />
                    </svg>
                    Withdraw
                  </Link> */}
                  {/* <Link
                    href="/account/betterModel"
                    className="flex items-center p-2 hover:bg-gray-200"
                  >
                    <svg
                      className="mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 2048 2048"
                    >
                      <path
                        fill="currentColor"
                        d="M1024 1000v959l-64 32l-832-415V536l832-416l832 416v744h-128V680zm-64-736L719 384l621 314l245-122zm-64 1552v-816L256 680v816zM335 576l625 312l238-118l-622-314zm1073 1216v-128h640v128zm0-384h640v128h-640zm-256 640v-128h128v128zm0-512v-128h128v128zm0 256v-128h128v128zm-128 24h1zm384 232v-128h640v128z"
                      />
                    </svg>
                    B2B
                  </Link> */}
                </>
              )}
              <div className="p-3 border-t">
                <button
                  onClick={() => handleLogOut()}
                  className="bg-main font-bold uppercase shadow-[0_4px_8px_0_rgba(0,0,0,.2)] text-white block text-center w-full py-2 rounded-md"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="p-3 border-b">
              <Link
                href="/auth"
                className="bg-main font-bold uppercase shadow-[0_4px_8px_0_rgba(0,0,0,.2)] text-white block text-center w-full py-2 rounded-md"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      }
    />
  );
};

export default AccountComponent;
