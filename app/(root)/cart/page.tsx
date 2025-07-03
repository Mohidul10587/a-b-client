"use client";
import { useData } from "@/app/DataContext";
import Image from "next/image";
import React, { FC } from "react";
import { useEffect, useState } from "react";
import { apiUrl } from "@/app/shared/urls";
import useSWR from "swr";
import { fetcher } from "@/app/shared/fetcher";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { FormEvent } from "react";
import Link from "next/link";
import { getTotalCartCount } from "@/components/AddToCart";
import { FaHeart, FaTrashAlt } from "react-icons/fa";
import { cartIcon, leftIcon } from "./icons";

const Cart = () => {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const { setNumberOfCartProducts, user, sessionStatus, settings } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("onCache");
  const [cart, setCart] = useState<any[]>([]);
  setTimeout(() => setMessage(""), 5000);
  const { totalPrice, totalShippingInside } = calculateCartTotals(cart);

  const { data: userResponse } = useSWR(
    user?._id ? `user/getSingleUserForAddToCartComponent/${user._id}` : null,
    fetcher
  );

  const fetchedUser = userResponse?.respondedData || null;
  const settingsX = {
    transactionFee: true,
    defaultStatusOfOnCache: "Pending",
    defaultStatusOfMobilePay: "Pending",
    defaultStatusOfStripe: "Approved",
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    userId: user._id,
    status:
      (paymentMethod === "onCache" && settingsX.defaultStatusOfOnCache) ||
      (paymentMethod === "mobilePay" && settingsX.defaultStatusOfMobilePay) ||
      (paymentMethod === "stripe" && settingsX.defaultStatusOfStripe),
    paymentMethod: "",
    transactionId: "",
  });

  useEffect(() => {
    if (fetchedUser) {
      setFormData({
        ...formData,
        name: fetchedUser.name,
        email: fetchedUser.email,
        phone: fetchedUser.phone,
        address: fetchedUser.address,
      });
    }
  }, [fetchedUser]);

  const {
    data: cartResponse,
    error: cartError,
    mutate,
  } = useSWR(user?._id ? `cart/getUserCart/${user._id}` : null, fetcher);

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      setCart(cartResponse?.respondedData || []);
    } else {
      const cartData = localStorage.getItem("cartData");
      setCart(cartData ? JSON.parse(cartData) : []);
    }
  }, [cartResponse?.respondedData, sessionStatus, totalShippingInside]);

  const increaseQuantity = async (
    type: string,
    id: string,
    variantId: string,
    itemQuantity: number
  ) => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const response = await fetch(
        `${apiUrl}/product/getExistingQuantity?type=${type}&mainId=${id}&variantId=${variantId}`
      );
      if (!response.ok) {
        console.error("Failed to fetch quantity");
        setIsUpdating(false);
        return;
      }

      const data = await response.json();
      const availableQuantity = data.respondedData;
      setAvailableQuantity(availableQuantity);
      if (availableQuantity <= itemQuantity) {
        setMessage("Not enough stock available");
        setIsUpdating(false);
        return;
      }

      if (user._id && sessionStatus === "authenticated") {
        await updateProductQuantityInDataBase(
          user._id,
          id,
          variantId,
          "increase",
          setNumberOfCartProducts,
          mutate
        );
      } else {
        const updatedCart = cart.map((item) =>
          item._id === id && item.variantId === variantId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        setCart(updatedCart);
        localStorage.setItem("cartData", JSON.stringify(updatedCart));
        setNumberOfCartProducts(getTotalCartCount());
      }
    } catch (error) {
      console.error("Error fetching product quantity:", error);
    } finally {
      setTimeout(() => {
        setIsUpdating(false); // ১ সেকেন্ড পরে আবার allow করবো
      }, 1000);
    }
  };

  const decreaseQuantity = (id: string, variantId: string) => {
    if (user._id && sessionStatus === "authenticated") {
      updateProductQuantityInDataBase(
        user._id,
        id,
        variantId,
        "decrease",
        setNumberOfCartProducts,
        mutate
      );
    } else {
      const updatedCart = cart
        .map((item) =>
          item._id === id && item.variantId === variantId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0); // Remove items with 0 quantity
      setCart(updatedCart);
      localStorage.setItem("cartData", JSON.stringify(updatedCart));
      setNumberOfCartProducts(getTotalCartCount());
    }
  };

  const deleteItem = async (id: string, variantId: string) => {
    if (user._id && sessionStatus === "authenticated") {
      const response = await fetch(`${apiUrl}/cart/removeItemFromCart`, {
        credentials: "include",
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          SameSite: "None",
        },
        body: JSON.stringify({
          userId: user._id,
          productId: id,
          variantId: variantId,
        }),
      });
      if (response.ok) {
        mutate();
      }
    } else {
      const updatedCart = cart.filter(
        (item) => !(item._id === id && item.variantId === variantId)
      );
      setCart(updatedCart);
      localStorage.setItem("cartData", JSON.stringify(updatedCart));
      setNumberOfCartProducts(getTotalCartCount());
    }
  };

  const updateProductCheckedStatus = async (
    variantId: string,
    isChecked: boolean
  ) => {
    if (sessionStatus !== "authenticated") {
      function updateIsChecked() {
        // Get the cart data from localStorage
        let cartItems = JSON.parse(localStorage.getItem("cartData") as string);

        // Update the isChecked property for the matching item
        cartItems = cartItems.map((item: any) =>
          item.variantId === variantId
            ? { ...item, isChecked: isChecked }
            : item
        );
        setCart(cartItems);
        // Save the updated cart back to localStorage
        localStorage.setItem("cartData", JSON.stringify(cartItems));
      }
      updateIsChecked();
    } else {
      try {
        const response = await fetch(`${apiUrl}/cart/update-isChecked`, {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: user._id, variantId, isChecked }),
        });

        const data = await response.json();

        if (response.ok) {
          mutate(); // Refresh data if using SWR
        } else {
          console.error("Failed to update isChecked:", data.message);
        }
      } catch (error) {
        console.error("Error updating isChecked:", error);
      }
    }
  };

  return (
    <div className="">
      <div className="container my-4 max-w-6xl px-2 bg-white">
        <div className="">
          <div className="flex items-center space-x-1 text-xs mb-2">
            <Link href="/" className="">
              Home
            </Link>
            {leftIcon}
            <Link href="/cart" className="">
              Cart
            </Link>
          </div>

          <p className="text-center">{message}</p>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center">
                {cartIcon}
                <div>
                  <p className="text-gray-600">Your shopping cart is empty</p>
                  <span>Add your favorite items in it.</span>
                </div>
              </div>
              {sessionStatus === "authenticated" ? null : (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="py-2 w-60 font-bold text-center my-3 rounded-full text-white bg-orange-600 border-orange-bg-orange-600 border-2"
                >
                  Sign in / Register
                </button>
              )}
              <Link
                href="/"
                className="py-2 w-60 font-bold text-center my-3 rounded-full bg-white text-orange-bg-orange-600 border-orange-bg-orange-600 border-2"
              >
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="md:flex md:justify-between md:gap-8">
              {/* Cart Items */}
              <div className="md:w-8/12 space-y-6">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="border-b border-gray-300 pb-4 last:border-0"
                  >
                    <div className="md:flex md:items-center md:justify-between">
                      {/* Left: checkbox + image + details */}
                      <div className="flex items-center space-x-4">
                        <input
                          type="checkbox"
                          checked={item.isChecked}
                          onChange={(e) =>
                            updateProductCheckedStatus(
                              item.variantId,
                              e.target.checked
                            )
                          }
                          className="w-5 h-5 accent-gray-700 rounded-full border-2 border-gray-700 mt-2 flex-shrink-0"
                          aria-label={`Select ${item.title}`}
                        />

                        <div className="w-20 h-28 relative flex-shrink-0 rounded overflow-hidden shadow-sm">
                          <Image
                            src={item.img}
                            alt={item.title}
                            layout="fill"
                            objectFit="cover"
                            className="rounded"
                          />
                        </div>

                        <div className="flex flex-col">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-500">{item.author}</p>
                          <p className="text-red-600 text-sm mt-1">
                            Only {availableQuantity} copies available
                          </p>

                          <div className="flex space-x-6 mt-3 text-gray-600 text-sm">
                            <button
                              onClick={() =>
                                deleteItem(item._id, item.variantId)
                              }
                              className="flex items-center gap-1 hover:text-red-600 transition"
                            >
                              <FaTrashAlt />
                              Remove
                            </button>
                            <button className="flex items-center gap-1 hover:text-red-600 transition">
                              <FaHeart />
                              Wishlist
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right: Quantity & Price */}
                      <div className="mt-4 md:mt-0 text-right flex md:flex-col justify-center items-center gap-x-2 md:items-end md:space-y-2 min-w-[110px]">
                        <div className="flex items-center border border-gray-300 rounded">
                          <button
                            className="px-3 py-1 text-lg font-semibold hover:bg-gray-100 transition"
                            onClick={() =>
                              decreaseQuantity(item._id, item.variantId)
                            }
                            aria-label="Decrease quantity"
                          >
                            –
                          </button>
                          <span className="px-4 text-lg font-medium">
                            {item.quantity}
                          </span>
                          <button
                            className="px-3 py-1 text-lg font-semibold hover:bg-gray-100 transition"
                            onClick={() =>
                              increaseQuantity(
                                item.type,
                                item._id,
                                item.variantId,
                                item.quantity
                              )
                            }
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-semibold text-lg text-gray-900">
                          {(item.sellingPrice * item.quantity).toLocaleString()}{" "}
                          Tk.
                        </p>
                        <p className="text-gray-400 line-through text-sm">
                          {(item.sellingPrice * item.quantity).toLocaleString()}{" "}
                          Tk.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Checkout Summary */}
              <div className="md:w-4/12 max-w-sm bg-white rounded-xl shadow-md border border-gray-300 p-6 sticky top-5 self-start mt-10 md:mt-0">
                <h2 className="text-xl font-semibold mb-6 text-gray-900">
                  Checkout Summary
                </h2>
                <div className="space-y-4 text-gray-700 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>
                      {settings?.currencySymbol}{" "}
                      {totalPrice.toLocaleString("en-BD")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Online Fee</span>
                    <span>
                      {settings?.currencySymbol}{" "}
                      {totalShippingInside.toLocaleString("en-BD")}
                    </span>
                  </div>
                  <div className="flex justify-between font-medium text-gray-900">
                    <span>Total</span>
                    <span>
                      {settings?.currencySymbol}{" "}
                      {(totalPrice + totalShippingInside).toLocaleString(
                        "en-BD"
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-gray-900 border-t pt-3">
                    <span>Payable Total</span>
                    <span>
                      {settings?.currencySymbol}{" "}
                      {(totalPrice + totalShippingInside).toLocaleString(
                        "en-BD"
                      )}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (sessionStatus === "unauthenticated") {
                      setIsModalOpen(true);
                    } else {
                      router.push("/checkout");
                    }
                  }}
                  className="mt-6 w-full bg-blue-600 hover:bg-blue-700 transition text-white font-semibold py-3 rounded-md flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <span>→</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded shadow-lg w-11/12">
              <h2 className="text-lg font-bold mb-4">Sign In Required</h2>
              <p className="mb-4 text-orange-500">
                You need to sign in to add products to your wishlist. Please log
                in or create an account to continue.
              </p>

              <Auth setIsModalOpen={setIsModalOpen} />
              <div className="flex justify-end space-x-4">
                <button
                  className="bg-gray-300 px-4 py-2 rounded text-gray-800"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;

function calculateCartTotals(cart: any) {
  const checkedProducts = cart.filter((item: any) => item.isChecked === true);

  return checkedProducts.reduce(
    (totals: any, item: any) => {
      totals.totalPrice += item.sellingPrice * item.quantity;
      totals.totalShippingInsideWithOffer += item.shippingInside * 1;
      totals.totalShippingOutsideWithOffer += item.shippingOutside * 1;
      totals.totalShippingInside += item.shippingInside * item.quantity;
      totals.totalShippingOutside += item.shippingOutside * item.quantity;
      return totals;
    },
    {
      totalPrice: 0,
      totalShippingInsideWithOffer: 0,
      totalShippingOutsideWithOffer: 0,
      totalShippingInside: 0,
      totalShippingOutside: 0,
    }
  );
}

const updateProductQuantityInDataBase = async (
  userId: string,
  productId: string,
  variantId: string,
  operationType: "increase" | "decrease",
  setNumberOfCartProducts: any,
  mutate: any
) => {
  try {
    const response = await fetch(
      `${apiUrl}/cart/updateProductQuantityInDataBase`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ userId, productId, variantId, operationType }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to add item to cart");
    }
    const total = data.cart.cartItems.reduce(
      (total: number, item: any) => total + item.quantity,
      0
    );
    mutate();
    setNumberOfCartProducts(total);

    return data;
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
};

const Auth: FC<{ setIsModalOpen: any }> = ({ setIsModalOpen }) => {
  const [activeForm, setActiveForm] = useState<
    "signup" | "login" | "forgotPassword"
  >("login");
  const searchParams = useSearchParams();
  const path = usePathname();

  const redirectUrl = searchParams.get("redirect") || "/";
  const [email, setEmail] = useState(""); // State for email input
  const [submittingState, setSubmittingState] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const handleFormSwitch = (form: "signup" | "login" | "forgotPassword") => {
    setActiveForm(form);
  };

  const handleSingInWithGoogle = () => {
    signIn("google", { redirect: false });
    // setIsModalOpen(false);
  };
  const handleSingInWithFacebook = () => {
    signIn("facebook", { redirect: false });
    setIsModalOpen(false);
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
        callbackUrl: path,
      });

      // Handle sign-in response
      if (res?.error) {
        setError("Invalid email or password. Please try again."); // Custom error message
        setSubmittingState(false);
        setIsModalOpen(false);
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
      const response = await fetch(`${apiUrl}/user/signUpWithEmailPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json", // Optional: Ensure the response format
        },
        body: JSON.stringify({
          name: username,
          slug: "my-slug",
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message);
      }

      const data = await response.json();

      const res = await signIn("credentials", {
        email: data.user.email,
        password,
        callbackUrl: path,
      });
      // Handle sign-in response
      if (res?.error) {
        setError(res.error);
        setSubmittingState(false);
        setIsModalOpen(false);
      } else {
        setSubmittingState(false);
        setIsModalOpen(false);
      }
    } catch (error: any) {
      return { success: false, message: error.message };
    }
  };

  return (
    <div className="p-4 md:p-6 bg-white w-full rounded-xl shadow border">
      <div className="text-gray-700">
        <h1 className="text-base font-bold">Welcome to JQDeals</h1>
        <p className="text-xs">Log in to manage your account.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 w-full">
        <div className="hidden md:flex flex-col items-start space-y-4 text-sm text-gray-700 my-8">
          <div className="flex items-center">
            <Image
              src="/a1.png"
              width={30}
              height={30}
              alt="a1"
              className="mr-2"
            />
            <p>Start posting your own ads.</p>
          </div>
          <div className="flex items-center">
            <Image
              src="/a2.png"
              width={30}
              height={30}
              alt="a1"
              className="mr-2"
            />
            <p>Mark ads as favorite and view them later.</p>
          </div>
          <div className="flex items-center">
            <Image
              src="/a3.png"
              width={30}
              height={30}
              alt="a1"
              className="mr-2"
            />
            <p>View and manage your ads at your convenience.</p>
          </div>
        </div>
        <div className="flex flex-col">
          {/* Email Login Form */}
          {activeForm === "login" && (
            <div className="w-full">
              <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                <div className="rounded-md shadow-sm">
                  <div className="mb-2">
                    <label htmlFor="email">email</label>
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
                      className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="email"
                    />
                  </div>
                  <div>
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
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
                      className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
                      className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Email"
                    />
                  </div>
                  <div className="mb-2">
                    <label htmlFor="password">Password</label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="Password"
                    />
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
      <div className="my-4 cursor-pointer text-center hover:text-green-700">
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
