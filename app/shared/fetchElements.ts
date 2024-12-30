import { apiUrl } from "./urls";

export async function fetchElement(id: string, pageName: string) {
  const res = await fetch(
    `${apiUrl}/element/elementByIdAndPage/${id}/${pageName}`,
    {
      next: { revalidate: 30 },
    }
  );

  const data = await res.json();
  const element = data.data;
  return element;
}
