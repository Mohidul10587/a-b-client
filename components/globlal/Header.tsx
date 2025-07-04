// Header.tsx (Server Component)

import { apiUrl } from "@/app/shared/urls";
import HeaderClient from "./HeaderClient"; // Make sure it's exported properly
export async function getCatsWritersPublishersForNavbar() {
  try {
    const res = await fetch(
      `${apiUrl}/category/getCatsWritersPublishersForNavbar`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch common data");
    }

    const data = await res.json();
    
    return data;
  } catch (err) {
    console.error("getCatsWritersPublishersForNavbar error:", err);
    return {
      categories: [],
      writers: [],
      publishers: [],
    };
  }
}

const Header = async () => {
  const { categories, writers, publishers } =
    await getCatsWritersPublishersForNavbar();
  return (
    <HeaderClient
      categories={categories}
      writers={writers}
      publishers={publishers}
    />
  );
};

export default Header;
