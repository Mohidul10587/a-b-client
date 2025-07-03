"use client";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { apiUrl } from "@/app/shared/urls";
import { useData } from "@/app/DataContext";

// Fetcher function for SWR
const fetcher = (url: string) =>
  fetch(url, { credentials: "include" }).then((res) => res.json());

const Wishlist = () => {
  const { settings } = useData();
  // Retrieve the user ID from local storage
  const id =
    typeof window !== "undefined" ? localStorage.getItem("myId") : null;

  // Use SWR to fetch the wishlist data
  const { data, error, mutate } = useSWR(
    id ? `${apiUrl}/wishlist` : null,
    fetcher
  );

  const wishlist = data?.wishlist?.items || [];
  const reversedList = [...wishlist].reverse();

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(
        `${apiUrl}/wishlist/deleteSingle/${productId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );
      const result = await response.json();

      if (result.success) {
        // Optimistically update the cache
        mutate({
          ...data,
          wishlist: {
            ...data.wishlist,
            items: wishlist.filter(
              (item: any) => item.productId._id !== productId
            ),
          },
        });
      }
    } catch (error) {
      console.error("Error deleting product from wishlist:", error);
    }
  };

  const handleClearWishlist = async () => {
    try {
      const response = await fetch(`${apiUrl}/wishlist/deleteAll`, {
        method: "DELETE",
        credentials: "include",
      });
      const result = await response.json();

      if (result.success) {
        // Reset the cache
        mutate({ wishlist: { items: [] } }, false);
      }
    } catch (error) {
      console.error("Error clearing wishlist:", error);
    }
  };

  if (error) return <div>Error loading wishlist.</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div className="container">
      {wishlist.length === 0 ? (
        <p className="text-gray-500">Your wishlist is empty.</p>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Your Wishlist</h1>
            <div>
              <button
                onClick={handleClearWishlist}
                className="bg-main py-1 px-4 rounded-md text-white"
              >
                Clear all
              </button>
            </div>
          </div>
          <div>
            {reversedList.map((item: any) => (
              <div
                key={item.productId._id}
                className="flex items-center justify-between rounded-md bg-white p-2 mb-2"
              >
                <Link
                  href={`/${item.productId.slug}`}
                  className="flex items-center justify-start gap-2"
                >
                  <Image
                    src={item.productId.photo || "/default.jpg"}
                    alt={item.productId.title}
                    width={80}
                    height={80}
                    className="w-14 h-14 object-cover"
                  />
                  <div>
                    <h3 className="text-lg line-clamp-1 text-gray-700">
                      {item.productId.title}
                    </h3>
                    <div className="flex items-center space-x-1">
                      <p className="text-gray-500 font-bold">
                        {settings?.currencySymbol}{" "}
                        {new Intl.NumberFormat().format(
                          item.productId.sellingPrice
                        )}
                      </p>
                      <del className="text-gray-500">
                        {settings?.currencySymbol}{" "}
                        {new Intl.NumberFormat().format(
                          item.productId.regularPrice
                        )}
                      </del>
                    </div>
                  </div>
                </Link>
                <div className="flex items-center md:justify-end justify-center gap-3">
                  <Link href={`/${item.productId.slug}`}>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 32 32"
                    >
                      <path
                        fill="currentColor"
                        d="M.034 16.668C.388 25.179 7.403 32 16 32s15.612-6.821 15.966-15.332A.5.5 0 0 0 32 16.5c0-.036-.013-.067-.02-.1c.003-.134.02-.265.02-.4c0-8.822-7.178-16-16-16S0 7.178 0 16c0 .135.017.266.02.4c-.007.033-.02.064-.02.1c0 .06.015.115.034.168m24.887 6.074a22 22 0 0 0-4.215-1.271c.158-1.453.251-2.962.28-4.47h4.98c-.091 2.054-.456 3.993-1.045 5.741M26.965 17h3.984a14.9 14.9 0 0 1-2.663 7.579a17 17 0 0 0-2.457-1.44c.645-1.869 1.042-3.943 1.136-6.139m-14.576 5.286A23.4 23.4 0 0 1 16 22c1.224 0 2.433.102 3.61.286C18.916 27.621 17.4 31 16 31s-2.916-3.379-3.611-8.714m1.519 8.378c-2.751-.882-5.078-3.471-6.482-6.984a21 21 0 0 1 3.99-1.217c.459 3.496 1.298 6.542 2.492 8.201m-1.634-19.955A24.4 24.4 0 0 0 16 11a24.4 24.4 0 0 0 3.726-.291c.172 1.62.274 3.388.274 5.291h-8c0-1.903.102-3.671.274-5.291M19.985 17a49 49 0 0 1-.26 4.291A24.4 24.4 0 0 0 16 21a24.4 24.4 0 0 0-3.726.291a49 49 0 0 1-.26-4.291zm.6 5.463c1.404.282 2.743.692 3.99 1.217c-1.404 3.513-3.731 6.102-6.482 6.984c1.193-1.659 2.032-4.705 2.492-8.201M21 16c0-1.836-.102-3.696-.294-5.47c1.48-.292 2.896-.72 4.215-1.271C25.605 11.288 26 13.574 26 16zm-.415-6.463c-.46-3.496-1.298-6.543-2.493-8.201c2.751.882 5.078 3.471 6.482 6.984a20.8 20.8 0 0 1-3.989 1.217m-.974.177C18.433 9.898 17.224 10 16 10s-2.433-.102-3.611-.286C13.084 4.379 14.6 1 16 1s2.916 3.379 3.611 8.714m-8.196-.177a21 21 0 0 1-3.99-1.217c1.404-3.513 3.731-6.102 6.482-6.984c-1.193 1.659-2.032 4.705-2.492 8.201m-.121.993A51 51 0 0 0 11 16H6c0-2.426.395-4.712 1.079-6.742c1.319.552 2.735.979 4.215 1.272m-.28 6.47c.029 1.508.122 3.017.28 4.471c-1.48.292-2.896.72-4.215 1.271c-.589-1.748-.954-3.687-1.045-5.742zM6.17 23.139a17 17 0 0 0-2.456 1.44A14.9 14.9 0 0 1 1.051 17h3.984c.094 2.196.491 4.27 1.135 6.139M4.313 25.38a16 16 0 0 1 2.207-1.305c1.004 2.485 2.449 4.548 4.186 5.943a15.05 15.05 0 0 1-6.393-4.638m16.981 4.637c1.738-1.394 3.182-3.458 4.186-5.943c.79.384 1.522.826 2.207 1.305a15.03 15.03 0 0 1-6.393 4.638M27 16c0-2.567-.428-4.987-1.17-7.139c.88-.422 1.698-.907 2.457-1.44A14.9 14.9 0 0 1 31 16zm.688-9.38c-.685.479-1.417.921-2.207 1.305c-1.004-2.485-2.449-4.549-4.186-5.943a15.06 15.06 0 0 1 6.393 4.638M10.706 1.983C8.968 3.377 7.524 5.441 6.52 7.926A16 16 0 0 1 4.313 6.62a15.04 15.04 0 0 1 6.393-4.637M3.714 7.421a17 17 0 0 0 2.456 1.44A22 22 0 0 0 5 16H1c0-3.19 1.009-6.145 2.714-8.579"
                      />
                    </svg>
                  </Link>
                  <button
                    onClick={() => handleDeleteProduct(item.productId._id)}
                  >
                    <svg
                      className="text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      width="35"
                      height="35"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="currentColor"
                        d="M7.616 20q-.672 0-1.144-.472T6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.153T16.384 20zM17 6H7v12.385q0 .269.173.442t.443.173h8.769q.23 0 .423-.192t.192-.424zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z"
                      ></path>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Wishlist;
