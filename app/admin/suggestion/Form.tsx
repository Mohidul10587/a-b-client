"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import { IProduct } from "@/types/product";
import { fetcher } from "@/app/shared/fetcher";
import { useData } from "@/app/DataContext";
import { apiUrl } from "@/app/shared/urls";
import { req } from "@/app/shared/request";

interface Props {
  initialData: any;
  pagePurpose: "add" | "update";
  submitText: string;
  id?: string; // for edit page
}

const Form: React.FC<Props> = ({
  initialData,
  submitText,
  id,
  pagePurpose,
}) => {
  const { settings, showModal } = useData();
  const [items, setItems] = useState<IProduct[]>(initialData.products || []);
  const [title, setTitle] = useState(initialData.title || "");
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubCategoryId] = useState("");

  const { data: catData } = useSWR("category/getAllCatWithSubCat", fetcher);

  const selectedCategory = catData?.find((c: any) => c._id === categoryId);
  const subcategories = selectedCategory?.subcategories || [];

  const query = useMemo(() => {
    const url = new URLSearchParams();
    if (categoryId) url.append("category", categoryId);
    if (subcategoryId) url.append("subcategory", subcategoryId);
    return `product/getAllForSeriesAddPage?${url.toString()}`;
  }, [categoryId, subcategoryId]);

  const { data: productData } = useSWR(query, fetcher);
  const products: IProduct[] = productData?.resData || [];

  const filteredProducts = products.filter(
    (p) =>
      p.titleEn.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !items.some((item) => item._id === p._id)
  );

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  useEffect(() => {
    setVisibleCount(10);
  }, [searchTerm]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 100 &&
        !loading &&
        visibleCount < filteredProducts.length
      ) {
        setLoading(true);
        setTimeout(() => {
          setVisibleCount((prev) => prev + 10);
          setLoading(false);
        }, 800);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, visibleCount, filteredProducts.length]);

  const handleAddItem = (product: IProduct) => setItems([...items, product]);
  const handleRemoveItem = (index: number) =>
    setItems(items.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return showModal("Please enter a title", "info");
    if (!items.length)
      return showModal("Please add at least one product", "info");

    const payload = {
      title,
      products: items.map((p) => p._id),
    };

    try {
      const { res, data: resData } = await req(
        `suggestion/${pagePurpose === "add" ? "create" : `update/${id}`}`,
        pagePurpose === "add" ? "POST" : "PUT",
        payload
      );
      showModal(resData.message, res.ok ? "success" : "error");
    } catch {
      showModal("Failed to upload product due to an unexpected error", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="container mx-auto p-4 space-y-8">
      <h2 className="text-2xl font-semibold text-center">{submitText}</h2>

      <input
        type="text"
        placeholder="Enter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-main"
      />

      <button
        type="submit"
        className="bg-main hover:bg-main/90 text-white font-medium p-3 rounded-md w-full transition"
      >
        {submitText}
      </button>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="border p-3 rounded-md bg-white shadow-sm flex flex-col items-center"
          >
            <Link href={`/product/${item.slug}`} className="text-center">
              <Image
                src={item.img || "/default.jpg"}
                alt={item.titleEn}
                width={80}
                height={80}
                className="rounded"
              />
              <p className="mt-2 font-semibold text-sm">{item.titleEn}</p>
              <p className="text-gray-500 text-sm">
                {settings?.currencySymbol}
                {item.sellingPrice}
              </p>
            </Link>
            <button
              type="button"
              onClick={() => handleRemoveItem(index)}
              className="mt-2 text-red-600 border border-red-500 px-3 py-1 rounded text-sm hover:bg-red-50"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full border border-gray-300 rounded-md p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-main"
        placeholder="Search products..."
      />

      <div className="flex flex-col md:flex-row gap-4">
        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setSubCategoryId("");
          }}
          className="p-3 border border-gray-300 rounded-md shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-main"
        >
          <option value="">Select Category</option>
          {catData?.map((cat: any) => (
            <option key={cat._id} value={cat._id}>
              {cat.title}
            </option>
          ))}
        </select>

        <select
          value={subcategoryId}
          onChange={(e) => setSubCategoryId(e.target.value)}
          disabled={!categoryId}
          className="p-3 border border-gray-300 rounded-md shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-main"
        >
          <option value="">Select Subcategory</option>
          {subcategories.map((sub: any) => (
            <option key={sub._id} value={sub._id}>
              {sub.title}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {displayedProducts.map((product) => (
          <div
            key={product._id}
            className="flex items-center justify-between bg-white p-4 rounded-md border shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <Image
                src={product.img || "/default.jpg"}
                alt={product.titleEn}
                width={60}
                height={60}
                className="rounded"
              />
              <div>
                <p className="font-medium">{product.titleEn}</p>
                <p className="text-sm text-gray-500">
                  {settings?.currencySymbol}
                  {product.sellingPrice}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleAddItem(product)}
              className="bg-main hover:bg-main/90 text-white px-4 py-2 rounded text-sm transition"
            >
              Add
            </button>
          </div>
        ))}
        {loading && <p className="text-center text-gray-400">Loading...</p>}
      </div>
    </form>
  );
};

export default Form;
