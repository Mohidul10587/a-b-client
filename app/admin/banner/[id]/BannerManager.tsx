// components/BannerManager.tsx
"use client";
import React, { useState, useEffect } from "react";
import { apiUrl } from "@/app/shared/urls";
import { fetchWithTokenRefresh } from "@/app/shared/fetchWithTokenRefresh";
import Modal from "@/app/admin/components/Modal";
import Image from "next/image";

interface Banner {
  img: File | null | string;
  title: string;
  link: string;
}

interface BannerManagerProps {
  bannerId: string;
}

const BannerManager: React.FC<BannerManagerProps> = ({ bannerId }) => {
  const [title, setTitle] = useState("");
  const [banners, setBanners] = useState<Banner[]>([
    { img: null, title: "", link: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const fetchBanner = async (bannerId: string) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetch(
        `${apiUrl}/banner/singleBanner/${bannerId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setTitle(data.title);
      setBanners(
        data.banners.map((bannerInfo: any) => ({
          img: bannerInfo.img,
          title: bannerInfo.title,
          link: bannerInfo.link,
        }))
      );
    } catch (error) {
      console.error("Error fetching banner:", error);
    }
  };

  useEffect(() => {
    fetchBanner(bannerId);
  }, [bannerId]);

  const handleBannerChange = (
    index: number,
    field: keyof Banner,
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
    const token = localStorage.getItem("accessToken");

    if (!title.trim()) {
      setModalMessage("Title is required");
      setIsError(true);
      return;
    }

    if (banners.some((banner) => !banner.img)) {
      setModalMessage(
        "All banners must have an image. Please choose an image for the banner."
      );
      setIsError(true);
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    const bannersInfo: any[] = [];

    banners.forEach((banner) => {
      if (banner.img instanceof File) {
        formData.append("bannerImages", banner.img);
      }
      bannersInfo.push({
        title: banner.title,
        link: banner.link,
        img: banner.img instanceof File ? "" : banner.img,
      });
    });
    formData.append("bannersInfo", JSON.stringify(bannersInfo));

    try {
      const response = await fetchWithTokenRefresh(
        `${apiUrl}/banner/update/${bannerId}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        setIsSuccess(true);
        setModalMessage("Banner updated successfully!");
        // Trigger the success callback
      } else {
        const data = await response.json();
        if (data.errorType === "Home Checkbox") {
          setIsError(true);
          setModalMessage(data.error);
        } else {
          throw new Error("Server error");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      setIsError(true);
      setModalMessage("An error occurred while updating the banner.");
    }
  };

  const closeModal = () => {
    setIsSuccess(false);
    setIsError(false);
  };

  return (
    <div className="container my-4 px-4">
      <div className="container my-4">
        {isLoading && (
          <Modal
            isOpen={isLoading}
            content="Banner updating....."
            onClose={closeModal}
          />
        )}
        {isSuccess && (
          <Modal
            isOpen={isSuccess}
            content="Banner Updated successfully!"
            onClose={closeModal}
          />
        )}
        {isError && (
          <Modal isOpen={isError} content={modalMessage} onClose={closeModal} />
        )}
        <div className="flex flex-col gap-8 ">
          <div className="w-full flex items-center justify-between">
            <div className="mb-4">
              <p>Title</p>
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
              className="bg-main flex w-24 items-center justify-center w-full text-white px-4 py-2 rounded-md"
              onClick={handleSubmit}
            >
              Update
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
    </div>
  );
};

export default BannerManager;
