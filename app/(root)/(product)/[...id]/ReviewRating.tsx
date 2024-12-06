"use client";
import Image from "next/image";
import { SetStateAction, useState } from "react";
import { FaStar, FaCamera, FaTimes } from "react-icons/fa";
import { useSpring, animated } from "react-spring";
import image from "@/asset/imgae/image.jpeg";

import { FcRating } from "react-icons/fc";

const ReviewRating = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [photos, setPhotos] = useState([]);

  const handleRating = (value: SetStateAction<number>) => {
    setRating(value);
  };

  // const handlePhotoChange = (e: { target: { files: Iterable<unknown> | ArrayLike<unknown>; }; }) => {
  //   if (photos.length < 5) {
  //     // setPhotos([...photos, ...Array.from(e.target.files)]);
  //   } else {
  //     alert("You can only upload up to 5 photos.");
  //   }
  // };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    alert(`Rating: ${rating}, Comment: ${comment}, Photos: ${photos.length}`);
    // Reset state after submission
    setRating(0);
    setComment("");
    setPhotos([]);
    setModalOpen(false);
  };

  const modalAnimation = useSpring({
    opacity: modalOpen ? 1 : 0,
    transform: modalOpen ? "translateY(0)" : "translateY(-50px)",
    config: { tension: 300, friction: 20 },
  });

  return (
    <div className="mt-4">
      <h1 className="text-xl ">Reviews and Ratings</h1>

      <div className="md:flex mt-10 md:mt-0 gap-52 items-center">
        <div className="mb-4 mt-12  space-y-3 md:ml-8">
          {/* Display Rating Above Button */}
          <div className="flex  mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`cursor-pointer ${
                  star <= rating ? "text-yellow-500" : "text-gray-300"
                }`}
                onClick={() => handleRating(star)}
                size={24}
              />
            ))}
          </div>
          <h1 className="text-xl">Rate this product</h1>
          <button
            className="border-2 px-2 font-bold py-2 rounded text-[#0397d3] hover:bg-[#0397d3] hover:text-white border-[#0397d3]"
            onClick={() => setModalOpen(true)}
          >
            রিভিউ লিখুন
          </button>
        </div>

        <div>
          {/* avarage rating */}
          <h1 className="text-lg font-semibold">4.17</h1>
          <div className="flex gap-2">
            <FcRating className="text-3xl" />
            <FcRating className="text-3xl" />
            <FcRating className="text-3xl" />
            <FcRating className="text-3xl" />
          </div>

          <p className="text-gray-500"> 5 Ratings Two Review </p>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <animated.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          style={modalAnimation}
        >
          <div className="bg-white p-8 rounded-lg w-1/2 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              onClick={() => setModalOpen(false)}
            >
              <FaTimes size={24} />
            </button>
            <div className=" mb-2 flex gap-4">
              <Image
                src={image}
                alt="Book Image"
                className=" mb-4"
                width={50}
                height={50}
              />
              <div>
                <h1 className=" ">book name</h1>
                <h1 className=" ">Rate this book</h1>

                <div className="flex  mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaStar
                      key={star}
                      className={`cursor-pointer ${
                        star <= rating ? "text-yellow-500" : "text-gray-300"
                      }`}
                      onClick={() => handleRating(star)}
                      size={24}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Star Rating in Modal */}

            {/* Comment Box */}
            <textarea
              className="w-full p-3 border rounded mb-4 focus:border-green-600 outline-none"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write something (optional)"
            />

            {/* Photo Upload */}
            <div className="border-dashed border-2 border-gray-300 p-4 rounded mb-4">
              <label className="flex flex-col items-center cursor-pointer">
                <FaCamera className="text-gray-500 mb-2" size={24} />
                <span className="text-gray-500">Upload Photos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  // onChange={handlePhotoChange}
                />
              </label>
              <div className="grid grid-cols-3 gap-2">
                {photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={URL.createObjectURL(photo)}
                      alt={`Uploaded ${index}`}
                      className="w-20 h-20 object-cover rounded"
                      width={50}
                      height={50}
                    />
                    <button
                      className="absolute top-0 right-0 text-red-500"
                      onClick={() => handleRemovePhoto(index)}
                    >
                      <FaTimes size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        </animated.div>
      )}
    </div>
  );
};

export default ReviewRating;
