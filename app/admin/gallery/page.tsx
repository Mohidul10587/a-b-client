"use client";

import { apiUrl } from "@/app/shared/urls";
import Add from "@/components/AddImage";
import EditModal from "@/components/EditModal";

import { UploadButton } from "@/components/uploadthing";

import Image from "next/image";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url, {
    credentials: "include",
  }).then((res) => {
    if (!res.ok) throw new Error("Failed to fetch data");
    return res.json();
  });

const IndexPage: React.FC = () => {
  const [editImageModalIsOpen, setEditImageModalIsOpen] = useState(false);
  const [editTitleModalIsOpen, setEditTitleModalIsOpen] = useState(false);
  const [editUseCaseModalIsOpen, setEditUseCaseModalIsOpen] = useState(false);

  const [item, setItem] = useState<any>({});

  const { data, error, mutate, isLoading } = useSWR(
    `${apiUrl}/gallery/all`,
    fetcher
  );
  const closeModal = () => {
    setEditImageModalIsOpen(false);
    setEditTitleModalIsOpen(false);
    setEditUseCaseModalIsOpen(false);
  };

  const handleChangeImage = async (res: any) => {
    const response = await fetch(`${apiUrl}/gallery/${item._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...item,
        img: res[0].url,
      }),
    });

    if (response.ok) {
      mutate();
      closeModal();
    } else {
      alert("Failed to upload");
    }
  };
  const handleChangeTitle = async () => {
    const response = await fetch(`${apiUrl}/gallery/${item._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      mutate();
      closeModal();
    } else {
      alert("Failed to upload");
    }
  };
  const handleChangeUseCase = async () => {
    const response = await fetch(`${apiUrl}/gallery/${item._id}`, {
      method: "PUT",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(item),
    });

    if (response.ok) {
      mutate();
      closeModal();
    } else {
      alert("Failed to upload");
    }
  };
  return (
    <>
      <div className="">
        <p className="mt-4 ml-6 font-bold">Add a image</p>
        <Add mute={mutate} />
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {data && data.result.length > 0 ? (
            <div className="p-8">
              <p className="mt-4 font-bold">All images</p>
              <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
                <thead className="bg-gray-200">
                  <tr>
                    <th className="border border-gray-300 p-2">Image </th>
                    <th className="border border-gray-300 p-2">Title</th>
                    <th className="border border-gray-300 p-2">Use Case</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.result.map((item: any) => (
                    <tr key={item._id} className="hover:bg-gray-100">
                      <td className="border border-gray-300 p-2">
                        <Image
                          src={`${item.img}`}
                          width={50}
                          height={50}
                          alt={item.title}
                          className="rounded-md"
                        />
                        <button
                          onClick={() => {
                            setEditImageModalIsOpen(true);
                            setItem(item);
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          Edit Image
                        </button>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <p>{item.title} </p>
                        <button
                          onClick={() => {
                            setEditTitleModalIsOpen(true);
                            setItem(item);
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          Edit title
                        </button>
                      </td>
                      <td className="border border-gray-300 p-2">
                        <p>
                          {item.useCase?.charAt(0).toUpperCase() +
                            item.useCase?.slice(1)}
                        </p>

                        <button
                          onClick={() => {
                            setItem(item);
                            setEditUseCaseModalIsOpen(true);
                          }}
                          className="text-blue-500 hover:underline"
                        >
                          Edit use case
                        </button>
                      </td>
                      <td className="border border-gray-300 p-2 flex justify-between">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              fetch(`${apiUrl}/gallery/${item._id}`, {
                                method: "DELETE",
                                credentials: "include",
                              }).then(() => {
                                mutate();
                              });
                            }}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8">No items found</div>
          )}
        </>
      )}
      <EditModal isOpen={editImageModalIsOpen} onClose={closeModal}>
        <div>
          <UploadButton
            endpoint="imageUploader"
            onClientUploadComplete={handleChangeImage}
            onUploadError={(error: Error) => {
              alert(`ERROR! ${error.message}`);
            }}
          />
        </div>
      </EditModal>
      <EditModal isOpen={editTitleModalIsOpen} onClose={closeModal}>
        <div>
          <div className="flex items-center gap-x-2 ">
            <p>Image Title</p>
            <input
              type="text"
              name="title"
              value={item.title}
              onChange={(e) => setItem({ ...item, title: e.target.value })}
              placeholder="Title"
              className="p-2  outline-none rounded-md border border-gray-300"
            />
          </div>
          <button
            onClick={() => handleChangeTitle()}
            className="border border-black rounded p-2"
          >
            Submit
          </button>
        </div>
      </EditModal>
      <EditModal isOpen={editUseCaseModalIsOpen} onClose={closeModal}>
        <div>
          <div className="flex items-center gap-x-2 ">
            <p>Image Use Case</p>
            <select
              value={item.useCase}
              onChange={(e) => setItem({ ...item, useCase: e.target.value })}
              className="p-2 border border-gray-300 rounded-md"
            >
              <option value="">All Use Cases</option>
              <option value="product">Product</option>
              <option value="category">Category</option>
              <option value="subcategory">Subcategory</option>
              <option value="childCategory">Child Category</option>
              <option value="brand">Brand</option>
              <option value="logo">Logo</option>
              <option value="banner">Banner</option>
              <option value="popup">Popup</option>
              <option value="others">Others</option>
            </select>
          </div>
          <button
            onClick={() => handleChangeUseCase()}
            className="border border-black rounded p-2"
          >
            Update use case
          </button>
        </div>
      </EditModal>
    </>
  );
};

export default IndexPage;
