import { apiUrl } from "./urls";

export async function fetchSettings() {
  try {
    const res = await fetch(`${apiUrl}/settings`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch settings data 1: ${res.statusText}`);
    }
    const settings = await res.json();

    return settings;
  } catch (error) {
    console.error("Error fetching settings data:", error);
    return null;
  }
}
