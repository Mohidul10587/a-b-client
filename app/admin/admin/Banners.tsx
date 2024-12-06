import React, { useState } from "react";
import Image from "next/image";

interface Banner {
  img: string | File;
  title: string;
  link: string;
}

interface BannersProps {
  items: Banner[];
  onChange: (banners: Banner[]) => void;
}

const Banners: React.FC<BannersProps> = ({ items, onChange }) => {
  const [banners, setBanners] = useState<Banner[]>(items);

  const handleBannerChange = (
    index: number,
    field: keyof Banner,
    value: string
  ) => {
    const newBanners = banners.map((banner, i) =>
      i === index ? { ...banner, [field]: value } : banner
    );
    setBanners(newBanners);
    onChange(newBanners);
  };

  const handleImageChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const imgUrl = reader.result as string;
        const newBanners = banners.map((banner, i) =>
          i === index ? { ...banner, img: imgUrl, file } : banner
        );
        setBanners(newBanners);
        onChange(newBanners);
      };
      reader.readAsDataURL(file);
    }
  };

  const addBanner = () => {
    const newBanners = [...banners, { img: "", title: "", link: "" }];
    setBanners(newBanners);
    onChange(newBanners);
  };

  const removeBanner = (index: number) => {
    const newBanners = banners.filter((_, i) => i !== index);
    setBanners(newBanners);
    onChange(newBanners);
  };

  return (
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
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      typeof banner.img === "string"
                        ? banner.img
                        : URL.createObjectURL(banner.img)
                    }
                    width={600}
                    height={600}
                    alt="Banner"
                    unoptimized
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
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Banners;
