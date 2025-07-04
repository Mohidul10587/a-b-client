"use client";
import React, { useState } from "react";

import Image from "next/image";
import Keywords from "@/components/Keywords";
import useSWR from "swr";
import { fetcher } from "@/app/shared/fetcher";
import { apiUrl } from "@/app/shared/urls";
import { processContent } from "@/app/shared/processContent";
import ImageGallery from "@/components/ImageGallery";
import { req } from "@/app/shared/request";
import { useData } from "@/app/DataContext";
import Content from "@/components/Content";

interface Props {
  initialData: any;
  pagePurpose: "add" | "update";
  id?: string; // for edit page
}

const Form: React.FC<Props> = ({ initialData, id, pagePurpose }) => {
  const { settings, showModal } = useData();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");

  const [imageType, setImageType] = useState("");

  const [data, setData] = useState<ISubcategory>(initialData);

  const { data: response, isLoading } = useSWR(
    `category/allCategoriesForSubCatAddPage`,
    fetcher
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!data.title) return showModal("Title is required.");

    const payload = {
      ...data,
      description: processContent(description),
      shortDescription: processContent(shortDescription),
    };

    try {
      const { res, data: resData } = await req(
        `subcategory/${pagePurpose === "add" ? "create" : `update/${id}`}`,
        pagePurpose === "add" ? "POST" : "PUT",
        payload
      );
      showModal(resData.message, res.ok ? "success" : "error");
    } catch {
      showModal("Failed to upload product due to an unexpected error", "error");
    }
  };

  return (
    <>
      <div className="container my-4 p-4">
        <form onSubmit={handleSubmit}>
          {" "}
          <div className="flex flex-col md:flex-row gap-8">
            {" "}
            <div className="w-full md:w-2/3">
              <div className="mb-4">
                <p> Title</p>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  placeholder="Category Name"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                />
              </div>
              <div className="pt-4">
                <p>Select a parent category</p>
                <select
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={data.parentCategory || ""}
                  onChange={(e) =>
                    setData({ ...data, parentCategory: e.target.value })
                  }
                >
                  {" "}
                  <option value="" disabled>
                    Select parent
                  </option>
                  {!isLoading && (
                    <>
                      {response.respondedData?.map((item: any) => (
                        <option key={item._id} value={item._id}>
                          {item.title}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              <div className="mb-4">
                <p>Position</p>
                <input
                  type="number"
                  value={data.position}
                  onChange={(e) =>
                    setData({ ...data, position: Number(e.target.value) })
                  }
                  placeholder="Position"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                />
              </div>

              <div className="mb-4">
                <p>Description</p>
                <Content
                  onChange={(content: string) => {
                    setDescription(content);
                  }}
                  initialContent={description}
                />
              </div>
              <div className="mb-4">
                <p>Short Description</p>
                <Content
                  onChange={(content: string) => {
                    setShortDescription(content);
                  }}
                  initialContent={shortDescription}
                />
              </div>
              <div className="p-4 w-full space-y-4 bg-white mt-4">
                <div>
                  <label htmlFor="titleInput" className="text-gray-700">
                    Meta Title
                  </label>
                  <input
                    id="titleInput"
                    type="text"
                    value={data.metaTitle}
                    onChange={(e) =>
                      setData({ ...data, metaTitle: e.target.value })
                    }
                    placeholder="Enter title"
                    className="mt-1 p-2 w-full border outline-0 rounded-md"
                  />
                </div>

                <div>
                  <label htmlFor="descriptionInput" className="text-gray-700">
                    Meta Description
                  </label>
                  <textarea
                    id="descriptionInput"
                    value={data.metaDescription}
                    onChange={(e) =>
                      setData({ ...data, metaDescription: e.target.value })
                    }
                    placeholder="Enter description"
                    className="mt-1 p-2 w-full border outline-0 rounded-md resize-none"
                    rows={2}
                  />
                </div>
                <div className="w-full md:w-1/3">
                  <p>Meta Image</p>
                  <div>
                    <Image
                      src={data.metaImg || "/default.jpg"}
                      width={200}
                      height={150}
                      alt="Image"
                      className="border border-black "
                      onClick={() => {
                        setIsImageModalOpen(true);
                        setImageType("metaImg");
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="w-1/2">
              <div className="border-2 border-main border-dashed rounded-md p-2 my-8">
                <button
                  type="submit"
                  className="bg-main flex items-center justify-center w-full text-white px-4 py-2 rounded-md"
                >
                  Publish
                </button>
              </div>

              {/* Category image start here */}
              <div className="w-full md:w-1/3">
                <p>Image</p>
                <div>
                  <Image
                    src={data.img || "/default.jpg"}
                    width={200}
                    height={150}
                    alt="Image"
                    className="border border-black "
                    onClick={() => {
                      setIsImageModalOpen(true);
                      setImageType("img");
                    }}
                  />
                </div>
              </div>
              <Keywords data={data} setData={setData} />
            </div>
          </div>{" "}
        </form>

        <ImageGallery
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          img={imageType}
          setData={setData}
          data={data}
        />
      </div>
    </>
  );
};

export default Form;
