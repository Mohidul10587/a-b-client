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

const Cart = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [availableQuantity, setAvailableQuantity] = useState(0);
  const { setNumberOfCartProducts, user, sessionStatus, settings } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("onCache");
  const [cart, setCart] = useState<any[]>([]);
  setTimeout(() => setMessage(""), 5000);
  const { totalPrice, totalShippingInside } = calculateCartTotals(cart);

  const {
    data: userResponse,
    error: userError,
    mutate: userMutate,
  } = useSWR(
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
  console.log(cart);
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

  const checkedProducts = cart.filter((item) => item.isChecked === true);

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
      <div className="container my-4 max-w-6xl px-2 bg-white flex">
        <div className="w-8/12">
          <div className="flex items-center space-x-1 text-xs mb-2">
            <Link href="/" className="">
              Home
            </Link>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="8"
              height="8"
              viewBox="0 0 1024 1024"
            >
              <path
                fill="currentColor"
                d="M271.653 1023.192c-8.685 0-17.573-3.432-24.238-10.097c-13.33-13.33-13.33-35.144 0-48.474L703.67 508.163L254.08 58.573c-13.33-13.331-13.33-35.145 0-48.475s35.143-13.33 48.473 0L776.38 483.925c13.33 13.33 13.33 35.143 0 48.473l-480.492 480.694c-6.665 6.665-15.551 10.099-24.236 10.099z"
              />
            </svg>
            <Link href="/cart" className="">
              Cart
            </Link>
          </div>

          <p className="text-center">{message}</p>
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  viewBox="0 0 1024 1024"
                  width="100"
                  height="100"
                  fill="#aaaaaa"
                  aria-hidden="true"
                >
                  <path d="M356.7 726.2c-30.6 0-55.5 24.8-55.5 55.5 0 30.6 24.8 55.5 55.5 55.4 30.6 0 55.5-24.8 55.5-55.4 0-30.6-24.8-55.5-55.5-55.5z m0 17.1c21.2 0 38.4 17.2 38.4 38.4 0 21.2-17.2 38.4-38.4 38.4-21.2 0-38.4-17.2-38.4-38.4 0-21.2 17.2-38.4 38.4-38.4z m319.1-17.1c-30.6 0-55.5 24.8-55.4 55.5 0 30.6 24.8 55.5 55.4 55.4 30.6 0 55.5-24.8 55.5-55.4 0-30.6-24.8-55.5-55.5-55.5z m0 17.1c21.2 0 38.4 17.2 38.4 38.4 0 21.2-17.2 38.4-38.4 38.4-21.2 0-38.4-17.2-38.4-38.4 0-21.2 17.2-38.4 38.4-38.4z m-552.8-486.9c4.8 0 9.3 0.3 15.4 1.4 9.3 1.6 18.4 4.6 27 9.4 15.4 8.6 27.5 22 35 40.7l1 2.9 0.4 1.3 8.3 45.7 11.1 63.9 24.8 144.8 7.2 42.8c6.1 34.3 38 60 76 61l2.4 0 358.2 0c38.4 0 71-25.1 78.1-59.4l0.4-2.1 50.1-248.1c0.9-4.6 5.4-7.6 10.1-6.7 4.3 0.9 7.2 4.8 6.8 9.1l-0.1 1-50.2 247.8c-7.4 42.8-46.6 74.3-92.7 75.4l-2.5 0.1-358.2 0c-47.1 0-87.5-31.7-95.2-75.2l-24.4-143.5-15.4-88.8-9-50.4-2.4-13.5-0.9-2.2c-5.6-13.9-14.2-23.7-25-30.4l-2.2-1.3c-6.8-3.8-14.2-6.2-21.7-7.5-4.1-0.7-7.3-1-10.4-1.1l-2 0-87.9 0c-4.7 0-8.5-3.8-8.6-8.5 0-4.4 3.3-8 7.6-8.5l1-0.1 87.9 0z m283.6 265.2l0 17.1-58 0 0-17.1 58 0z m92.2 0l0 17.1-58.1 0 0-17.1 58.1 0z m92.1 0l0 17.1-58 0 0-17.1 58 0z m92.2 0l0 17.1-58 0 0-17.1 58 0z m-329.8-155.8l0 17.1-58 0 0-17.1 58 0z m92.2 0l0 17.1-58 0 0-17.1 58 0z m92.1 0l0 17.1-58 0 0-17.1 58 0z m92.2 0l0 17.1-58 0 0-17.1 58 0z m92.2 0l0 17.1-58.1 0 0-17.1 58.1 0z"></path>
                </svg>
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
            <>
              <div className="block border divide-y">
                {cart.map((item, index) => (
                  <div key={index}>
                    <div className="flex border-b border-gray-300 p-4 items-center">
                      {/* Product Image */}
                      <input
                        type="checkbox"
                        name=""
                        checked={item.isChecked}
                        onChange={(e) =>
                          updateProductCheckedStatus(
                            item.variantId,
                            e.target.checked
                          )
                        }
                        className="w-5 h-5 accent-gray-700 rounded-full border-2 border-gray-700 mr-4"
                        id=""
                      />
                      <div className="w-20 h-28 relative flex-shrink-0">
                        <Image
                          src={item.img}
                          alt={item.title}
                          layout="fill"
                          objectFit="cover"
                          className="rounded"
                        />
                      </div>

                      {/* item Details */}
                      <div className="ml-4 flex-grow">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.author}</p>
                        <p className="text-red-600 text-sm mt-1">
                          Only {availableQuantity} copies available
                        </p>

                        {/* Actions */}
                        <div className="flex items-center mt-2">
                          <button
                            className="flex items-center text-gray-600 hover:text-red-600"
                            onClick={() => deleteItem(item._id, item.variantId)}
                          >
                            <FaTrashAlt className="mr-1" />
                            Remove
                          </button>
                          <button className="flex items-center text-gray-600 hover:text-red-600 ml-4">
                            <FaHeart className="mr-1" />
                            Wishlist
                          </button>
                        </div>
                      </div>

                      {/* Quantity and Price */}
                      <div className="text-right">
                        <div className="flex items-center mb-2">
                          <button
                            className="px-2 py-1 border border-gray-400"
                            onClick={() => {
                              decreaseQuantity(item._id, item.variantId);
                            }}
                          >
                            -
                          </button>
                          <span className="px-3">{item.quantity}</span>
                          <button
                            className="px-2 py-1 border border-gray-400"
                            onClick={() =>
                              increaseQuantity(
                                item.type,
                                item._id,
                                item.variantId,
                                item.quantity
                              )
                            }
                          >
                            +
                          </button>
                        </div>
                        <p className="font-semibold text-lg">
                          {item.price * item.quantity} Tk.
                        </p>
                        <p className="text-gray-400 line-through text-sm">
                          {item.price * item.quantity} Tk.
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div>
                <Link
                  href={`/checkout`}
                  className="bg-blue-600 my-4 font-bold text-center text-white px-4 py-2 w-full rounded-md block"
                >
                  Proceed to checkout
                </Link>
                <button></button>
              </div>
            </>
          )}
        </div>
        <div className="w-4/12 max-w-sm p-4 bg-white rounded-xl shadow-md border border-gray-200 sticky top-5">
          <h2 className="text-lg font-semibold mb-4">Checkout Summary</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>
                {settings?.currencySymbol} {"  "}
                {totalPrice.toLocaleString("en-BD")}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Online Fee</span>
              <span>
                {" "}
                {settings?.currencySymbol} {"  "}
                {totalShippingInside.toLocaleString("en-BD")}
              </span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <span>
                {" "}
                {settings?.currencySymbol} {"  "}
                {(totalPrice + totalShippingInside).toLocaleString("en-BD")}
              </span>
            </div>
            <div className="flex justify-between font-bold text-gray-900 border-t pt-2">
              <span>Payable Total</span>
              <span>
                {" "}
                {settings?.currencySymbol} {"  "}
                {(totalPrice + totalShippingInside).toLocaleString("en-BD")}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between p-3 bg-yellow-100 border border-yellow-300 rounded-md text-sm text-yellow-800">
            <span>
              You will earn <span className="font-semibold">203</span> points
            </span>
            <span>💰</span>
          </div>

          <div className="mt-5 space-y-3">
            <button className="w-full border border-purple-500 text-purple-600 font-medium py-2 rounded-md hover:bg-purple-50 transition">
              Order as a Gift
            </button>
            <Link
              href={`/checkout`}
              className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              Proceed to Checkout
              <span>→</span>
            </Link>
            <p className="text-xs text-gray-500 text-center mt-2">
              Apply{" "}
              <span className="font-medium text-gray-700">Promo Code</span> or{" "}
              <span className="font-medium text-gray-700">Voucher Code</span> on
              the Shipping Page
            </p>
          </div>
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
      totals.totalPrice += item.price * item.quantity;
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
