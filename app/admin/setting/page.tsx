"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "suneditor/dist/css/suneditor.min.css";
import { apiUrl } from "@/app/shared/urls";
import Photo from "@/app/admin/setting/Photo.settings";
import Modal from "@/components/admin/Modal";

import Link from "next/link";
import Keywords from "@/app/admin/setting/Kewords";
import { processContent } from "@/app/shared/processContent";

// Dynamic import for SunEditor
const SunEditor = dynamic(() => import("suneditor-react"), { ssr: false });

const IndexPage: React.FC = () => {
  const [keywords, setTags] = useState<string[]>([]);
  const [metaValue, setMetaValue] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const [metaDescription, setMetaDescription] = useState("");
  const [description, setDescription] = useState("");
  const [privacyPolicies, setPrivacyPolicies] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [otherPolicies, setOtherPolicies] = useState("");

  const [logo, setLogo] = useState<File | null>(null);
  const [favicon, setFavicon] = useState<File | null>(null);
  const [loto, setLoto] = useState<File | null>(null);
  const [fbImage, setFbImage] = useState<File | null>(null);

  const [title, setTitle] = useState("");
  const [bgColor, setBgColor] = useState("");
  const [copyright, setCopyright] = useState("");
  const [country, setCountry] = useState("");
  const [currencySymbol, setCurrencySymbol] = useState("");
  const [priceZero, setPriceZero] = useState("");
  const [highlights, setHighlights] = useState("");
  const [shippingInside, setShippingInside] = useState("");
  const [shippingOutside, setShippingOutside] = useState("");
  const [deliveryMethod1, setDeliveryMethod1] = useState("");
  const [deliveryTime1, setDeliveryTime1] = useState("");
  const [deliveryMethod2, setDeliveryMethod2] = useState("");
  const [deliveryTime2, setDeliveryTime2] = useState("");
  const [payment, setPayment] = useState("");
  const [paymentText1, setPaymentText1] = useState("");
  const [paymentText2, setPaymentText2] = useState("");
  const [officeAddress, setOfficeAddress] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [telegram, setTelegram] = useState("");
  const [note, setNote] = useState("");
  const [order, setOrder] = useState("");
  const [orderText, setOrderText] = useState("");
  const [phone, setPhone] = useState("");

  const [isInitialized, setIsInitialized] = useState(false); // Ensure state setup only after fetching
  const [isContentValid, setIsContentValid] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `${apiUrl}/settings`,

          {
            method: "GET",
            credentials: "include",
          }
        );
        if (response.ok) {
          const responseData = await response.json();
          setMetaDescription(responseData.metaDescription || "");
          setDescription(responseData.description || "");
          setPrivacyPolicies(responseData.privacyPolicies || "");
          setTermsAndConditions(responseData.termsAndConditions || "");
          setOtherPolicies(responseData.otherPolicies || "");
          setTitle(responseData.websiteTitle || "");
          setBgColor(responseData.bgColor || "");
          setCopyright(responseData.copyright || "");
          setCountry(responseData.country || "");
          setCurrencySymbol(responseData.currencySymbol || "");
          setPriceZero(responseData.priceZero || false);
          setHighlights(responseData.highlights || "");
          setShippingInside(responseData.shippingInside || "");
          setShippingOutside(responseData.shippingOutside || "");
          setDeliveryMethod1(responseData.deliveryMethod1 || "");
          setDeliveryTime1(responseData.deliveryTime1 || "");
          setDeliveryMethod2(responseData.deliveryMethod2 || "");
          setDeliveryTime2(responseData.deliveryTime2 || "");
          setPayment(responseData.payment || "");
          setPaymentText1(responseData.paymentText1 || "");
          setPaymentText2(responseData.paymentText2 || "");
          setOfficeAddress(responseData.officeAddress || "");
          setWhatsapp(responseData.whatsapp || "");
          setTelegram(responseData.telegram || "");
          setNote(responseData.note || "");
          setOrder(responseData.order || "");
          setOrderText(responseData.orderText || "");
          setIsInitialized(true);
          setLogo(responseData.logo || "");
          setLoto(responseData.loto || "");
          setFbImage(responseData.fbImage || "");
          setFavicon(responseData.favicon || "");
          setPhone(responseData.phone || "");
          setTags(responseData.keywords || []);
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };
    fetchSettings();
  }, []);
  const [logoError, setLogoError] = useState("");
  const [faviconError, setFaviconError] = useState("");
  const [lotoError, setLotoError] = useState("");
  const [fbImageError, setFbImageError] = useState("");

  // Function to handle image change
  const handleImageChange = (
    file: File | null,
    setImage: React.Dispatch<React.SetStateAction<File | null>>,
    maxWidth: number,
    maxHeight: number,
    setError: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (file) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (img.width > maxWidth || img.height > maxHeight) {
          setError(
            `Image exceeds maximum allowed dimensions (${maxWidth}x${maxHeight}).`
          );
          setImage(null);
        } else {
          setError("");
          setImage(file);
        }
      };
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: any) => {
    e.preventDefault();

    // Validate required fields and image errors before submission
    if (logoError || faviconError || lotoError || fbImageError) {
      setModalContent("Check the image size.");
      setIsModalOpen(true);
      return;
    }

    // Strip HTML keywords and whitespace from description and set to empty if no text is found

    const formData = new FormData();
    if (logo) formData.append("logo", logo);
    if (favicon) formData.append("favicon", favicon);
    if (loto) formData.append("loto", loto);
    if (fbImage) formData.append("fbImage", fbImage);
    formData.append("websiteTitle", title);
    formData.append("bgColor", bgColor);
    formData.append("copyright", copyright);
    formData.append("country", country);
    formData.append("currencySymbol", currencySymbol);
    formData.append("priceZero", priceZero);
    formData.append("highlights", highlights);
    formData.append("shippingInside", shippingInside);
    formData.append("shippingOutside", shippingOutside);
    formData.append("deliveryMethod1", deliveryMethod1);
    formData.append("deliveryTime1", deliveryTime1);
    formData.append("deliveryMethod2", deliveryMethod2);
    formData.append("deliveryTime2", deliveryTime2);
    formData.append("payment", payment);
    formData.append("paymentText1", paymentText1);
    formData.append("paymentText2", paymentText2);
    formData.append("officeAddress", officeAddress);
    formData.append("whatsapp", whatsapp);
    formData.append("telegram", telegram);
    formData.append("note", note);
    formData.append("order", order);
    formData.append("orderText", orderText);
    formData.append("metaDescription", metaDescription);
    formData.append("description", processContent(description)); // Submit empty string
    formData.append("privacyPolicies", privacyPolicies);
    formData.append("termsAndConditions", termsAndConditions);
    formData.append("otherPolicies", otherPolicies);
    formData.append("phone", phone);
    formData.append("keywords", String(keywords));

    try {
      setModalContent("Updating the settings...");
      setIsModalOpen(true);

      const response = await fetch(`${apiUrl}/settings/update`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        setModalContent("Updated successfully");
        setIsModalOpen(true);
      } else {
        const result = await response.json();
        setModalContent(`Failed to update settings: ${result.message}`);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setModalContent("Error submitting form");
      setIsModalOpen(true);
    }
  };

  return (
    <>
      {loading ? (
        <p className="text-center">Loading..</p>
      ) : (
        <div>
          <div className="container my-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Photo
                  title="Logo (172x35px)"
                  img={
                    logo instanceof File
                      ? URL.createObjectURL(logo)
                      : logo || ""
                  }
                  onImageChange={(file) =>
                    handleImageChange(file, setLogo, 172, 35, setLogoError)
                  }
                  inputId="logoInput"
                />
                {logoError && <p className="text-red-500">{logoError}</p>}
              </div>
              <div>
                <Photo
                  title="Favicon (32x32px)"
                  img={
                    favicon instanceof File
                      ? URL.createObjectURL(favicon)
                      : favicon || ""
                  }
                  onImageChange={(file) =>
                    handleImageChange(file, setFavicon, 32, 32, setFaviconError)
                  }
                  inputId="faviconInput"
                />
                {faviconError && <p className="text-red-500">{faviconError}</p>}
              </div>
              <div>
                <Photo
                  title="Loto (170x35px)"
                  img={
                    loto instanceof File
                      ? URL.createObjectURL(loto)
                      : loto || ""
                  }
                  onImageChange={(file) =>
                    handleImageChange(file, setLoto, 170, 35, setLotoError)
                  }
                  inputId="lotoInput"
                />
                {lotoError && <p className="text-red-500">{lotoError}</p>}
              </div>
              <div>
                <Photo
                  title="FB Meta (1200x630px)"
                  img={
                    fbImage instanceof File
                      ? URL.createObjectURL(fbImage)
                      : fbImage || ""
                  }
                  onImageChange={(file) =>
                    handleImageChange(
                      file,
                      setFbImage,
                      1200,
                      630,
                      setFbImageError
                    )
                  }
                  inputId="fbInput"
                />
                {fbImageError && <p className="text-red-500">{fbImageError}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4">
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Website Title</p>
                <input
                  type="text"
                  placeholder="title"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Website BG color</p>
                <input
                  type="color"
                  placeholder="background"
                  className="h-10 px-1 bg-white mt-2 w-full outline-none rounded-md"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Copyright</p>
                <input
                  type="text"
                  placeholder="Copyright"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={copyright}
                  onChange={(e) => setCopyright(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Country</p>
                <input
                  type="text"
                  placeholder="Country"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Currency Symbol</p>
                <input
                  type="text"
                  placeholder="Currency Symbol"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={currencySymbol}
                  onChange={(e) => setCurrencySymbol(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Price Zero</p>
                <input
                  type="text"
                  placeholder="Price Zero"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={priceZero}
                  onChange={(e) => setPriceZero(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Highlights</p>
                <input
                  type="text"
                  placeholder="Highlights"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={highlights}
                  onChange={(e) => setHighlights(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Shipping Inside</p>
                <input
                  type="text"
                  placeholder="Shipping Inside"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={shippingInside}
                  onChange={(e) => setShippingInside(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Shipping Outside</p>
                <input
                  type="text"
                  placeholder="Shipping Outside"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={shippingOutside}
                  onChange={(e) => setShippingOutside(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Delivery Method 1</p>
                <input
                  type="text"
                  placeholder="Delivery Method 1"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={deliveryMethod1}
                  onChange={(e) => setDeliveryMethod1(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Delivery Time 1</p>
                <input
                  type="text"
                  placeholder="Delivery Time 1"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={deliveryTime1}
                  onChange={(e) => setDeliveryTime1(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Delivery Method 2</p>
                <input
                  type="text"
                  placeholder="Delivery Method 2"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={deliveryMethod2}
                  onChange={(e) => setDeliveryMethod2(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Delivery Time 2</p>
                <input
                  type="text"
                  placeholder="Delivery Time 2"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={deliveryTime2}
                  onChange={(e) => setDeliveryTime2(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Payment</p>
                <input
                  type="text"
                  placeholder="Payment"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={payment}
                  onChange={(e) => setPayment(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Payment Text 1</p>
                <input
                  type="text"
                  placeholder="Payment Text 1"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={paymentText1}
                  onChange={(e) => setPaymentText1(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Payment Text 2</p>
                <input
                  type="text"
                  placeholder="Payment Text 2"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={paymentText2}
                  onChange={(e) => setPaymentText2(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Office Address</p>
                <textarea
                  name=""
                  id=""
                  placeholder="Office Address"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={officeAddress}
                  onChange={(e) => setOfficeAddress(e.target.value)}
                ></textarea>
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Whatsapp</p>
                <input
                  type="number"
                  placeholder="Whatsapp"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Phone</p>
                <input
                  type="text"
                  placeholder="Phone"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <Keywords
                keywords={keywords}
                setTags={setTags}
                metaValue={metaValue}
                setMetaValue={setMetaValue}
              />
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Telegram</p>
                <input
                  type="text"
                  placeholder="Telegram"
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
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
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Description</h2>
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
                defaultValue={description}
                onChange={(content) => setDescription(content)}
              />
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
                defaultValue={privacyPolicies}
                onChange={(content) => setPrivacyPolicies(content)}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Terms and Conditions</h2>
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
                defaultValue={termsAndConditions}
                onChange={(content) => setTermsAndConditions(content)}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">Other Policies</h2>
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
                defaultValue={otherPolicies}
                onChange={(content) => setOtherPolicies(content)}
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

            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              content={modalContent}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default IndexPage;
