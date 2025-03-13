"use client";
import { Suspense, useEffect } from "react";
import Auth from "@/app/auth/Auth";
import Image from "next/image";
import Link from "next/link";
import { useData } from "../DataContext";
import { useRouter } from "next/navigation";

const IndexPage: React.FC = () => {
  const { sessionStatus, settings } = useData();
  const router = useRouter();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.push("/"); // Redirect to the home page
    }
  }, [sessionStatus, router]);

  if (sessionStatus === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-main bg-bg bg-no-repeat bg-cover flex justify-center items-center">
        <div className="flex flex-col items-center w-full max-w-lg m-4">
          <Link href="/" className="outline-none mb-6">
            <Image
              src={settings?.logo || "/default.jpg"}
              unoptimized
              width={200}
              height={50}
              quality={100}
              className="h-9 w-min"
              alt="Logo"
            />
          </Link>
          <>
            <Suspense fallback={<div>Loading...</div>}>
              <Auth />
            </Suspense>
          </>
        </div>
      </div>
    );
  }
  // Avoid rendering anything if the user is being redirected
  return null;
};

export default IndexPage;
