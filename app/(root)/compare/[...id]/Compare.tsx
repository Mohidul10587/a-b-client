"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Spinner from "../../../../components/Spinner";
import { mixArrays } from "@/app/utils/mergeProductInfo";
import { apiUrl } from "@/app/shared/urls";
import { ISettings } from "@/types/settings";
import { IProduct } from "@/types/product";

interface CompareProps {
  leftSideProduct: IProduct;
  rightSideProduct: IProduct;
  categoryID: string;
  categoryName: string;
  settings: ISettings;
}

const Compare: React.FC<CompareProps> = ({
  leftSideProduct,
  rightSideProduct,
  categoryID,
  categoryName,
  settings,
}) => {
  const [mixedSectionsData, setMixedSectionsData] = useState<any[]>([]);
  const [leftInput, setLeftInput] = useState("");

  const [leftSideProduct_c, setLeftSideProduct] = useState<IProduct | null>(
    leftSideProduct
  );
  const [rightSideProduct_c, setRightSideProduct] = useState<IProduct | null>(
    rightSideProduct
  );

  const [leftSuggestions, setLeftSuggestions] = useState<IProduct[]>([]);
  const [rightInput, setRightInput] = useState("");
  const [rightSuggestions, setRightSuggestions] = useState<IProduct[]>([]);

  const [leftLoading, setLeftLoading] = useState(false);
  const [rightLoading, setRightLoading] = useState(false);

  const [prevLeftProductId, setPrevLeftProductId] = useState<string | null>(
    null
  );
  const [prevRightProductId, setPrevRightProductId] = useState<string | null>(
    null
  );

  const fetchSuggestions = async (
    query: string,
    setSuggestions: any,
    categoryId: string,
    setLoading: any
  ) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${apiUrl}/product/search?title=${query}&categoryId=${categoryId}`
      );
      const suggestions = await response.json();
      setSuggestions(suggestions);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (product: IProduct, setProduct: any) => {
    setProduct(product);
    setLeftSuggestions([]);
    setRightSuggestions([]);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setSuggestions: any,
    setInput: any,
    categoryId: string,
    setLoading: any
  ) => {
    const query = e.target.value;
    setInput(query);

    if (query.length > 0) {
      fetchSuggestions(query, setSuggestions, categoryId, setLoading);
    } else {
      setSuggestions([]);
    }
  };

  useEffect(() => {
    if (
      leftSideProduct_c &&
      rightSideProduct_c &&
      (leftSideProduct_c._id !== prevLeftProductId ||
        rightSideProduct_c._id !== prevRightProductId)
    ) {
      const mixedSections = mixArrays(
        leftSideProduct_c.infoSectionsData,
        rightSideProduct_c.infoSectionsData
      );
      setMixedSectionsData(mixedSections);

      // Save the comparison to the database only when both product IDs change
      if (
        leftSideProduct_c._id !== prevLeftProductId &&
        rightSideProduct_c._id !== prevRightProductId
      ) {
        saveComparison(leftSideProduct_c, rightSideProduct_c);
        setPrevLeftProductId(leftSideProduct_c._id);
        setPrevRightProductId(rightSideProduct_c._id);
      }
    }
  }, [
    leftSideProduct_c,
    rightSideProduct_c,
    prevLeftProductId,
    prevRightProductId,
  ]);
  console.log(leftSideProduct_c);
  return (
    <div>
      {" "}
      <div className="container mb-4">
        <ol className="hidden lg:flex items-center mb-1.5 pt-1.5 pb-0 px-4 flex-wrap gap-4 gap-y-1 bg-white rounded-b-md text-sm shadow-sm">
          <li>
            <Link
              href="/"
              className="hover:text-gray-600 bg-gray-200 px-3 py-1 rounded max-w-sm inline-block truncate nuxt-link-active"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/compare"
              className="hover:text-gray-600 bg-gray-200 px-3 py-1 rounded max-w-sm inline-block truncate"
            >
              Compare
            </Link>
          </li>
          <li>
            <Link
              href={`/cat/${leftSideProduct_c?.category.slug}`}
              className="hover:text-gray-600 bg-gray-200 px-3 py-1 rounded max-w-sm inline-block truncate"
            >
              {categoryName}
            </Link>
          </li>
        </ol>
      </div>
      <div className="container my-4">
        <div className="bg-white p-2 py-6 border rounded-md">
          <div className="border-b px-2 py-1.5 grid grid-cols-10 gap-1 bg-white text-gray-800">
            <div className="col-span-full md:col-span-2" />
            <div className="col-span-5 md:col-span-4 flex flex-col items-start justify-center space-y-1 p-1">
              {leftSideProduct_c && (
                <Link
                  href={`/${leftSideProduct_c._id}`}
                  title={leftSideProduct_c.title}
                  className="grid grid-cols-1 md:grid-cols-2 items-center"
                >
                  <div className="w-full relative md:h-48 p-2 h-40 flex items-center justify-center">
                    <Image
                      src={leftSideProduct_c.photo}
                      width={200}
                      height={200}
                      alt="Product Image"
                      className="h-full w-min object-cover cursor-pointer hover:opacity-80"
                    />
                  </div>
                  <p className="line-clamp-2 text-sm text-gray-600">
                    <span className="text-green-500">In Stock</span>
                    <br />
                    {settings.currencySymbol} {leftSideProduct_c.price}
                  </p>
                </Link>
              )}
              <div className="relative">
                <div className="w-full px-2 py-1 rounded-md max-w-sm flex items-center border text-gray-700 text-sm shadow-md relative">
                  <input
                    type="text"
                    placeholder="Search Product l"
                    className="p-2 h-8 w-full rounded-md outline-none"
                    value={leftInput}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        setLeftSuggestions,
                        setLeftInput,
                        categoryID,
                        setLeftLoading
                      )
                    }
                  />
                  {leftLoading ? (
                    <div>
                      <Spinner />
                    </div>
                  ) : (
                    <button type="button" className="p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          d="m14.5 14.5l-4-4m-4 2a6 6 0 1 1 0-12a6 6 0 0 1 0 12Z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {leftSuggestions.length > 0 && (
                  <ul className="absolute top-10 bg-white border border-black rounded-md mt-1 w-full max-w-sm z-10 shadow-md">
                    {leftSuggestions.map((product) => (
                      <li
                        key={product._id}
                        onClick={() =>
                          handleSuggestionClick(product, setLeftSideProduct)
                        }
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex  items-center gap-x-2">
                          <Image
                            src={product.photo}
                            width={20}
                            height={20}
                            alt="Product Image"
                            className="h-full w-min cursor-pointer hover:opacity-80"
                          />

                          <div>
                            <p>{product.title}</p>
                            <p>
                              {settings.currencySymbol} {product.price}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            <div className="col-span-5 md:col-span-4 flex flex-col items-start justify-center space-y-1 p-1">
              {rightSideProduct_c && (
                <Link
                  href={`/${rightSideProduct_c._id}`}
                  title={rightSideProduct_c.title}
                  className="grid grid-cols-1 md:grid-cols-2 items-center"
                >
                  <div className="w-full relative md:h-40 p-2 h-20 flex items-center justify-center">
                    <Image
                      src={rightSideProduct_c.photo}
                      width={200}
                      height={200}
                      alt="Product Image"
                      className="h-full w-min cursor-pointer hover:opacity-80"
                    />
                  </div>
                  <p className="line-clamp-2 text-sm text-gray-600">
                    <span className="text-green-500">In Stock</span>
                    <br />
                    {settings.currencySymbol} {rightSideProduct_c.price}
                  </p>
                </Link>
              )}
              <div className="relative">
                <div className="w-full px-2 py-1 rounded-md max-w-sm flex items-center border text-gray-700 text-sm shadow-md relative">
                  <input
                    type="text"
                    placeholder="Search Product r"
                    className="p-2 h-8 w-full rounded-md outline-none"
                    value={rightInput}
                    onChange={(e) =>
                      handleInputChange(
                        e,
                        setRightSuggestions,
                        setRightInput,
                        categoryID,
                        setRightLoading
                      )
                    }
                  />
                  {rightLoading ? (
                    <div>
                      <Spinner />
                    </div>
                  ) : (
                    <button type="button" className="p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="15"
                        height="15"
                        viewBox="0 0 15 15"
                      >
                        <path
                          fill="none"
                          stroke="currentColor"
                          d="m14.5 14.5l-4-4m-4 2a6 6 0 1 1 0-12a6 6 0 0 1 0 12Z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
                {rightSuggestions.length > 0 && (
                  <ul className="absolute top-10 bg-white border border-black rounded-md mt-1 w-full max-w-sm z-10 shadow-md">
                    {rightSuggestions.map((product) => (
                      <li
                        key={product._id}
                        onClick={() =>
                          handleSuggestionClick(product, setRightSideProduct)
                        }
                        className="p-2 cursor-pointer hover:bg-gray-100"
                      >
                        <div className="flex  items-center gap-x-2">
                          <Image
                            src={product.photo}
                            width={20}
                            height={20}
                            alt="Product Image"
                            className="h-full w-min cursor-pointer hover:opacity-80"
                          />

                          <div>
                            <p>{product.title}</p>
                            <p>$ {product.price}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
          <table className="w-full">
            <thead>
              <tr className="px-2 py-3 grid grid-cols-10 gap-1 bg-white text-gray-700">
                <th
                  scope="col"
                  className="hidden md:block col-span-full md:col-span-2 text-left"
                >
                  Specification
                </th>

                <th
                  scope="col"
                  className="col-span-5 md:col-span-4 text-left truncate"
                >
                  {leftSideProduct_c?.title}
                </th>
                <th
                  scope="col"
                  className="col-span-5 md:col-span-4 text-left truncate"
                >
                  {rightSideProduct_c?.title}
                </th>
              </tr>
              <tr className="px-2 py-3 grid grid-cols-10 gap-1 bg-white text-gray-700">
                <th
                  scope="col"
                  className="hidden md:block col-span-full md:col-span-2 text-left"
                >
                  Price
                </th>
                <th
                  scope="col"
                  className="col-span-5 md:col-span-4 text-left truncate"
                >
                  {settings.currencySymbol} {leftSideProduct_c?.price}
                </th>
                <th
                  scope="col"
                  className="col-span-5 md:col-span-4 text-left truncate"
                >
                  {settings.currencySymbol} {rightSideProduct_c?.price}
                </th>
              </tr>
            </thead>
            <tbody>
              {mixedSectionsData.map((section, index) => (
                <React.Fragment key={index}>
                  <tr className="flex items-start">
                    <th className="uppercase text-base text-main px-2 font-semibold my-1 leading-tight max-w-full">
                      {section.sectionTitle}
                    </th>
                  </tr>
                  {section.fields.map(
                    (field: any, index: React.Key | null | undefined) => (
                      <tr
                        key={index}
                        className="px-2 py-1.5 grid grid-cols-10 gap-1 bg-cool-gray-500"
                      >
                        <th
                          scope="row"
                          className="font-bold col-span-full md:col-span-2 text-gray-700 flex items-start"
                        >
                          {field.fieldTitle}
                        </th>
                        <td className="col-span-5 md:col-span-4">
                          <pre className="mt-2  font-serif break-words break-all whitespace-pre-wrap">
                            {field.content1}
                          </pre>
                        </td>
                        <td className="col-span-5 md:col-span-4">
                          <pre className="mt-2  font-serif break-words break-all whitespace-pre-wrap">
                            {field.content2}
                          </pre>
                        </td>
                      </tr>
                    )
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Compare;

// No effect
const saveComparison = async (
  leftProduct: IProduct,
  rightProduct: IProduct
) => {
  try {
    const response = await fetch(`${apiUrl}/comparison/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        leftProductId: leftProduct._id,
        rightProductId: rightProduct._id,
      }),
    });

    // if (!response.ok) {
    //   throw new Error("Failed to save comparison");
    // }

    const result = await response.json();
  } catch (error) {
    console.error("Error saving comparison:", error);
  }
};
