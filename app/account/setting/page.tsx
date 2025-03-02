"use client";
import { useEffect, useState } from "react";
import Text from "@/app/account/account-comp/post/Text";
import Email from "@/app/account/account-comp/post/Email";
import Password from "@/app/account/account-comp/post/Password";
import { apiUrl } from "@/app/shared/urls";
import { useParams } from "next/navigation";

import Modal from "../account-comp/Modal";
import { UpdateImage } from "../account-comp/UpdatePhoto";
import { useData } from "@/app/DataContext";

const IndexPage: React.FC = () => {
  // Declare state for each field
  const { user } = useData();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [initialImage, setInitialImage] = useState<string | undefined>(
    undefined
  );
  const [photo, setPhoto] = useState<string | File | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [previousPhoto, setPreviousPhoto] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`${apiUrl}/user/singleUser/${user._id}`, {
          credentials: "include",
        });
        if (response.ok) {
          const { user } = await response.json();
          
          setName(user.name);
          setPhone(user.phone);
          setEmail(user.email);
          setInitialImage(user.image);
          setPreviousPhoto(user.image);
          setAddress(user.address);
        } else {
          throw new Error("Failed to fetch product");
        }
      } catch (error) {}
    };
    if (user._id) {
      fetchUser();
    }
  }, [user]);

  const handleSubmit = async () => {
    if (password || confirmPassword) {
      if (password !== confirmPassword) {
        openModal("Password do not match");
        return;
      }
    }

    const formData = new FormData();

    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("previousPhoto", previousPhoto);
    formData.append("address", address);

    if (photo) {
      formData.append("photo", photo);
    }

    try {
      openModal("Updating user info...");
      const response = await fetch(
        `${apiUrl}/user/updateUserInfo/${user._id}`,
        {
          credentials: "include",
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      if (response.ok) {
        openModal(data.message);
      } else {
        openModal(data.message);
      }
    } catch (error) {
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
        <div>
          {" "}
          <UpdateImage initialImage={initialImage} onImageChange={setPhoto} />
        </div>
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
          <Text
            value={phone == "null" ? "" : phone}
            setValue={setPhone}
            title="Your number"
            sub="Enter your number"
          />

          <Email
            value={email}
            setValue={setEmail}
            title="Your email"
            sub="Enter your email"
          />
          <div className="flex space-x-2 items-center">
            <label htmlFor="address">Your address</label>
            <textarea
              name=""
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border border-black"
            ></textarea>
          </div>
        </div>
      </div>
      <div className="bg-white">
        <h1 className="p-2 border-b">Change your password</h1>
        <div className="p-2">
          <Password
            value={password || ""}
            setValue={setPassword}
            title="New Password"
            sub="Enter your password"
          />
          <Password
            value={confirmPassword || ""}
            setValue={setConfirmPassword}
            title="Confirm Password"
            sub="Re-enter your password"
          />
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
