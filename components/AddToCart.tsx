"use client";

import { useData } from "@/app/DataContext";
import { fetcher } from "@/app/shared/fetcher";
import { apiUrl } from "@/app/shared/urls";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import useSWR from "swr";

export const getTotalCartCount = (): number => {
  if (typeof window !== "undefined") {
    const existingCart = localStorage.getItem("cartData");
    const cart: any[] = existingCart ? JSON.parse(existingCart) : [];
    return cart.reduce((total, item) => total + item.quantity, 0);
  }
  return 0;
};

const AddToCart: FC<{ product: any }> = ({ product }) => {
  console.log(product);
  const router = useRouter();
  const { user, setNumberOfCartProducts, sessionStatus } = useData();
  const [thisProductQuantity, setThisProductQuantity] = useState<number>(0);
  const [existingQuantity, setExistingQuantity] = useState(0);
  const [productsInCart, setProductsInCart] = useState<any[]>([]);

  useEffect(() => {
    // Access localStorage only after component mounts (client-side)
    if (typeof window !== "undefined") {
      const storedCart = localStorage.getItem("cartData");
      setProductsInCart(storedCart ? JSON.parse(storedCart) : []);
    }
  }, []);

  const {
    data: cartResponse,
    error: cartError,
    mutate,
  } = useSWR(user?._id ? `cart/getUserCart/${user._id}` : null, fetcher);

  const {
    data: quantityResponse,
    error: quantityError,
    mutate: quantityMutate,
  } = useSWR(
    `product/getExistingQuantity?type=${product.type}&mainId=${product._id}&variantId=${product.variantId}`,
    fetcher
  );

  useEffect(() => {
    if (quantityResponse) {
      setExistingQuantity(quantityResponse.respondedData);
    }
  }, [quantityResponse]);

  const getThisProductQuantity = (productId: string, variantId: string) => {
    if (sessionStatus === "authenticated") {
      let itemOfCart = {
        quantity: 0,
      };
      itemOfCart = cartResponse?.respondedData.find(
        (i: any) => i._id === productId && i.variantId === variantId
      );
      return itemOfCart?.quantity || 0;
    } else {
      if (typeof window !== "undefined") {
        const existingCart = localStorage.getItem("cartData");
        const cart: any[] = existingCart ? JSON.parse(existingCart) : [];
        let item = {
          quantity: 0,
        };
        item = cart.find(
          (i: any) => i._id === productId && i.variantId === variantId
        );

        return item?.quantity || 0;
      }
    }

    return 0;
  };

  const [isProductExisted, setIsProductExisted] = useState<boolean>(
    !!productsInCart?.find(
      (item: any) =>
        item._id === product._id && item.variantId === product.variantId
    )
  );

  const [isProductExistedInDatabase, setIsProductExistedInDatabase] =
    useState<boolean>(
      !!cartResponse?.respondedData?.find(
        (item: any) =>
          item._id === product._id && item.variantId === product.variantId
      )
    );

  useEffect(() => {
    setThisProductQuantity(
      getThisProductQuantity(product._id, product.variantId)
    );
    setIsProductExisted(
      !!productsInCart?.find(
        (item: any) =>
          item._id === product._id && item.variantId === product.variantId
      )
    );
    setIsProductExistedInDatabase(
      !!cartResponse?.respondedData?.find(
        (item: any) =>
          item._id === product._id && item.variantId === product.variantId
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cartResponse?.respondedData, product, productsInCart]);

  const addToCart = (
    product: any,
    quantity: number,
    setIsProductExistedInDatabase: any,
    setNumberOfCartProducts: any
  ) => {
    if (sessionStatus === "authenticated") {
      addToDataBase(
        user._id as string,
        product,
        setIsProductExistedInDatabase,
        setNumberOfCartProducts,
        mutate,
        quantityMutate,
        product
      );
    } else {
      const existingCart = localStorage.getItem("cartData");
      const cart: any[] = existingCart ? JSON.parse(existingCart) : [];

      const sortedProduct = {
        _id: product._id,
        type: product.type,
        img: product.img,
        variantId: product.variantId,
        price: product.price,
        unprice: product.unprice,
        title: product.title,
        shippingInside: product.shippingInside,
        shippingOutside: product.shippingOutside,
        seller: "67585335633e858a3d323e59",
        // commissionForSeller: product.commissionForSeller,
        commissionForSeller: 500,

        existingQnt: product.existingQnt,
        isChecked: true,
      };
      cart.push({ ...sortedProduct, quantity });

      localStorage.setItem("cartData", JSON.stringify(cart));
      setNumberOfCartProducts(getTotalCartCount());
      setThisProductQuantity(
        getThisProductQuantity(product._id, product.variantId)
      );
      setIsProductExisted(true);
    }
  };

  const increaseQuantity = (id: string, variantId: string) => {
    if (user._id && sessionStatus === "authenticated") {
      updateProductQuantityInDataBase(
        user._id as string,
        id,
        variantId,
        "increase",
        setNumberOfCartProducts,
        setThisProductQuantity,
        getThisProductQuantity,
        mutate
      );
    } else {
      const existingCart = localStorage.getItem("cartData");
      const cart: any[] = existingCart ? JSON.parse(existingCart) : [];
      const updatedCart = cart.map((item) =>
        item._id === id && item.variantId === variantId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );

      localStorage.setItem("cartData", JSON.stringify(updatedCart));
      setNumberOfCartProducts(getTotalCartCount());
      setThisProductQuantity(getThisProductQuantity(id, variantId));
    }
  };

  const decreaseQuantity = (id: string, variantId: string) => {
    if (user._id && sessionStatus === "authenticated") {
      updateProductQuantityInDataBase(
        user._id as string,
        id,
        variantId,
        "decrease",
        setNumberOfCartProducts,
        setThisProductQuantity,
        getThisProductQuantity,
        mutate
      );
    } else {
      const existingCart = localStorage.getItem("cartData");
      const cart: any[] = existingCart ? JSON.parse(existingCart) : [];

      // Filter out products whose quantity would become 0
      const updatedCart = cart
        .map((item) =>
          item._id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0); // Remove items with 0 quantity

      localStorage.setItem("cartData", JSON.stringify(updatedCart));
      setNumberOfCartProducts(getTotalCartCount());
      setThisProductQuantity(getThisProductQuantity(id, variantId));
    }
  };

  const buyNow = () => {
    localStorage.setItem(
      "buyNow",
      JSON.stringify([{ ...product, quantity: 1, seller: product.seller._id }])
    );
    router.push("/buyNow");
  };
  return (
    <div>
      <div className="flex items-center w-full gap-2 p-2 pt-0 ">
        <div className="w-full">
          {isProductExisted || isProductExistedInDatabase ? (
            <div className="flex w-full rounded overflow-hidden items-center">
              <button
                type="button"
                onClick={() => decreaseQuantity(product._id, product.variantId)}
                className="bg-blue-600 text-white md:py-2 px-1 py-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                >
                  <path fill="currentColor" d="M19 12.998H5v-2h14z" />
                </svg>
              </button>
              <p className="w-full text-black text-center md:py-1.5 py-0.5 text-xl border-y">
                {thisProductQuantity}
              </p>
              <button
                disabled={
                  existingQuantity <= thisProductQuantity || product.price < 1
                }
                onClick={() => increaseQuantity(product._id, product.variantId)}
                className="bg-blue-600 text-white md:py-2 py-1 px-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              disabled={existingQuantity < 1 || product.price < 1}
              className="bg-blue-600 w-full font-bold text-center text-white p-1.5 rounded block"
              onClick={() =>
                addToCart(
                  product,
                  1,
                  setIsProductExistedInDatabase,
                  setNumberOfCartProducts
                )
              }
            >
              <div className="flex items-center w-full">
                <svg
                  className="fill-white md:block hidden"
                  xmlns="http://www.w3.org/2000/svg"
                  version="1.1"
                  viewBox="0 0 1024 1024"
                  width="30"
                  height="30"
                >
                  <path d="M373.3 916.1c32.8 0 59.4-26.6 59.5-59.4 0-32.8-26.6-59.4-59.5-59.4-32.8 0-59.4 26.6-59.4 59.4 0 32.8 26.6 59.4 59.4 59.4z m396.2 0c32.8 0 59.4-26.6 59.5-59.4 0-32.8-26.6-59.4-59.5-59.4-32.8 0-59.4 26.6-59.4 59.4 0 32.8 26.6 59.4 59.4 59.4z m-684.2-815.1l90.3 17.4c49.9 9.6 88.7 49.2 97.2 99.4l2.3 13.8 486.2 0c91.4 0 165.5 74.1 165.5 165.5 0 8.8-0.7 17.6-2.1 26.3l-28.9 179.1c-12.6 78.3-80.2 135.8-159.4 135.8l-335.9 0c-80.8 0-149.1-59.7-160-139.6l-43-314.8-0.5-2.3-8.4-49.6c-2.5-15-14.2-26.9-29.1-29.8l-90.3-17.4c-23.1-4.4-38.3-26.8-33.9-49.9 4.4-23.1 26.8-38.3 50-33.9z m676 216l-473.2 0 36.9 270.1c5.2 37.7 37.4 65.9 75.5 65.9l335.9 0c37.4 0 69.3-27.1 75.2-64.1l28.9-179c0.7-4.2 1-8.5 1-12.8 0-44.3-35.9-80.2-80.2-80.1z"></path>
                </svg>
                <div className="w-full text-center text-sm">
                  <p>ADD TO CART</p>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddToCart;

const addToDataBase = async (
  userId: string,
  storedProduct: any,
  setIsProductExistedInDatabase: any,
  setNumberOfCartProducts: any,
  mutate: any,
  quantityMutate: any,
  product: any
) => {
  const cartItem = {
    _id: storedProduct._id,
    type: storedProduct.type,
    img: storedProduct.img,
    variantId: storedProduct.variantId,
    price: storedProduct.price,
    unprice: storedProduct.unprice,
    title: storedProduct.title,
    shippingInside: storedProduct.shippingInside,
    shippingOutside: storedProduct.shippingOutside,
    seller: "67585335633e858a3d323e59",
    // commissionForSeller: storedProduct.commissionForSeller,
    commissionForSeller: 500,
    quantity: 1,
    existingQnt: storedProduct.existingQnt,
    isChecked: true,
  };
  console.log("this is from cart item", cartItem);
  try {
    const response = await fetch(`${apiUrl}/cart/addSingleItemToCart`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        userId,
        cartItem,
        type: product.type,
        mainId: product._id,
        variantId: product.variantId,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      mutate();
      quantityMutate();
    }

    const total = data.cart.cartItems.reduce(
      (total: number, item: any) => total + item.quantity,
      0
    );
    setNumberOfCartProducts(total);
    // Check if the added item exists in the cart

    const isProductInCart = data.cart.cartItems.some(
      (item: any) =>
        item._id === storedProduct._id &&
        item.variantId === storedProduct.variantId
    );

    setIsProductExistedInDatabase(isProductInCart);

    if (!response.ok) {
      throw new Error(data.message || "Failed to add item to cart");
    }

    return data;
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
};

const updateProductQuantityInDataBase = async (
  userId: string,
  productId: string,
  variantId: string,
  operationType: "increase" | "decrease",
  setNumberOfCartProducts: any,
  setThisProductQuantity: any,
  getThisProductQuantity: any,
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
    setThisProductQuantity(getThisProductQuantity(productId, variantId));

    return data;
  } catch (error) {
    console.error("Error adding item to cart:", error);
  }
};
