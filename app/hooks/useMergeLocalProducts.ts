import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiUrl } from "../shared/urls";
import { req } from "../shared/request";

export function useMergeLocalProducts(): number {
  const { data: session, status } = useSession();
  const [total, setTotal] = useState<number>(0);

  useEffect(() => {
    const syncCart = async () => {
      const cartData = localStorage.getItem("cartData");

      // Step 1: Unauthenticated → Count quantity from localStorage only
      if (status !== "authenticated") {
        if (cartData) {
          try {
            const products = JSON.parse(cartData);
            const totalQuantity = products.reduce(
              (sum: number, item: any) => sum + item.quantity,
              0
            );
            setTotal(totalQuantity);
          } catch (error) {
            console.error("Error parsing cartData from localStorage", error);
            setTotal(0);
          }
        } else {
          setTotal(0);
        }
        return;
      }

      // Step 2: Authenticated, but session or user ID missing
      if (!session?.user?._id) {
        
        return;
      }

      // Step 3: Authenticated + cartData exists → merge
      if (cartData) {
        try {
          const products = JSON.parse(cartData);

          const res = await fetch(`${apiUrl}/cart/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: session.user._id,
              cartItems: products || [],
            }),
          });

          const data = await res.json();
          localStorage.removeItem("cartData");

          const totalQuantity = data.cart.cartItems.reduce(
            (sum: number, item: any) => sum + item.quantity,
            0
          );
          setTotal(totalQuantity);
        } catch (error) {
          console.error("Error merging cart with server", error);
        }
      }

      // Step 4: Authenticated but no local cart → just load from server
      else {
        try {
          const { res, data } = await req(
            `cart/getUserCartQuantity/${session.user._id}`,
            "GET",
            {}
          );
          setTotal(data.totalQuantityInTheCart);
        } catch (error) {
          console.error("Error fetching cart from server", error);
        }
      }
    };

    syncCart();
  }, [status, session]);

  return total;
}
