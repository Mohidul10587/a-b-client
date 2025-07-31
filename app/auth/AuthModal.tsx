"use client";

import { useState, type FormEvent } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [activeForm, setActiveForm] = useState<"signup" | "login">("login");
  const [emailOrPhoneOrSlug, setEmailOrPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [submittingState, setSubmittingState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/dashboard";

  const detectIdentifierType = (value: string): "email" | "phone" | "slug" => {
    const trimmed = value.trim();

    // Email check
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (emailRegex.test(trimmed)) return "email";

    // Phone check
    const phoneRegex = /^(\+?\d{1,3}[- ]?)?(\d{8,15})$/;
    if (phoneRegex.test(trimmed.replace(/[-\s]/g, ""))) return "phone";

    // Slug check
    const slugRegex = /^[a-z0-9_-]{3,30}$/i;
    if (slugRegex.test(trimmed)) return "slug";

    return "slug";
  };

  const resetForm = () => {
    setEmailOrPhone("");
    setName("");
    setPassword("");
    setError(null);
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleFormSwitch = (form: typeof activeForm) => {
    setActiveForm(form);
    setError(null);
  };

  const handleSignInWithGoogle = async () => {
    try {
      await signIn("google", {
        callbackUrl: redirectUrl,
        redirect: false,
      });
      handleClose();
    } catch (error) {
      setError("Failed to sign in with Google");
    }
  };

  const handleSignInWithFacebook = () => {
    setError("Facebook login is not available yet.");
  };

  const onLoginSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmittingState(true);
    setError(null);

    try {
      const identifierType = detectIdentifierType(emailOrPhoneOrSlug);

      const signInResult = await signIn("credentials", {
        authProvider: identifierType,
        identifier: emailOrPhoneOrSlug.trim(),
        password,
        operationType: "logIn",
        redirect: false,
      });

      if (signInResult?.error) {
        throw new Error(signInResult.error);
      }

      if (signInResult?.ok) {
        handleClose();
        router.push(redirectUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setSubmittingState(false);
    }
  };

  const onSignupSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmittingState(true);
    setError(null);

    try {
      const identifierType = detectIdentifierType(emailOrPhoneOrSlug);

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
      } else if (res?.ok) {
        handleClose();
        router.push(redirectUrl);
        router.refresh();
      }
    } catch (err) {
      console.error("Signup Error:", err);
      setError("Signup failed. Please try again.");
    } finally {
      setSubmittingState(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-gray-100">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          <h2 className="text-2xl font-bold text-center text-gray-900">
            {activeForm === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-center text-gray-600 mt-2">
            {activeForm === "login"
              ? "Sign in to your account to continue"
              : "Sign up to get started with your account"}
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6">
          <form
            className="space-y-4"
            onSubmit={activeForm === "login" ? onLoginSubmit : onSignupSubmit}
          >
            {activeForm === "signup" && (
              <div className="space-y-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
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
                  placeholder="Enter your full name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="identifier"
                className="block text-sm font-medium text-gray-700"
              >
                Email, Phone, or Username
              </label>
              <input
                id="identifier"
                name="identifier"
                type="text"
                value={emailOrPhoneOrSlug}
                onChange={(e) => {
                  setEmailOrPhone(e.target.value);
                  setError(null);
                }}
                required
                placeholder="Enter your email, phone, or username"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    activeForm === "login" ? "current-password" : "new-password"
                  }
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  required
                  placeholder="Enter your password"
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submittingState}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submittingState && (
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {activeForm === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <div className="text-center">
            <button
              onClick={() =>
                handleFormSwitch(activeForm === "login" ? "signup" : "login")
              }
              className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              {activeForm === "login"
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500 font-medium">
                Or continue with
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleSignInWithGoogle}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={submittingState}
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <button
              type="button"
              onClick={handleSignInWithFacebook}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={submittingState}
            >
              <svg className="w-5 h-5 mr-2" fill="#1877F2" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Continue with Facebook
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
