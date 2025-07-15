import { apiUrl } from "./urls";

export const req = async (
  url: string,
  method: "POST" | "PUT" | "PATCH" | "DELETE" | "GET",
  payload?: any
) => {
  const options: RequestInit = {
    method,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (method !== "DELETE" && method !== "GET" && payload) {
    options.body = JSON.stringify(payload);
  }

  const res = await fetch(`${apiUrl}/${url}`, options);
  const data = await res.json();

  return { res, data };
};
