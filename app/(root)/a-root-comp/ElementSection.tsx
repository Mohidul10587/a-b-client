import NewBanner from "@/components/NewBanner";
import ProductBox from "./ProductBox";
import { apiUrl } from "@/app/shared/urls";
import Link from "next/link";

interface ElementSectionProps {
  id: string;
  page: string;
}

const ElementSection = async ({ id, page }: ElementSectionProps) => {
  // Fetch elements data on the server side

  const res = await fetch(
    `${apiUrl}/element/elementByIdAndPage/${id}/${page}`,
    {
      cache: "no-cache", // Enable ISR for revalidation after 30 seconds
    }
  );

  const data = await res.json();
  const elementsData = data?.data || [];
  console.log(elementsData);
  return (
    <div className="container my-4">
      {elementsData.map((item: any, index: number) => (
        <div
          key={index}
          className={`mb-4 ${
            item.display === "both"
              ? ""
              : item.margin === "desktop"
              ? "hidden md:block"
              : item.margin === "mobile"
              ? "md:hidden"
              : ""
          }`}
        >
          {item.isTitle && (
            <div
              className={`text-xl p-2 w-full font-medium block rounded-t ${
                item.titleAlignment === "left"
                  ? "text-left flex items-center justify-between"
                  : item.titleAlignment === "right"
                  ? "text-right"
                  : item.titleAlignment === "center"
                  ? "text-center"
                  : ""
              }
              ${
                item.margin === 0
                  ? "mb-0"
                  : item.margin === 1
                  ? "mb-0.5"
                  : item.margin === 2
                  ? "mb-1"
                  : item.margin === 3
                  ? "mb-1.5"
                  : item.margin === 4
                  ? "mb-2"
                  : item.margin === 5
                  ? "mb-2.5"
                  : item.margin === 6
                  ? "mb-3"
                  : item.margin === 7
                  ? "mb-3.5"
                  : item.margin === 8
                  ? "mb-4"
                  : item.margin === 9
                  ? "mb-[18px]"
                  : item.margin === 10
                  ? "mb-5"
                  : ""
              }`}
              style={{
                backgroundColor: item.sectionBackgroundColor || "#000000",
              }}
            >
              <h1
                style={{
                  color: item.titleBackgroundColor || "#ffffff",
                }}
              >
                {item.sectionTitle}
              </h1>
              {item.titleLink && (
                <Link
                  href={item.titleLink}
                  className="text-sm font-normal"
                  style={{
                    color: item.titleBackgroundColor || "#ffffff",
                  }}
                >
                  see more
                </Link>
              )}
            </div>
          )}
          <>
            {item.selectionType === "banner" && (
              <NewBanner elementItem={item} />
            )}
            {item.selectionType === "productSection" && (
              <ProductBox items={item.productOfThisId} elementItem={item} />
            )}
          </>
        </div>
      ))}
    </div>
  );
};

export default ElementSection;
