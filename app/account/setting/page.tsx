"use client";
import { useEffect, useState } from "react";
import Text from "@/app/account/account-comp/post/Text";
import { apiUrl } from "@/app/shared/urls";
import Modal from "../account-comp/Modal";
import { useData } from "@/app/DataContext";

const IndexPage: React.FC = () => {
  const { user } = useData();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${apiUrl}/user/singleUser/${user._id}`, {
          credentials: "include",
        });

        if (response.ok) {
          const { user } = await response.json();
          setName(user.name);
          setAddress(user.address);
          setImage(user.image);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error(error);
      }
    };

    if (user._id) {
      fetchUser();
    }
  }, [user]);

  const handleSubmit = async () => {
    const payload = {
      name,
      image,
      address,
    };

    try {
      openModal("Updating user info...");

      const response = await fetch(
        `${apiUrl}/user/updateUserInfo/${user._id}`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (response.ok) {
        openModal(data.message);
      } else {
        openModal(data.message || "Failed to update user info");
      }
    } catch (error) {
      console.error(error);
      openModal("Internal server error");
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 container">
      <div className="bg-white">
        <h1 className="p-2 border-b">Images</h1>
        <Text
          value={image}
          setValue={setImage}
          title="Your image"
          sub="Enter base64 or image URL"
        />
      </div>

      <div className="bg-white">
        <h1 className="p-2 border-b">Information</h1>
        <div className="p-2">
          <Text
            value={name}
            setValue={setName}
            title="Your name"
            sub="Enter your full name"
          />

          <div className="flex space-x-2 items-center">
            <label htmlFor="address">Your address</label>
            <textarea
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-black"
            ></textarea>
          </div>
        </div>
      </div>

      <div className="col-span-1 md:col-span-2 flex justify-center">
        <button
          onClick={handleSubmit}
          className="bg-blue-500 text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>
      </div>

      <Modal isOpen={modalIsOpen} onClose={closeModal} content={modalContent} />
    </div>
  );
};

export default IndexPage;
