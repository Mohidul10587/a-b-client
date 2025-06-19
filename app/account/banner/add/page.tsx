"use client";

import React, { useState } from "react";
import { apiUrl } from "@/app/shared/urls";
import Image from "next/image";
import Modal from "@/app/admin/admin/Modal";

import { useData } from "@/app/DataContext";

interface Banner {
  img: File | null;
  title: string;
  link: string;
}

const IndexPage: React.FC = () => {
  const { user } = useData();
  const [title, setTitle] = useState("");

  const [banners, setBanners] = useState<Banner[]>([
    { img: null, title: "", link: "" },
  ]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleBannerChange = (
    index: number,
    field: keyof (typeof banners)[0],
    value: string | File | null
  ) => {
    setBanners((prevBanners) => {
      const updatedBanners = [...prevBanners];
      updatedBanners[index] = { ...updatedBanners[index], [field]: value };
      return updatedBanners;
    });
  };

  const handleImageChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleBannerChange(index, "img", file);
    }
  };

  const addBanner = () => {
    setBanners((prevBanners) => [
      ...prevBanners,
      { img: null, title: "", link: "" },
    ]);
  };

  const removeBanner = (index: number) => {
    setBanners((prevBanners) => prevBanners.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const showModal = (message: string) => {
      setIsLoading(false);
      setIsError(true);
      setModalMessage(message);
    };
    if (!title.trim()) {
      setModalMessage("Title is required");
      setIsError(true);
      return;
    }

    if (banners.some((banner) => !banner.img)) {
      showModal("All banners must have an image, title, and link");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);

    banners.forEach((banner, index) => {
      if (banner.img) {
        formData.append("bannerImages", banner.img);
      }
    });

    const bannersInfo = banners.map(({ title, link }) => ({ title, link }));
    formData.append("bannersInfo", JSON.stringify(bannersInfo));
    formData.append("sellerSlug", user.slug);

    try {
      const response = await fetch(`${apiUrl}/seller/create`, {
        method: "POST",
        credentials: "include",

        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        setIsSuccess(true);
        setModalMessage("Banner created successfully!");
      } else {
        const data = await response.json();
        if (data.errorType == "Home Checkbox") {
          setIsError(true);
          setModalMessage(data.error);
        } else {
          throw new Error("Server error");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setIsError(true);
      setModalMessage("An error occurred while creating the banner.");
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    setIsSuccess(false);
    setIsError(false);
  };

  return (
    <div className="container my-4">
      {isLoading && (
        <Modal
          isOpen={isLoading}
          content="Banner creating!"
          onClose={closeModal}
        />
      )}
      {isSuccess && (
        <Modal
          isOpen={isSuccess}
          content="Banner created successfully!"
          onClose={closeModal}
        />
      )}
      {isError && (
        <Modal isOpen={isError} content={modalMessage} onClose={closeModal} />
      )}
      <div>
        <div className="w-full flex items-center justify-between">
          <div className="mb-4">
            <p>
              Title<sup className="text-red-700">*</sup>
            </p>
            <input
              type="text"
              placeholder="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="p-2 mt-2 w-full outline-none rounded-md"
            />
          </div>
          <button
            type="submit"
            className="bg-main max-w-24 flex items-center justify-center w-full text-white px-4 py-2 rounded-md"
            onClick={handleSubmit}
          >
            Publish
          </button>
        </div>
        <div>
          <div className="flex items-center justify-between my-4 font-bold">
            <h1>Banner</h1>
            <button
              onClick={addBanner}
              className="bg-main text-white px-4 py-2 rounded"
            >
              Add New
            </button>
          </div>
          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-4">
            {banners.map((banner, index) => (
              <div
                key={index}
                className="bg-white w-full p-2 relative flex space-y-2 flex-col items-center"
              >
                <div className="w-full flex flex-col items-center my-2 relative">
                  <label
                    htmlFor={`photoInput_${index}`}
                    className="cursor-pointer w-full flex items-center justify-center"
                  >
                    {banner.img ? (
                      <Image
                        src={
                          banner.img instanceof File
                            ? URL.createObjectURL(banner.img)
                            : banner.img
                        }
                        width={600}
                        height={600}
                        alt="Banner"
                        className="bg-white p-2 w-min h-auto max-h-40"
                        loading="lazy"
                      />
                    ) : (
                      <div className="p-4 border bg-white w-full">
                        <div className="border-2 border-gray-500 text-gray-500 border-dashed flex flex-col items-center justify-center p-5 w-full">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="50"
                            height="50"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="none"
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 6v12m-6-6h12"
                            />
                          </svg>
                          <p>Click to upload</p>
                        </div>
                      </div>
                    )}
                    <input
                      id={`photoInput_${index}`}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageChange(index, e)}
                    />
                  </label>
                </div>
                <input
                  type="text"
                  value={banner.title}
                  onChange={(e) =>
                    handleBannerChange(index, "title", e.target.value)
                  }
                  className="border w-full p-2 outline-none"
                  placeholder="Title"
                />
                <input
                  type="text"
                  value={banner.link}
                  onChange={(e) =>
                    handleBannerChange(index, "link", e.target.value)
                  }
                  className="border w-full p-2 outline-none"
                  placeholder="Link"
                />
                <button
                  onClick={() => removeBanner(index)}
                  className="text-white p-1 absolute right-2 top-0 bg-red-500/50 hover:bg-red-500"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      d="M19 5L5 19M5 5l14 14"
                      color="currentColor"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IndexPage;
