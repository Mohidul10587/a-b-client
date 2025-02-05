"use client";
import useSWR from "swr";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { apiUrl } from "@/app/shared/urls";
import { generateSlug } from "@/app/shared/gennerateSlug";
import Content from "../../components/Content";
import Modal from "../../admin/Modal";
import Meta from "@/components/Meta";
import { fetchWithTokenRefresh } from "@/app/shared/fetchWithTokenRefresh";

export interface IBrand {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  rating: number;
  img: File | string;
  video: string;
  metaTitle: string;
  metaDescription: string;
  metaImg: File | string;
  keywords: string[];
}
const IndexPage: React.FC = () => {
  const params = useParams();
  const id = params.id;

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [formData, setFormData] = useState<IBrand>({
    _id: id === "add" ? "" : (id as string),
    title: "",
    slug: "",
    description: "",
    shortDescription: "",
    rating: 3.5,
    img: "",
    video: "",
    metaTitle: "",
    metaDescription: "",
    metaImg: "",
    keywords: [],
  });

  // Fetch initial data using SWR

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${apiUrl}/publishers/singlePublisher/${id}`
      );
      const data = await response.json();
      if (data?.publisher) {
        setFormData(data?.publisher);
      }
    };
    if (id !== "add") {
      fetchData();
    }
  }, [id]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const strippedDescription = formData.description
      .replace(/(<([^>]+)>)/gi, "")
      .trim();
    const finalDescription =
      strippedDescription.length > 0 ? formData.description : "";

    const strippedShortDescription = formData.shortDescription
      .replace(/(<([^>]+)>)/gi, "")
      .trim();
    const finalShortDescription =
      strippedShortDescription.length > 0 ? formData.shortDescription : "";

    const requiredFields = [
      { value: formData.title, message: "Title is required" },
      { value: formData.img, message: "Photo is required" },
    ];

    for (const field of requiredFields) {
      if (!field.value) {
        openModal(field.message);
        return; // Stop submission if a required field is missing
      }
    }

    openModal("Uploading... ");
    const formDataAppend = new FormData();
    formDataAppend.append("_id", formData._id);
    formDataAppend.append("title", formData.title);
    formDataAppend.append("rating", String(formData.rating));
    formDataAppend.append("slug", generateSlug(formData.title));
    formDataAppend.append("description", finalDescription);
    formDataAppend.append("shortDescription", finalShortDescription);
    formDataAppend.append("img", formData.img);
    formDataAppend.append("video", formData.video?.replace(/\s+/g, ""));
    formDataAppend.append("metaTitle", formData.metaTitle);
    formDataAppend.append("metaDescription", formData.metaDescription);
    formDataAppend.append("metaImg", formData.metaImg);
    formDataAppend.append("keywords", formData.keywords.join(","));

    try {
      openModal("Uploading... ");
      let response = await fetchWithTokenRefresh(
        `${apiUrl}/publishers/create`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: formDataAppend,
        }
      );

      if (response.ok) {
        const data = await response.json();

        openModal(data.message);
      } else {
        openModal("Failed to upload");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      openModal("Failed to upload  due to an unexpected error");
    }
  };

  const openModal = (content: string) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <>
      <div className="container my-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-2/3">
            <div className="mb-4">
              <p>Title</p>
              <input
                type="text"
                name="title"
                value={formData?.title || ""}
                onChange={handleInputChange}
                placeholder="Title"
                className="p-2 mt-2 w-full outline-none rounded-md"
              />
            </div>

            <div className="mb-4">
              <p>Description</p>
              <Content
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, description: content }))
                }
                initialContent={formData?.description}
              />
            </div>
            <div className="mb-4">
              <p>Short Description</p>
              <Content
                onChange={(content) =>
                  setFormData((prev) => ({
                    ...prev,
                    shortDescription: content,
                  }))
                }
                initialContent={formData?.shortDescription}
              />
            </div>
            <div className="mb-4">
              <p className="md:w-60">Rating</p>
              <input
                type="number"
                name="rating"
                value={formData?.rating || 0}
                onChange={handleInputChange}
                placeholder="Rating"
                className="p-2 mt-2 w-full outline-none rounded-md"
              />
            </div>
          </div>
          <div className="w-full md:w-1/3">
            <div className="border-2 border-main border-dashed rounded-md p-2 my-8">
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-main flex items-center justify-center w-full text-white px-4 py-2 rounded-md"
              >
                Publish
              </button>
            </div>
            <div className="flex flex-col items-center my-2 relative">
              <label
                htmlFor="photoInput"
                className="cursor-pointer w-full flex items-center justify-center"
              >
                {formData?.img ? (
                  <Image
                    src={
                      formData?.img instanceof File
                        ? URL.createObjectURL(formData?.img)
                        : formData?.img
                    }
                    width={600}
                    height={600}
                    alt="Selected"
                    loading="lazy"
                    className="bg-white p-2 max-w-full h-auto"
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
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFormData({ ...formData, img: file });
                    }
                  }}
                />
              </label>
            </div>
            <div className="mb-4">
              <p>YouTube Video</p>
              <input
                type="text"
                name="video"
                value={formData?.video || ""}
                onChange={handleInputChange}
                placeholder="example: 123,546,879"
                className="p-2 mt-2 border w-full outline-none rounded-md"
              />
            </div>

            {formData && <Meta formData={formData} setFormData={setFormData} />}
          </div>
        </div>
        <Modal
          isOpen={modalIsOpen}
          onClose={closeModal}
          content={modalContent}
        />
      </div>
    </>
  );
};

export default IndexPage;

{
  /* <QnA />  */
}
