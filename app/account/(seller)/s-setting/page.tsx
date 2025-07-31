"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/app/shared/urls";
import Email from "@/app/account/account-comp/post/Email";
import "suneditor/dist/css/suneditor.min.css";
import Text from "@/app/account/account-comp/post/Text";
import Textarea from "@/app/account/account-comp/post/Textarea";
import Image from "next/image";
import UpdateSlugForm from "./UpdageSlug";
import MetaForm from "./MetaForm";
import { useData } from "@/app/DataContext";
import Content from "@/components/Content";
import { req } from "@/app/shared/request";

const IndexPage: React.FC = () => {
  const { user, showModal } = useData();

  const [selectedImage, setSelectedImage] = useState<string | undefined>();
  const [selectedCoverImage, setSelectedCoverImage] = useState<
    string | undefined
  >();

  const [formData, setFormData] = useState<IUser>({
    _id: "",
    role: "user",
    name: "",
    slug: "",
    isSeller: false,
    isUser: true,
    birthday: "",
    gender: "",
    address: "",
    companyName: "",
    companyEmail: "",
    companyPhone: "",
    facebook: "",
    whatsapp: "",
    coverImg: "",
    lastLoginAt: new Date(),

    // Optional fields can be included as empty or undefined
    username: "",
    email: "",
    phone: "",
    gmail: "",
    password: "",
    image: "",
    img: "",
    display: true,
  });
  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/user/singleForEditForSellerSettings/${user._id}`,
          {
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Failed to load data");

        const data = await response.json();
        
        setFormData(data);
        setSelectedImage(data.photo || undefined);
        setSelectedCoverImage(data.coverPhoto || undefined);
      } catch (error) {
        console.error(error);
        showModal("Failed to load seller data.", "error");
      }
    };

    fetchSellerData();
  }, [user]);

  const handleSubmit = async () => {
    try {
      const { res, data } = await req(
        `user/update/${user._id}`,
        "PUT",
        formData
      );

      showModal(data.message, res.ok ? "success" : "error");
    } catch (error) {
      showModal("Error submitting data!", "error");
    }
  };

  const updateField = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      updateField("photo", file);
    }
  };

  const handleCoverImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedCoverImage(URL.createObjectURL(file));
      updateField("coverPhoto", file);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 container">
      {/* Images */}
      <div className="bg-white">
        <h1 className="p-2 border-b">Images</h1>
        <div className="p-2">
          <label
            htmlFor="photoInput"
            className="cursor-pointer w-full flex justify-center"
          >
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt="photo"
                height={600}
                width={600}
                unoptimized
                className="h-28 w-auto"
              />
            ) : (
              <div className="border-dashed border-2 p-4 text-center w-full text-gray-500">
                Click to upload photo
              </div>
            )}
            <input
              id="photoInput"
              type="file"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>

          <label
            htmlFor="coverPhotoInput"
            className="cursor-pointer w-full flex justify-center mt-4"
          >
            {selectedCoverImage ? (
              <Image
                src={selectedCoverImage}
                alt="cover"
                height={160}
                width={1260}
                unoptimized
                className="h-28 w-auto"
              />
            ) : (
              <div className="border-dashed border-2 p-4 text-center w-full text-gray-500">
                Click to upload cover photo
              </div>
            )}
            <input
              id="coverPhotoInput"
              type="file"
              className="hidden"
              onChange={handleCoverImageChange}
            />
          </label>
        </div>
      </div>

      {/* Company Info */}
      <div className="bg-white">
        <h1 className="p-2 border-b">Company</h1>
        <div className="p-2">
          <Text
            value={formData.companyName || ""}
            setValue={(val) => updateField("companyName", val)}
            title="Company Name"
            sub="Enter your full name"
          />
          <Text
            value={formData.phone || ""}
            setValue={(val) => updateField("phone", val)}
            title="Phone Number"
            sub="Enter your number"
          />
          <Email
            value={formData.email || ""}
            setValue={(val) => updateField("email", val)}
            title="Email"
            sub="Enter your email"
          />
        </div>
      </div>

      {/* Location */}
      <div className="bg-white">
        <h1 className="p-2 border-b">Location</h1>
        <div className="p-2">
          <Textarea
            value={formData.address || ""}
            setValue={(val) => updateField("address", val)}
            title="Address"
            sub="Enter your full address"
          />
        </div>
      </div>

      {/* Social Media */}
      <div className="bg-white">
        <h1 className="p-2 border-b">Social Media</h1>
        <div className="p-2">
          <Text
            value={formData.facebook || ""}
            setValue={(val) => updateField("facebook", val)}
            title="Facebook"
            sub="Enter your Facebook ID"
          />

          <Text
            value={formData.whatsapp || ""}
            setValue={(val) => updateField("whatsapp", val)}
            title="WhatsApp"
            sub="Enter your WhatsApp number"
          />
        </div>
      </div>

      {/* Other */}
      <div>
        <h2 className="text-xl font-bold mb-4">Privacy Policies</h2>
        <Content onChange={(val) => updateField("contactInfo", val)} />
      </div>

      <div className="flex gap-2">
        <UpdateSlugForm />
        <MetaForm />
      </div>

      <button
        onClick={handleSubmit}
        className="col-span-full bg-blue-500 text-white py-2 px-4 rounded"
      >
        Submit
      </button>
    </div>
  );
};

export default IndexPage;
