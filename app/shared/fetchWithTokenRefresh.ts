import { apiUrl } from "./urls";

export const fetchWithTokenRefresh = async (
  url: string,
  options: RequestInit
) => {
  try {
    let response = await fetch(url, options);

    if (response.status === 401) {
      // Attempt to refresh the token
      const tokenResponse = await fetch(`${apiUrl}/admin/refresh-token`, {
        method: "POST",
        credentials: "include", // This ensures cookies are included
      });

      if (tokenResponse.ok) {
        const data = await tokenResponse.json();

        localStorage.setItem("accessToken", data.token);

        // Retry the original request with the new token
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${data.token}`,
        };

        response = await fetch(url, options);
      } else {
        // Handle refresh token failure (e.g., logout or redirect to login)
        console.error("Refresh token failed. Redirecting to login...");
        // Implement your logout logic or redirection here
        throw new Error("Failed to refresh token");
      }
    }

    return response;
  } catch (error) {
    console.error("Error with token refresh logic:", error);
    // Handle the error accordingly, perhaps notify the user
    throw error;
  }
};
