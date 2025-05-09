import { ICategory, ISubcategory } from "@/types/category";
import { apiUrl } from "./urls";

interface ICategoryWithSubcategories extends ICategory {
  subcategories: ISubcategory[];
}

export async function fetchCategories(): Promise<ICategoryWithSubcategories[]> {
  try {
    const response = await fetch(`${apiUrl}/category/allCategoriesForNavBar`);
    if (!response.ok) {
      console.error(
        "Failed to fetch categories:",
        response.status,
        response.statusText
      );
      throw new Error("Failed to fetch categories");
    }
    const data = await response.json();

    return data.respondedData;
  } catch (error) {
    console.error("Error in fetchCategories:", error);
    throw error;
  }
}
export async function getWriters() {
  const writersResponse = await fetch(`${apiUrl}/writer/all`, {
    next: { revalidate: 30 },
  });

  if (!writersResponse.ok) {
    // This will activate the closest `error.js` Error Boundary
    alert("Please check your internet connection");
  }

  const { writers } = await writersResponse.json();

  return writers;
}

export async function getPublishers() {
  const response = await fetch(`${apiUrl}/publishers/allForProductUploadPage`, {
    next: { revalidate: 30 },
  });

  if (!response.ok) {
    // This will activate the closest `error.js` Error Boundary
    alert("Please check your internet connection");
  }

  const { publishers } = await response.json();

  return publishers;
}

export async function fetchData<T>(
  urlEndPoint: string,
  revalidateTime: number = 40
): Promise<FetchDataResponse<T>> {
  try {
    const res = await fetch(`${apiUrl}/${urlEndPoint}`, {
      next: { revalidate: revalidateTime },
    });
    const json = await res.json();

    return json;
  } catch (error) {
    console.error(`Error fetching data from ${urlEndPoint}:`, error);
    return {
      success: false,
      message: "Error fetching data",
      resData: null,
    };
  }
}
