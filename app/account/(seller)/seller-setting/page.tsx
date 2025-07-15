"use client";

import { apiUrl } from "@/app/shared/urls";
import Modal from "../../account-comp/Modal";
import Email from "@/app/account/account-comp/post/Email";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import Text from "@/app/account/account-comp/post/Text";
import Textarea from "@/app/account/account-comp/post/Textarea";
import Image from "next/image";

import { useEffect, useState } from "react";
import UpdateSlugForm from "./UpdageSlug";
import MetaForm from "./MetaForm";
const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });
const IndexPage: React.FC = () => {
  const [companyName, setCompanyName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [street, setStreet] = useState("");
  const [address, setAddress] = useState("");
  const [facebook, setFacebook] = useState("");
  const [twitter, setTwitter] = useState("");
  const [gmail, setGmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [skype, setSkype] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [openingHours, setOpeningHours] = useState({
    monday: "",
    tuesday: "",
    wednesday: "",
    thursday: "",
    friday: "",
    saturday: "",
    sunday: "",
  });
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );
  const [selectedCoverImage, setSelectedCoverImage] = useState<
    string | undefined
  >(undefined);
  const [photo, setPhoto] = useState<string | File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | File | null>(null);

  const [previousPhoto, serPreviousPhoto] = useState("");
  const [previousCoverPhoto, setPreviousCoverPhoto] = useState("");

  const openModal = (content: string) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  useEffect(() => {
    const sellerId = localStorage.getItem("myId") as string;
    const fetchSellerData = async (sellerId: string) => {
      try {
        const response = await fetch(`${apiUrl}/seller/seller/${sellerId}`, {
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        const { data } = await response.json(); // Assuming the response has a `data` field with seller info

        // Set all state variables with fetched data
        setCompanyName(data.companyName || "");
        setPhone(data.phone || "");
        setEmail(data.email || "");
        setCountry(data.country || "");
        setCity(data.city || "");
        setPostalCode(data.postalCode || "");
        setStreet(data.street || "");
        setAddress(data.address || "");
        setFacebook(data.socialMedia?.facebook || "");
        setTwitter(data.socialMedia?.twitter || "");
        setGmail(data.socialMedia?.gmail || "");
        setWhatsapp(data.socialMedia?.whatsapp || "");
        setSkype(data.socialMedia?.skype || "");
        setLinkedin(data.socialMedia?.linkedin || "");
        setOpeningHours(
          data.openingHours || {
            monday: "",
            tuesday: "",
            wednesday: "",
            thursday: "",
            friday: "",
            saturday: "",
            sunday: "",
          }
        );
        setSelectedImage(data.photo || undefined);
        setSelectedCoverImage(data.coverPhoto || undefined);
        setPhoto(data.photo || null);
        setCoverPhoto(data.coverPhoto || null);
        serPreviousPhoto(data.photo || "");
        setPreviousCoverPhoto(data.coverPhoto || "");
        setContactInfo(data.contactInfo || "");
      } catch (error) {
        console.error("Failed to fetch seller data:", error);
        openModal("Failed to load seller data. Please try again later.");
      }
    };

    fetchSellerData(sellerId);
  }, []);

  const handleSubmit = async () => {
    const sellerId = localStorage.getItem("myId") as string;

    const formData = new FormData();

    formData.append("sellerId", sellerId);
    formData.append("companyName", companyName);
    formData.append("email", email);
    formData.append("phone", phone);

    formData.append("country", country);
    formData.append("city", city);
    formData.append("postalCode", postalCode);
    formData.append("street", street);
    formData.append("address", address);

    // Append social media details
    formData.append("facebook", facebook);
    formData.append("twitter", twitter);
    formData.append("gmail", gmail);
    formData.append("whatsapp", whatsapp);
    formData.append("skype", skype);
    formData.append("linkedin", linkedin);
    formData.append("contactInfo", contactInfo);

    // Append opening hours
    formData.append("openingHours", JSON.stringify(openingHours));
    if (photo) {
      formData.append("photo", photo);
    }
    if (coverPhoto) {
      formData.append("coverPhoto", coverPhoto);
    }

    formData.append("previousPhoto", previousPhoto);
    formData.append("previousCoverPhoto", previousCoverPhoto);

    try {
      const response = await fetch(`${apiUrl}/seller/updateSellerInfo`, {
        method: "POST",
        credentials: "include",
        body: formData, // No need to set Content-Type; fetch will set it automatically for FormData
      });

      const result = await response.json();
      openModal("Data submitted successfully!");
    } catch (error) {
      openModal("Error submitting data!");
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setPhoto(file);
    }
  };
  const handleCoverImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setSelectedCoverImage(URL.createObjectURL(file));
      setCoverPhoto(file);
    }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 container">
      <div className="bg-white">
        <h1 className="p-2 border-b">Images</h1>
        <div className="p-2">
          <div>
            <div className="w-full">
              <p className="flex items-center justify-between">
                <span>Choose Your photo (600x600px)</span>
              </p>
              <div className="flex flex-col items-center my-2 relative">
                <label
                  htmlFor="photoInput"
                  className="cursor-pointer w-full flex items-center justify-center"
                >
                  {selectedImage ? (
                    <Image
                      src={selectedImage}
                      alt="Selected"
                      className="bg-white p-2 max-w-full w-min h-28"
                      height={600}
                      width={600}
                      unoptimized
                    />
                  ) : (
                    <div className="p-4 bg-white w-full">
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
                    id="photoInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
            <div className="w-full">
              <p className="flex items-center justify-between">
                <span>Choose Cover photo (1260x160px)</span>
              </p>
              <div className="flex flex-col items-center my-2 relative">
                <label
                  htmlFor="coverPhotoInput"
                  className="cursor-pointer w-full flex items-center justify-center"
                >
                  {selectedCoverImage ? (
                    <Image
                      src={selectedCoverImage}
                      alt="Selected"
                      className="bg-white p-2 max-w-full w-min h-28"
                      height={1260}
                      width={160}
                      unoptimized
                    />
                  ) : (
                    <div className="p-4 bg-white w-full">
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
                    id="coverPhotoInput"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleCoverImageChange}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <h1 className="p-2 border-b">Company</h1>
        <div className="p-2">
          <Text
            value={companyName}
            setValue={setCompanyName}
            title="Company Name"
            sub="Enter your full name"
          />
          <Text
            value={phone}
            setValue={setPhone}
            title="Phone Number"
            sub="Enter your number"
          />

          <Email
            value={email}
            setValue={setEmail}
            title="Email"
            sub="Enter your email"
          />
        </div>
      </div>
      <div className="bg-white">
        <h1 className="p-2 border-b">Location</h1>
        <div className="p-2">
          <Text
            value={country}
            setValue={setCountry}
            title="Country"
            sub="Enter your country name"
          />
          <Text
            value={city}
            setValue={setCity}
            title="City"
            sub="Enter your city name"
          />
          <Text
            value={postalCode}
            setValue={setPostalCode}
            title="Postal Code"
            sub="Enter postal code"
          />
          <Text
            value={street}
            setValue={setStreet}
            title="Street"
            sub="Enter your street name"
          />

          <Textarea
            value={address}
            setValue={setAddress}
            title="Address"
            sub="Enter your full address"
          />
        </div>
      </div>
      <div className="bg-white">
        <h1 className="p-2 border-b">Social Media</h1>
        <div className="p-2">
          <Text
            value={facebook}
            setValue={setFacebook}
            title="Facebook"
            sub="Enter your Facebook ID"
          />
          <Text
            value={twitter}
            setValue={setTwitter}
            title="Twitter (X)"
            sub="Enter your Twitter ID"
          />
          <Text
            value={gmail}
            setValue={setGmail}
            title="Gmail"
            sub="Enter your Gmail ID"
          />
          <Text
            value={whatsapp}
            setValue={setWhatsapp}
            title="WhatsApp"
            sub="Enter your WhatsApp number"
          />
          <Text
            value={skype}
            setValue={setSkype}
            title="Skype"
            sub="Enter your Skype ID"
          />
          <Text
            value={linkedin}
            setValue={setLinkedin}
            title="LinkedIn"
            sub="Enter your LinkedIn profile link"
          />
        </div>
      </div>
      <div className="bg-white">
        <h1 className="p-2 border-b">Shop Opening Hours</h1>
        <div className="p-2">
          {Object.keys(openingHours).map((day) => (
            <Text
              key={day}
              value={openingHours[day as keyof typeof openingHours]}
              setValue={(value) =>
                setOpeningHours((prev) => ({ ...prev, [day]: value }))
              }
              title={day.charAt(0).toUpperCase() + day.slice(1)}
              sub="Enter opening hours (e.g., 07:00 - 12:00)"
            />
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Privacy Policies</h2>
        <SunEditor
          setOptions={{
            buttonList: [
              ["undo", "redo"],
              ["font", "fontSize"],
              // ['paragraphStyle', 'blockquote'],
              [
                "bold",
                "underline",
                "italic",
                "strike",
                "subscript",
                "superscript",
              ],
              ["fontColor", "hiliteColor"],
              ["align", "list", "lineHeight"],
              ["outdent", "indent"],

              ["table", "horizontalRule", "link", "image", "video"],

              ["preview", "print"],
              ["removeFormat"],
            ],
            defaultTag: "div",

            showPathLabel: false,
          }}
          defaultValue={contactInfo}
          onChange={(content) => setContactInfo(content)}
        />
      </div>
      <div className="flex">
        <UpdateSlugForm />{" "}
        <div>
          <MetaForm />
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="col-span-full bg-blue-500 text-white py-2 px-4 rounded"
      >
        Submit
      </button>
      <Modal isOpen={modalIsOpen} onClose={closeModal} content={modalContent} />
    </div>
  );
};

export default IndexPage;
