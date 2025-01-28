import { apiUrl } from "./urls";

export const fetcher = (url: string) =>
  fetch(`${apiUrl}/${url}`, {
    credentials: "include",
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch data");
    return res.json();
  });
