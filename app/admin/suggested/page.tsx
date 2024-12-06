"use client";

import { useState, useEffect } from "react";
import { apiUrl } from "@/app/shared/urls";
import Image from "next/image";

import Link from "next/link";
import { ISuggestion } from "@/types/suggestion";
import Modal from "../admin/Modal";

const IndexPage: React.FC = () => {
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`${apiUrl}/suggestion`);
        const data = await res.json();
        console.log(data);
        setSuggestions(data.suggestions);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleEdit = (productId: string) => {
    // Implement your edit functionality here
  };

  const handleDelete = async (suggestionId: string) => {
    try {
      const response = await fetch(`${apiUrl}/suggestion/${suggestionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const data = await response.json(); // Get response JSON with message
        setModalContent(data.message); // Display message in modal
        setIsModalOpen(true);

        // Update suggestions to remove the deleted suggestion
        setSuggestions((prevSuggestions) =>
          prevSuggestions.filter(
            (suggestion) => suggestion._id !== suggestionId
          )
        );
      } else {
        setModalContent("Failed to delete the suggestion.");
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error deleting suggestion:", error);
      setModalContent("An error occurred while deleting the suggestion.");
      setIsModalOpen(true);
    }
  };

  if (loading) return <p className="text-gray-500">Loading suggestions...</p>;

  return (
    <div className=" container my-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Suggestions</h1>
        <div>
          <Link
            href="/admin/suggested/add"
            className="bg-main py-1 px-4 rounded-md text-white"
          >
            Add
          </Link>
        </div>
      </div>
      {suggestions.length === 0 ? (
        <p className="text-gray-500">No suggestions found.</p>
      ) : (
        <>
          {suggestions.map((suggestion) => (
            <div
              key={suggestion._id}
              className="flex items-center justify-between rounded-md bg-white p-2 mb-2"
            >
              <div className="flex items-center justify-start gap-2">
                <Image
                  src={suggestion?.products[0]?.photo || "/default.jpg"}
                  alt=""
                  width={30}
                  height={30}
                  className="w-10 h-10 object-cover"
                  unoptimized
                />
                <h2 className="text-base font-medium line-clamp-1">
                  {suggestion.title}
                </h2>
              </div>
              <div
                key={suggestion._id}
                className="flex items-center justify-end gap-3"
              >
                <Link
                  href={`/admin/suggested/edit/${suggestion._id}`}
                  onClick={() => handleEdit(suggestion._id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 24 24"
                  >
                    <g
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    >
                      <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                      <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"></path>
                    </g>
                  </svg>
                </Link>
                <button onClick={() => handleDelete(suggestion._id)}>
                  <svg
                    className="text-red-500"
                    xmlns="http://www.w3.org/2000/svg"
                    width="35"
                    height="35"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M7.616 20q-.672 0-1.144-.472T6 18.385V6H5V5h4v-.77h6V5h4v1h-1v12.385q0 .69-.462 1.153T16.384 20zM17 6H7v12.385q0 .269.173.442t.443.173h8.769q.23 0 .423-.192t.192-.424zM9.808 17h1V8h-1zm3.384 0h1V8h-1zM7 6v13z"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        content={modalContent}
      />
    </div>
  );
};

export default IndexPage;
