"use client";
import Image from "next/image";
import { useState } from "react";

interface Post {
  img: string;
  title: string;
  content: string;
}

interface Box {
  id: number;
  title: string;
  posts: Post[];
}

interface FieldProps {
  items: Box[];
}

const Field: React.FC<FieldProps> = ({ items }) => {
  const [boxes, setBoxes] = useState<Box[]>(items);

  const handleInputChange = (
    boxId: number,
    fieldIndex: number,
    value: string
  ) => {
    setBoxes(
      boxes.map((box) =>
        box.id === boxId
          ? {
              ...box,
              posts: box.posts.map((post, index) =>
                index === fieldIndex ? { ...post, title: value } : post
              ),
            }
          : box
      )
    );
  };

  const handleTextareaChange = (
    boxId: number,
    fieldIndex: number,
    value: string
  ) => {
    setBoxes(
      boxes.map((box) =>
        box.id === boxId
          ? {
              ...box,
              posts: box.posts.map((post, index) =>
                index === fieldIndex ? { ...post, content: value } : post
              ),
            }
          : box
      )
    );
  };

  const handleImageChange = (
    boxId: number,
    fieldIndex: number,
    value: string
  ) => {
    setBoxes(
      boxes.map((box) =>
        box.id === boxId
          ? {
              ...box,
              posts: box.posts.map((post, index) =>
                index === fieldIndex ? { ...post, img: value } : post
              ),
            }
          : box
      )
    );
  };

  const addBox = () => {
    const newBox: Box = {
      id: Date.now(),
      title: "",
      posts: [{ img: "", title: "", content: "" }],
    };
    setBoxes([...boxes, newBox]);
  };

  const addField = (boxId: number) => {
    setBoxes(
      boxes.map((box) =>
        box.id === boxId
          ? {
              ...box,
              posts: [...box.posts, { img: "", title: "", content: "" }],
            }
          : box
      )
    );
  };

  const removeField = (boxId: number, fieldIndex: number) => {
    setBoxes(
      boxes.map((box) =>
        box.id === boxId
          ? {
              ...box,
              posts: box.posts.filter((_, index) => index !== fieldIndex),
            }
          : box
      )
    );
  };

  const removeBox = (boxId: number) =>
    setBoxes(boxes.filter((box) => box.id !== boxId));

  return (
    <div>
      <div className="flex items-center justify-between mb-4 font-bold">
        <h1>Description</h1>
        <button
          onClick={addBox}
          className="bg-main text-white px-4 py-2 rounded"
        >
          Add New
        </button>
      </div>

      {boxes.map((box) => (
        <div key={box.id} className="bg-white p-4 my-2 rounded-md">
          <div className="flex justify-between items-center mb-3">
            <input
              type="text"
              value={box.title}
              onChange={(e) => handleInputChange(box.id, 0, e.target.value)}
              className="border outline-none p-2 max-w-xl w-full"
              placeholder="Box Title"
            />
            <button onClick={() => removeBox(box.id)} className="text-main">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 24 24"
              >
                <path
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M19 5L5 19M5 5l14 14"
                  color="currentColor"
                />
              </svg>
            </button>
          </div>
          {box.posts.map((post, index) => (
            <div key={index} className="flex items-start py-2">
              <div className="flex flex-col items-center relative">
                <label
                  htmlFor={`photoInput-${box.id}-${index}`}
                  className="cursor-pointer w-full flex items-center justify-center"
                >
                  {post.img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <Image
                      src={post.img}
                      width={100}
                      height={100}
                      alt="Selected"
                      className="bg-white w-20 h-10 "
                    />
                  ) : (
                    <div className="w-10 h-10 p-1 border border-gray-500 text-gray-500 border-dashed">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="30"
                        height="30"
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
                    </div>
                  )}
                  <input
                    id={`photoInput-${box.id}-${index}`}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleImageChange(
                        box.id,
                        index,
                        URL.createObjectURL(e.target.files![0])
                      )
                    }
                  />
                </label>
              </div>
              <input
                type="text"
                value={post.title}
                onChange={(e) =>
                  handleInputChange(box.id, index, e.target.value)
                }
                className="border outline-none p-2 ml-2"
                placeholder="Post Title"
              />
              <textarea
                value={post.content}
                onChange={(e) =>
                  handleTextareaChange(box.id, index, e.target.value)
                }
                className="p-1 border w-full ml-2 outline-none rounded-md"
                placeholder="Post Content"
              />
              <button
                onClick={() => removeField(box.id, index)}
                className="text-main ml-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M19 5L5 19M5 5l14 14"
                    color="currentColor"
                  />
                </svg>
              </button>
            </div>
          ))}
          <button
            onClick={() => addField(box.id)}
            className="bg-main text-white px-4 py-2 mt-2 rounded"
          >
            Add New Post
          </button>
        </div>
      ))}
    </div>
  );
};

export default Field;
