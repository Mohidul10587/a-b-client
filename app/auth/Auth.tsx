"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { useData } from "../DataContext";

const Auth = () => {
  const [activeForm, setActiveForm] = useState<
    "signup" | "login" | "forgotPassword"
  >("login");

  const [email, setEmail] = useState(""); // State for email input
  const [submittingState, setSubmittingState] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { settings } = useData();

  const router = useRouter();
  const handleFormSwitch = (form: "signup" | "login" | "forgotPassword") => {
    setActiveForm(form);
  };
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirect") || "/";

  const handleSingInWithGoogle = () => {
    signIn("google", { callbackUrl: redirectUrl });
  };
  const handleSingInWithFacebook = () => {
    signIn("facebook", { callbackUrl: redirectUrl });
  };
  // Handle form submission
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setSubmittingState(true);
    setError(null);

    const trimmedEmail = email.trim(); // Trim the username
    try {
      // Attempt to sign in with credentials
      const res = await signIn("credentials", {
        email: trimmedEmail,
        password,
        callbackUrl: redirectUrl,
      });

      // Handle sign-in response
      if (res?.error) {
        setError("Invalid email or password. Please try again."); // Custom error message
        setSubmittingState(false);
      } else {
        router.push(redirectUrl); // Redirect to the desired page
      }
    } catch (error) {
      console.error("Login Error:", error);
      setError("Something went wrong. Please try again later.");
    } finally {
      setSubmittingState(false);
    }
  };

  const signUpWithEmailPassword = async (e: FormEvent<HTMLFormElement>) => {
    // Replace with your backend URL
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/user/createUserByEmailAndPassword`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: username,
            slug: "my-slug",
            email,
            password,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
      }

      const data = await response.json();
      console.log("this is data", data);
      const res = await signIn("credentials", {
        email: data.user.email,
        password,
        callbackUrl: redirectUrl,
      });
      // Handle sign-in response
      if (res?.error) {
        setError(res.error);
        setSubmittingState(false);
      } else {
        router.push(redirectUrl);
        setSubmittingState(false);
      }
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="p-2 md:p-6 bg-white w-full rounded-xl shadow border">
      <div className="text-gray-700 text-center mb-4">
        <h1 className="text-base font-bold">Welcome to {settings?.country}</h1>
        <p className="text-xs">Log in to manage your account.</p>
      </div>
      <div className="w-full">
        <div className="flex flex-col">
          {/* Email Login Form */}
          {activeForm === "login" && (
            <div className="w-full">
              <form className="space-y-6" onSubmit={handleLogin}>
                <div className="rounded-md shadow-sm">
                  <div className="mb-2">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="text"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError(null);
                      }}
                      className="appearance-none mt-1 rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="email"
                    />
                  </div>
                  <div>
                    <label htmlFor="password">Password</label>
                    <div className="flex items-center mt-1">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          setError(null);
                        }}
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="ml-1"
                      >
                        {showPassword ? (
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
                        ) : (
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
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                <p className="text-red-500 text-sm">{error}</p>
                <div>
                  <button
                    type="submit"
                    disabled={submittingState}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                      submittingState
                        ? "text-gray-300 bg-blue-900"
                        : "text-white bg-blue-600 hover:bg-blue-700"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    Log in
                  </button>
                </div>
              </form>
              <GoogleAndFacebookDiv
                handleSingInWithGoogle={handleSingInWithGoogle}
                handleSingInWithFacebook={handleSingInWithFacebook}
                handleFormSwitch={handleFormSwitch}
                activeForm="login"
              />
            </div>
          )}

          {activeForm === "signup" && (
            <div className="w-full">
              <form
                className="mt-8 space-y-6"
                onSubmit={signUpWithEmailPassword}
              >
                <div className="rounded-md shadow-sm">
                  <div className="mb-2">
                    <label htmlFor="username">Username</label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="appearance-none mt-1 rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Username"
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="email">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="appearance-none mt-1 rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Email"
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="password">Password</label>
                    <div className="flex items-center mt-1">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="Password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        className="ml-1"
                      >
                        {showPassword ? (
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
                        ) : (
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
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <div>
                  <button
                    type="submit"
                    disabled={submittingState}
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                      submittingState
                        ? "text-gray-300 bg-blue-900"
                        : "text-white bg-blue-600 hover:bg-blue-700"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                  >
                    Sign Up
                  </button>
                </div>
              </form>

              <GoogleAndFacebookDiv
                handleSingInWithGoogle={handleSingInWithGoogle}
                handleSingInWithFacebook={handleSingInWithFacebook}
                handleFormSwitch={handleFormSwitch}
                activeForm="signup"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;

// Modify the GoogleAndFacebookDiv to accept props
const GoogleAndFacebookDiv = ({
  handleSingInWithGoogle,
  handleSingInWithFacebook,
  handleFormSwitch,
  activeForm,
}: {
  handleSingInWithGoogle: () => void;
  handleSingInWithFacebook: () => void;
  handleFormSwitch: (form: "signup" | "login" | "forgotPassword") => void;
  activeForm: "signup" | "login" | "forgotPassword";
}) => {
  return (
    <div className="mt-4">
      <div className="my-4 cursor-pointer text-center text-gray-500 hover:text-main">
        {activeForm == "login" && (
          <p onClick={() => handleFormSwitch("signup")}>
            No account ? Create a new account
          </p>
        )}

        {activeForm == "signup" && (
          <p onClick={() => handleFormSwitch("login")}>
            Already have an account? Log In
          </p>
        )}
      </div>
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
