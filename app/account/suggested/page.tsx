"use client";
import { useState, useEffect } from "react";
import { apiUrl } from "@/app/shared/urls";
import Image from "next/image";
import Modal from "../account-comp/Modal";
import Link from "next/link";
import { ISuggestion } from "@/types/suggestion";

const IndexPage: React.FC = () => {
  const [suggestions, setSuggestions] = useState<ISuggestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await fetch(`${apiUrl}/seller/allSuggestions`, {
          credentials: "include",
        });
        const data = await res.json();

        setSuggestions(data);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  const handleDelete = async (suggestionId: string) => {
    try {
      const response = await fetch(`${apiUrl}/suggestion/${suggestionId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const data = await response.json();
        setModalContent(data.message);
        setIsModalOpen(true);

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredSuggestions = suggestions?.filter((suggestion) =>
    suggestion.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSuggestions.length / itemsPerPage);
  const displayedSuggestions = filteredSuggestions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (loading) return <p className="text-gray-500">Loading suggestions...</p>;

  return (
    <div className="container my-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h1 className="text-xl font-bold">Suggestions</h1>
        <div className="flex gap-2 items-center md:justify-end md:mt-0 mt-2">
          <input
            type="text"
            placeholder="Search suggestions..."
            className="border rounded outline-0 p-2 w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Link
            href="/account/suggested/add"
            className="bg-main py-2 px-4 rounded-md text-white"
          >
            Add
          </Link>
        </div>
      </div>
      {suggestions.length === 0 && (
        <p className="text-gray-500">No suggestions found.</p>
      )}
      {displayedSuggestions.map((suggestion) => (
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
              loading="lazy"
            />
            <h2 className="text-base font-medium line-clamp-1">
              {suggestion.title}
            </h2>
          </div>
          <div
            key={suggestion._id}
            className="flex items-center justify-end gap-3"
          >
            <Link href={`/account/suggested/edit/${suggestion._id}`}>
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

      {filteredSuggestions.length > itemsPerPage && (
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded ${
              currentPage === 1 ? "bg-gray-300" : "bg-main text-white"
            }`}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded ${
              currentPage === totalPages ? "bg-gray-300" : "bg-main text-white"
            }`}
          >
            Next
          </button>
        </div>
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
