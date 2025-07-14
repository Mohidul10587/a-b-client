"use client";

import { useData } from "@/app/DataContext";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
const Auth = () => {
  const [activeForm, setActiveForm] = useState<
    "signup" | "login" | "forgotPassword"
  >("login");

  const [emailOrPhoneOrSlug, setEmailOrPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submittingState, setSubmittingState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { settings } = useData();
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";
  const handleFormSwitch = (form: typeof activeForm) => setActiveForm(form);
  const handleSignInWithGoogle = () =>
    signIn("google", { callbackUrl: redirectUrl });

  const handleSignInWithFacebook = () =>
    alert("Oh no! Facebook login is not available yet.");
  const detectIdentifierType = (value: string): "email" | "phone" | "slug" => {
    const trimmed = value.trim();

    // 1️⃣ Email (simple RFC‑ish check)
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (emailRegex.test(trimmed)) return "email";

    // 2️⃣ Phone: accepts +88…, 01…, or any 8‑15 digits, optionally with spaces/dashes
    const phoneRegex = /^(\+?\d{1,3}[- ]?)?(\d{8,15})$/;
    if (phoneRegex.test(trimmed.replace(/[-\s]/g, ""))) return "phone";

    // 3️⃣ Slug: letters, numbers, dashes/underscores, 3–30 chars
    const slugRegex = /^[a-z0-9_-]{3,30}$/i;
    if (slugRegex.test(trimmed)) return "slug";

    // fallback ‑ mark as slug so you still hit your backend validation
    return "slug";
  };
  const identifierType = detectIdentifierType(emailOrPhoneOrSlug);
  const onLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmittingState(true);
    setError(null);

    try {
      const signInResult = await signIn("credentials", {
        authProvider: identifierType,
        identifier: emailOrPhoneOrSlug.trim(),
        password,
        operationType: "logIn",
        redirect: false, // keep control in the component
      });

      if (signInResult?.error) throw new Error(signInResult.error);

      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setSubmittingState(false);
    }
  };

  const onSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmittingState(true);
    setError(null);
    try {
      // আলাদা signUp API কল বাদ
      const res = await signIn("credentials", {
        name: name,
        authProvider: identifierType,
        identifier: emailOrPhoneOrSlug.trim(),
        password,
        operationType: "signUp",
        redirect: false,
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push(redirectUrl);
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setSubmittingState(false);
    }
  };

  return (
    <div className="p-2 md:p-6 bg-white w-full rounded-xl shadow border">
      <div className="text-gray-700 text-center mb-4">
        <h1 className="text-base font-bold">Welcome to {settings?.country}</h1>
        <p className="text-xs">Log in to manage your account.</p>
      </div>

      <form
        className="space-y-6"
        onSubmit={(e) =>
          activeForm === "login" ? onLoginSubmit(e) : onSignupSubmit(e)
        }
      >
        <div className="rounded-md shadow-sm">
          {activeForm === "signup" && (
            <div className="mb-2">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError(null);
                }}
                required
                className={tailwindClass}
                placeholder="Enter your name"
              />
            </div>
          )}

          <div className="mb-2">
            <label htmlFor="emailOrPhoneOrSlug">Email or Phone or Username</label>
            <input
              id="emailOrPhoneOrSlug"
              name="emailOrPhoneOrSlug"
              type="text"
              autoComplete="emailOrPhoneOrSlug"
              value={emailOrPhoneOrSlug}
              onChange={(e) => {
                setEmailOrPhone(e.target.value);
                setError(null);
              }}
              required
              className={tailwindClass}
              placeholder="Enter your email or phone"
            />
          </div>

          <div className="mb-2">
            <label htmlFor="password">Password</label>
            <div className="flex items-center mt-1">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={
                  activeForm === "login" ? "current-password" : "new-password"
                }
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={tailwindClass}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="ml-1"
              >
                {showPassword ? closedEyeICon : openedEyeICon}
              </button>
            </div>
          </div>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submittingState}
          className={`${commonClass} ${
            submittingState
              ? "text-gray-300 bg-blue-900"
              : "text-white bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {activeForm === "login"
            ? "Log in with Email or Phone or Username"
            : "Sign up with Email or Phone or Username"}
        </button>
      </form>

      <p
        className="mt-4 text-center cursor-pointer"
        onClick={() =>
          handleFormSwitch(activeForm === "login" ? "signup" : "login")
        }
      >
        {activeForm === "login"
          ? "No account? Create a new account"
          : "Already have an account? Log In"}
      </p>

      <GoogleAndFacebookDiv
        handleSingInWithGoogle={handleSignInWithGoogle}
        handleSingInWithFacebook={handleSignInWithFacebook}
        handleFormSwitch={handleFormSwitch}
      />
    </div>
  );
};

export default Auth;

// Modify the GoogleAndFacebookDiv to accept props
const GoogleAndFacebookDiv = ({
  handleSingInWithGoogle,
  handleSingInWithFacebook,
}: {
  handleSingInWithGoogle: () => void;
  handleSingInWithFacebook: () => void;
  handleFormSwitch: (form: "signup" | "login" | "forgotPassword") => void;
}) => {
  return (
    <div className="mt-4">
      <p className="text-center font-bold my-4">---------- OR ---------</p>
      <button
        onClick={handleSingInWithGoogle}
        className="bg-[#4285F4] text-white text-sm font-semibold p-2 rounded w-full flex items-center justify-center hover:bg-[#357ae8] transition-all mb-3"
      >
        <p>Continue with Google</p>
      </button>

      <button
        onClick={handleSingInWithFacebook}
        className="bg-[#3b5999] mb-3 text-white text-sm font-semibold p-2 rounded w-full flex items-center justify-center space-x-1"
      >
        <p>Continue with Facebook</p>
      </button>
    </div>
  );
};

const tailwindClass =
  "appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm";
const commonClass =
  "w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500";
const openedEyeICon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="42"
    height="42"
    viewBox="0 0 24 24"
  >
    <path
      fill="currentColor"
      d="M6.23 22H3.617q-.691 0-1.153-.462T2 20.385v-2.616h1v2.616q0 .269.173.442t.443.173H6.23zm11.54 0v-1h2.615q.269 0 .442-.173t.173-.442v-2.616h1v2.616q0 .69-.462 1.152T20.385 22zM12 17.73q-2.673 0-4.803-1.514Q5.067 14.7 3.981 12q1.086-2.7 3.216-4.216Q9.327 6.27 12 6.27t4.803 1.515T20.019 12q-1.086 2.7-3.216 4.216Q14.673 17.73 12 17.73m0-1q2.277 0 4.083-1.239T18.92 12q-1.032-2.254-2.838-3.492T12 7.269T7.917 8.508T5.08 12q1.033 2.254 2.838 3.492T12 16.731m0-1.866q1.2 0 2.033-.832T14.866 12t-.833-2.033T12 9.135t-2.033.832T9.135 12t.832 2.033t2.033.833m0-1q-.779 0-1.322-.544q-.543-.543-.543-1.322t.543-1.322T12 10.135t1.322.543q.544.543.544 1.322t-.544 1.322q-.543.544-1.322.544M2 6.23V3.616q0-.691.463-1.153T3.616 2H6.23v1H3.616q-.27 0-.443.173T3 3.616V6.23zm19 0V3.616q0-.27-.173-.443T20.385 3h-2.616V2h2.616q.69 0 1.152.463T22 3.616V6.23zM12 12"
    />
  </svg>
);
const closedEyeICon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="42"
    height="42"
    viewBox="0 0 20 20"
  >
    <path
      fill="currentColor"
      d="M2.414 3.121A2.5 2.5 0 0 0 2 4.5v3a.5.5 0 0 0 1 0v-3c0-.232.052-.45.146-.647l3.141 3.141A6.6 6.6 0 0 0 4.392 8.74a5 5 0 0 0-.33.521l-.006.01l-.002.004v.001s-.001.001.446.225l-.447-.224a.5.5 0 0 0 .894.448v-.001l.01-.018l.045-.078a4 4 0 0 1 .2-.303A5.6 5.6 0 0 1 7.02 7.726l1.293 1.293a3 3 0 1 0 4.168 4.168l3.667 3.667A1.5 1.5 0 0 1 15.5 17h-3a.5.5 0 0 0 0 1h3c.51 0 .983-.152 1.379-.414l.267.268a.5.5 0 0 0 .708-.707l-.268-.268l-.732-.732l-3.938-3.938L9.29 8.584L8.007 7.3l-.78-.78l-3.374-3.374l-.732-.732l-.267-.268a.5.5 0 1 0-.708.708zm9.34 9.34A2 2 0 1 1 9.04 9.746zm6.221 3.393Q18 15.68 18 15.5v-3a.5.5 0 0 0-1 0v2.379zM9.17 7.048Q9.563 7.001 10 7c1.863 0 3.126.695 3.925 1.38c.402.344.688.688.873.944a4 4 0 0 1 .245.381l.01.018v.002a.5.5 0 0 0 .894-.449v-.002l-.003-.004l-.005-.01l-.018-.033l-.063-.112a5 5 0 0 0-.25-.377a6.5 6.5 0 0 0-1.033-1.118C13.626 6.805 12.138 6 10 6a7.7 7.7 0 0 0-1.695.183zm6.777 2.228l-.058.03l-.387.193zM5.121 3H7.5a.5.5 0 0 0 0-1h-3q-.18 0-.354.025zM4.5 17A1.5 1.5 0 0 1 3 15.5v-3a.5.5 0 0 0-1 0v3A2.5 2.5 0 0 0 4.5 18h3a.5.5 0 0 0 0-1zm11-14A1.5 1.5 0 0 1 17 4.5v3a.5.5 0 0 0 1 0v-3A2.5 2.5 0 0 0 15.5 2h-3a.5.5 0 0 0 0 1z"
    />
  </svg>
);
