"use client";

import { apiUrl } from "@/app/shared/urls";

import Content from "@/app/admin/components/Content";
import Modal from "@/app/admin/components/Modal";
import Photo from "@/app/admin/components/Photo2";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { ICategory } from "@/types/category";
import Meta from "@/app/admin/components/Meta";
import { IProduct } from "@/types/product";
import { generateSlug } from "@/app/shared/gennerateSlug";

interface Writer {
  _id: string;
  title: string;
  description: string;
  rating: number;
  photo: string;
}

const UpdateProduct: React.FC<{ productId: string }> = ({ productId }) => {
  const [metaTitle, setMetaTitle] = useState("");
  const [metaDescription, setMetaDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(""); // Start with an empty string
  const [tags, setTags] = useState<string[]>([]);
  const [metaValue, setMetaValue] = useState("");
  const [metaImageFile, setMetaImageFile] = useState<File | null>(null);

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const [description, setDescription] = useState("");
  const [shortDescription, setShortDescription] = useState("");

  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategory, setSubcategory] = useState("");

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [sellingPrice, setPrice] = useState(100);
  const [rating, setRating] = useState(100);

  const [regularPrice, setunPrice] = useState(0);
  const [stockStatus, setStockStatus] = useState("In Stock");
  const [writer, setWriter] = useState("");
  const [writerId, setWriterId] = useState("");

  const [featured, setFeatured] = useState("");
  const [sele, setSele] = useState("");
  const [condition, setCondition] = useState("");
  const [warranty, setWarranty] = useState("6 MONTHS");
  const [youtubeVideo, setYoutubeVideo] = useState("");
  const [shippingInside, setShippingInside] = useState(50);
  const [shippingOutside, setShippingOutside] = useState(100);
  const [photo, setPhoto] = useState<File | null>(null);

  const [writers, setWriters] = useState<Writer[]>([]);
  const [product, setProduct] = useState<IProduct | null>(null);

  const openModal = (content: string) => {
    setModalContent(content);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  useEffect(() => {
    const fetchWriters = async () => {
      try {
        const response = await fetch(`${apiUrl}/writer/all`);
        if (response.ok) {
          const data = await response.json();
          setWriters(data.writers);
        } else {
          throw new Error("Failed to fetch writers");
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${apiUrl}/category/all`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories);
        } else {
          throw new Error("Failed to fetch categories");
        }
      } catch (error) {
        console.error(error);
      }
    };

    const fetchProduct = async () => {
      try {
        const response = await fetch(`${apiUrl}/product/${productId}`);
        if (response.ok) {
          const data = await response.json();

          setProduct(data);
          setSelectedImage(data.metaImage);
          setMetaTitle(data.metaTitle);
          setMetaDescription(data.metaDescription);
          setTags(data.tags);
          setTitle(data.title);
          setSlug(data.slug);
          setDescription(data.description);
          setShortDescription(data.shortDescription);
          setCategory(data.category);
          setCategoryId(data.category._id);
          setSubcategory(data.subCategory);
          setPrice(data.sellingPrice);
          setRating(data.rating);

          setunPrice(data.regularPrice);
          setStockStatus(data.stockStatus);
          setWriter(data.writer);
          setWriterId(data.writer._id);
          setFeatured(data.featured);
          setSele(data.sele);
          setCondition(data.condition);
          setWarranty(data.warranty);
          setYoutubeVideo(data.youtubeVideo);
          setShippingInside(data.shippingInside);
          setShippingOutside(data.shippingOutside);
          setPhoto(data.photo);
        } else {
          throw new Error("Failed to fetch product");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchWriters();
    fetchCategories();
    fetchProduct();
  }, [productId]);

  useEffect(() => {}, [subcategory]);
  // Photo gallery functions starts here

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    openModal("Product updating.. ");

    const strippedDescription = description.replace(/(<([^>]+)>)/gi, "").trim();
    const finalDescription = strippedDescription.length > 0 ? description : "";

    const strippedShortDescription = shortDescription
      .replace(/(<([^>]+)>)/gi, "")
      .trim();
    const finalShortDescription =
      strippedShortDescription.length > 0 ? shortDescription : "";

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", generateSlug(title));

    formData.append("description", finalDescription);
    formData.append("shortDescription", finalShortDescription);
    if (photo) {
      formData.append("photo", photo);
    }
    formData.append("category", categoryId);
    formData.append("subCategory", subcategory);
    formData.append("sellingPrice", String(sellingPrice));
    formData.append("rating", String(rating));

    formData.append("regularPrice", String(regularPrice));
    formData.append("stockStatus", stockStatus);
    formData.append("writer", writerId);
    formData.append("featured", featured);
    formData.append("sele", sele);
    formData.append("condition", condition);
    formData.append("warranty", warranty);
    formData.append("youtubeVideo", youtubeVideo.replace(/\s+/g, ""));
    formData.append("shippingInside", String(shippingInside));
    formData.append("shippingOutside", String(shippingOutside));
    formData.append("metaTitle", metaTitle);
    formData.append("metaDescription", metaDescription);

    // If selectedImage is not null, append it
    if (metaImageFile) {
      formData.append("metaImage", metaImageFile);
    }

    // Convert tags array to a comma-separated string
    formData.append("tags", tags.join(","));

    try {
      // Attempt to update the product
      let response = await fetch(`${apiUrl}/product/update/${productId}`, {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      if (response.ok) {
        openModal("Product updated successfully");
      } else {
        openModal("Product update failed");
      }
    } catch (error) {
      openModal("Product update failed !");
    }
  };

  return (
    <>
      <div className="container my-4">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-2/3">
              <div className="mb-4">
                <p>Title</p>
                <input
                  type="text"
                  placeholder="title"
                  name="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="p-2 mt-2 w-full outline-none rounded-md"
                />
              </div>
              <div className="mb-4">
                <p>Slug</p>
                <input
                  type="text"
                  placeholder="Slug"
                  name="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="p-2 mt-2 w-full outline-none rounded-md"
                />
              </div>
              <div className="mb-4">
                <p>Description</p>
                <Content
                  onChange={(content) => setDescription(content)}
                  initialContent={description} // Pass the initialContent prop here
                />
              </div>
              <div className="mb-4">
                <p>Short Description</p>
                <Content
                  onChange={(content) => setShortDescription(content)}
                  initialContent={shortDescription}
                />
              </div>
              <div className="flex md:flex-row flex-col gap-2">
                <div className="w-full md:w-1/3">
                  <Photo
                    title="Photo (600px * 600px)"
                    img={product?.img}
                    onImageChange={setPhoto}
                  />
                </div>
              </div>
              <div className="mb-4">
                <p>Category</p>
                <select
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.title}
                    </option>
                  ))}
                </select>
              </div>
              {subcategory == null ? (
                <>
                  <div className="mb-4">
                    <label>Subcategory</label>
                    <select
                      value={""}
                      onChange={(e) => setSubcategory(e.target.value)}
                      className="p-2 mt-2 w-full outline-none rounded-md"
                    >
                      <option value="">Select Subcategory</option>
                      {categories
                        .find((category) => category._id === categoryId)
                        ?.subCategories.map((subCategory) => (
                          <option key={subCategory._id} value={subCategory._id}>
                            {subCategory.title}
                          </option>
                        ))}
                    </select>
                  </div>
                </>
              ) : (
                <div className="mb-4">
                  <label>Subcategory</label>
                  <select
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    className="p-2 mt-2 w-full outline-none rounded-md"
                  >
                    <option value="">Select Subcategory</option>
                    {categories
                      .find((category) => category._id === categoryId)
                      ?.subCategories.map((subCategory) => (
                        <option key={subCategory._id} value={subCategory._id}>
                          {subCategory.title}
                        </option>
                      ))}
                  </select>
                </div>
              )}

              <Meta
                metaTitle={metaTitle}
                setMetaTitle={setMetaTitle}
                metaDescription={metaDescription}
                setMetaDescription={setMetaDescription}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                tags={tags}
                setTags={setTags}
                metaValue={metaValue}
                setMetaValue={setMetaValue}
                setMetaImageFile={setMetaImageFile}
              />
            </div>
            <div className="w-full md:w-1/3">
              <div className="border-2 border-main border-dashed rounded-md p-2 my-8">
                <button
                  type="submit"
                  className="bg-main flex items-center justify-center w-full text-white px-4 py-2 rounded-md"
                >
                  Publish
                </button>
              </div>
              <div className="mb-4">
                <p>unPrice</p>
                <input
                  type="number"
                  placeholder="100"
                  value={regularPrice}
                  onChange={(e) => setunPrice(Number(e.target.value))}
                  className="p-2 mt-2 w-full outline-none rounded-md"
                />
              </div>
              <div className="mb-4">
                <p>Price</p>
                <input
                  type="number"
                  placeholder="100"
                  value={sellingPrice}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="p-2 mt-2 w-full outline-none rounded-md"
                />
              </div>
              <div className="mb-4">
                <p>Rating</p>
                <input
                  type="number"
                  placeholder="100"
                  value={rating || 0}
                  onChange={(e) => setRating(Number(e.target.value))}
                  className="p-2 mt-2 w-full outline-none rounded-md"
                />
              </div>
              <div className="mb-4">
                <p>In Stock</p>
                <select
                  className="p-2 mt-2 w-full outline-none rounded-md"
                  value={stockStatus}
                  onChange={(e) => setStockStatus(e.target.value)}
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
              <div className="mb-4">
                <p>Writers</p>
                <select
                  value={writerId}
                  onChange={(e) => setWriterId(e.target.value)}
                  className="p-2 w-full outline-none rounded-md"
                >
                  <option value="" disabled>
                    Select writer
                  </option>
                  {writers.map((writer) => (
                    <option key={writer._id} value={writer._id}>
                      {writer.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <p>Featured!</p>
                <input
                  type="text"
                  placeholder="Featured!"
                  value={featured}
                  onChange={(e) => setFeatured(e.target.value)}
                  className="p-2 mt-2 w-full outline-none rounded-md"
                />
              </div>
              <div className="mb-4">
                <p>Sele!</p>
                <input
                  type="text"
                  placeholder="Sele!"
                  value={sele}
                  onChange={(e) => setSele(e.target.value)}
                  className="p-2 mt-2 w-full outline-none rounded-md"
                />
              </div>
              <div className="mb-4">
                <p>Condition</p>
                <input
                  type="text"
                  placeholder="New"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                  className="p-2 mt-2 w-full outline-none rounded-md"
                />
              </div>

              <div className="mb-4">
                <p>YouTube Video</p>
                <input
                  type="text"
                  placeholder="example: 123,546,879"
                  value={youtubeVideo}
                  onChange={(e) => setYoutubeVideo(e.target.value)}
                  className="p-2 mt-2 w-full outline-none rounded-md"
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Shipping Inside</p>
                <input
                  type="number"
                  placeholder="title"
                  value={shippingInside}
                  onChange={(e) => setShippingInside(Number(e.target.value))}
                  className="p-2 mt-2 w-full outline-none rounded-md"
                />
              </div>
              <div className="flex flex-col md:flex-row md:items-center">
                <p className="md:w-60">Shipping Outside</p>
                <input
                  type="number"
                  placeholder="title"
                  value={shippingOutside}
                  onChange={(e) => setShippingOutside(Number(e.target.value))}
                  className="p-2 mt-2 w-full outline-none rounded-md"
                />
              </div>
            </div>
          </div>
        </form>
        <Modal
          isOpen={modalIsOpen}
          onClose={closeModal}
          content={modalContent}
        />
      </div>
    </>
  );
};

export default UpdateProduct;
