import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiUrl } from "../shared/urls";

export function useMergeLocalProducts(): number | null {
  const { data: session, status } = useSession();
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    if (status !== "authenticated") return;
    const cartData = localStorage.getItem("cartData");
    const products = JSON.parse(cartData as string);

    fetch(`${apiUrl}/cart/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: session.user._id,
        cartItems: products || [],
      }),
    })
      .then((r) => r.json())
      .then((r) => {
        localStorage.removeItem("cartData");

        const totalQuantity = r.cart.cartItems.reduce(
          (total: number, item: any) => total + item.quantity,
          0
        );
        setTotal(totalQuantity);
      })
      .catch(console.error);
  }, [status, session]);

  return total;
}
