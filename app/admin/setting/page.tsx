"use client";
import { useEffect, useState } from "react";
import { apiUrl } from "@/app/shared/urls";

import Link from "next/link";

import { ISettings } from "@/types/settings";
import Keywords from "@/components/Keywords";
import Content from "@/components/Content";
import { processContent } from "@/app/shared/processContent";
import Image from "next/image";

import { req } from "@/app/shared/request";

import ImageGallery from "@/components/ImageGallery";
import { useData } from "@/app/DataContext";

const IndexPage: React.FC = () => {
  const { showModal } = useData();
  const [data, setData] = useState<ISettings>({
    _id: "",
    bgColor: "",
    country: "",
    copyright: "",
    currencySymbol: "",
    deliveryMethod1: "",
    deliveryMethod2: "",
    deliveryTime1: "",
    deliveryTime2: "",
    description: "",
    fbImage: "",
    favicon: "",
    highlights: "",
    logo: "",
    loto: "",
    metaDescription: "",
    note: "",
    officeAddress: "",
    order: "",
    orderText: "",
    otherPolicies: "",
    payment: "",
    paymentText1: "",
    paymentText2: "",
    phone: "",
    priceZero: "",
    privacyPolicies: "",
    shippingInside: "",
    shippingOutside: "",
    popUpImgStatus: false,
    popUpImgLink: "",
    popUpImg: "",
    telegram: "",
    termsAndConditions: "",
    websiteTitle: "",
    websiteBgColor: "",
    whatsapp: "",
  });

  const [loading, setLoading] = useState(true);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [imgFor, setImgFor] = useState("");
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const { res, data } = await req(`settings`, "GET", {});
        if (res.ok) {
          
          setData(data.item);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchSettings();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Function to handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const { res, data: resData } = await req(
        `settings/update/${data._id}`,
        "PUT",
        {
          ...data,
          description: processContent(data.description),
          termsAndConditions: processContent(data.termsAndConditions),
          privacyPolicies: processContent(data.privacyPolicies),
          otherPolicies: processContent(data.otherPolicies),
        }
      );
      showModal(resData.message, res.ok ? "success" : "error");
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <>
      {loading ? (
        <p className="text-center">Loading..</p>
      ) : (
        <div className="container p-4">
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <p>Logo</p>
                <Image
                  src={data.logo || "/default.jpg"}
                  width={200}
                  height={150}
                  alt="Image"
                  className="border border-black"
                  onClick={() => {
                    setIsImageModalOpen(true);
                    setImgFor("logo");
                  }}
                />
              </div>
              <div>
                <p>Favicon</p>
                <Image
                  src={data.favicon || "/default.jpg"}
                  width={200}
                  height={150}
                  alt="Image"
                  className="border border-black"
                  onClick={() => {
                    setIsImageModalOpen(true);
                    setImgFor("favicon");
                  }}
                />
              </div>
              <div>
                <p>Loto</p>
                <Image
                  src={data.loto || "/default.jpg"}
                  width={200}
                  height={150}
                  alt="Image"
                  className="border border-black"
                  onClick={() => {
                    setIsImageModalOpen(true);
                    setImgFor("loto");
                  }}
                />
              </div>
              <div>
                <p>Fb Image</p>
                <Image
                  src={data.fbImage || "/default.jpg"}
                  width={200}
                  height={150}
                  alt="Image"
                  className="border border-black"
                  onClick={() => {
                    setIsImageModalOpen(true);
                    setImgFor("fbImage");
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Website Title</p>
                <input
                  type="text"
                  placeholder="title"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  name="websiteTitle"
                  value={data.websiteTitle}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Website BG color</p>
                <input
                  type="color"
                  placeholder="background"
                  className="h-10 px-1 bg-white mt-2 w-full outline-none rounded-md"
                  name="bgColor"
                  value={data.bgColor}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Copyright</p>
                <input
                  type="text"
                  placeholder="Copyright"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  name="copyright"
                  value={data.copyright}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Country</p>
                <input
                  type="text"
                  placeholder="Country"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  name="country"
                  value={data.country}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Currency Symbol</p>
                <input
                  type="text"
                  placeholder="Currency Symbol"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  name="currencySymbol"
                  value={data.currencySymbol}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Price Zero</p>
                <input
                  type="text"
                  placeholder="Price Zero"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  name="priceZero"
                  value={data.priceZero}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Highlights</p>
                <input
                  type="text"
                  placeholder="Highlights"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  name="highlights"
                  value={data.highlights}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Shipping Inside</p>
                <input
                  type="text"
                  placeholder="Shipping Inside"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  name="shippingInside"
                  value={data.shippingInside}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Shipping Outside</p>
                <input
                  type="text"
                  placeholder="Shipping Outside"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  name="shippingOutside"
                  value={data.shippingOutside}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Delivery Method 1</p>
                <input
                  type="text"
                  placeholder="Delivery Method 1"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  name="deliveryMethod1"
                  value={data.deliveryMethod1}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Delivery Time 1</p>
                <input
                  type="text"
                  placeholder="Delivery Time 1"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  name="deliveryTime1"
                  value={data.deliveryTime1}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Delivery Method 2</p>
                <input
                  type="text"
                  placeholder="Delivery Method 2"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  name="deliveryMethod2"
                  value={data.deliveryMethod2}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Delivery Time 2</p>
                <input
                  type="text"
                  placeholder="Delivery Time 2"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  name="deliveryTime2"
                  value={data.deliveryTime2}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Payment</p>
                <input
                  type="text"
                  placeholder="Payment"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  name="payment"
                  value={data.payment}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Payment Text 1</p>
                <input
                  type="text"
                  placeholder="Payment Text 1"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  name="paymentText1"
                  value={data.paymentText1}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Payment Text 2</p>
                <input
                  type="text"
                  placeholder="Payment Text 2"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  name="paymentText2"
                  value={data.paymentText2}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Office Address</p>
                <textarea
                  id=""
                  placeholder="Office Address"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  name="officeAddress"
                  value={data.officeAddress}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Whatsapp</p>
                <input
                  type="number"
                  placeholder="Whatsapp"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  name="whatsapp"
                  value={data.whatsapp}
                  onChange={handleChange}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Phone</p>
                <input
                  type="text"
                  placeholder="Phone"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  name="phone"
                  value={data.phone}
                  onChange={handleChange}
                />
              </div>
              <Keywords data={data} setData={setData} usingFor={"tags"} />
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Telegram</p>
                <input
                  type="text"
                  placeholder="Telegram"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  name="telegram"
                  value={data.telegram}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="container mt-4">
            <div>
              <h2 className="text-xl font-bold mb-4">Meta Description</h2>
              <input
                type="text"
                placeholder="Country"
                className="p-2 mt-2 w-full outline-none rounded-md"
                name="metaDescription"
                value={data.metaDescription}
                onChange={handleChange}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Description</h2>
              <Content
                initialContent={data.description}
                onChange={(val) =>
                  setData((prev) => ({ ...prev, description: val }))
                }
              />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Privacy Policies</h2>
              <Content
                initialContent={data.privacyPolicies}
                onChange={(val) =>
                  setData((prev) => ({ ...prev, privacyPolicies: val }))
                }
              />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
              <Content
                initialContent={data.termsAndConditions}
                onChange={(val) =>
                  setData((prev) => ({ ...prev, termsAndConditions: val }))
                }
              />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Other Policies</h2>
              <Content
                initialContent={data.otherPolicies}
                onChange={(val) =>
                  setData((prev) => ({ ...prev, otherPolicies: val }))
                }
              />
            </div>

            <h2 className="text-xl font-bold mt-4 mb-4">
              <Link href="/admin/up">Click to Update Password </Link>{" "}
            </h2>
            <h2 className="text-xl font-bold mb-4">
              <Link href="/admin/ue">Click to Update Email</Link>{" "}
            </h2>

            <button
              className="bg-blue-500 text-white p-2 rounded mt-4"
              onClick={handleSubmit}
            >
              Save Settings
            </button>
          </div>
          <ImageGallery
            isOpen={isImageModalOpen}
            onClose={() => setIsImageModalOpen(false)}
            img={imgFor}
            data={data}
            setData={setData}
          />
        </div>
      )}
    </>
  );
};

export default IndexPage;
