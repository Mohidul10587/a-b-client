"use client";
import { apiUrl } from "@/app/shared/urls";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const AdminLogin: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    fetch(`${apiUrl}/admin/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((response) => response.json().then((data) => ({ data, response })))
      .then(({ data, response }) => {
        if (!response.ok) {
          setError(data.message);
          setIsLoading(false);
          return;
        }

        localStorage.setItem("accessToken", data.token);
        router.push("/admin");
      })
      .catch((error) => {
        console.log(error);
        console.error(error);
        setError("Something went wrong");
        setIsLoading(false);
      });
  };

  return (
    <>
      <div className="bg-gray-50 font-[sans-serif] text-[#333]">
        <div className="flex flex-col items-center justify-center py-6 px-4">
          <div className="max-w-md w-full border py-8 px-6 rounded border-gray-300 bg-white">
            <h1 className="text- font-bold">Admin login</h1>
            {error ? (
              <div className="mt-4 text-red-500 text-center">{error}</div>
            ) : null}
            <form className="mt-4 space-y-4" onSubmit={handleLogin}>
              <div>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full text-sm px-4 py-3 rounded outline-none border-2 focus:border-main"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full text-sm px-4 py-3 rounded outline-none border-2 focus:border-main"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="!mt-10">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-sm rounded text-white bg-main hover:bg-main focus:outline-none"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Log in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
