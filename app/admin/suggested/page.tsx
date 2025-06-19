"use client";

import { useState, useEffect } from "react";
import { apiUrl } from "@/app/shared/urls";
import Image from "next/image";
import Link from "next/link";
import { ISuggestion } from "@/types/suggestion";
import Modal from "../admin/Modal";
import LoadingComponent from "@/components/loading";

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
        setSuggestions(data.suggestions);
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
        setSuggestions((prev) => prev.filter((s) => s._id !== suggestionId));
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

  return (
    <div className="container my-6 px-2 sm:px-4">
      {/* Top Header */}
      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <h1 className="text-xl font-bold">Suggestions</h1>
        <div>
          <Link
            href="/admin/suggested/add"
            className="bg-main py-2 px-4 rounded-md text-white"
          >
            Add
          </Link>
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <LoadingComponent />
      ) : suggestions.length === 0 ? (
        <p className="text-gray-500">No suggestions found.</p>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Image</th>
                  <th className="px-4 py-2">Title</th>
                  <th className="py-2 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {suggestions.map((s) => (
                  <tr key={s._id} className="border-t">
                    <td className="px-4 py-2">
                      <Image
                        src={s.products[0]?.photo || "/default.jpg"}
                        alt={s.title}
                        width={80}
                        height={60}
                        className="w-20 h-16 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-2">{s.title}</td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        href={`/admin/suggested/edit/${s._id}`}
                        className="btnOrange"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(s._id)}
                        className="btnRed"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden flex flex-col gap-4">
            {suggestions.map((s) => (
              <div
                key={s._id}
                className="bg-white rounded shadow p-4 flex flex-col sm:flex-row gap-4"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={s.products[0]?.photo || "/default.jpg"}
                    alt={s.title}
                    width={80}
                    height={60}
                    className="w-20 h-16 object-cover rounded"
                  />
                  <div>
                    <p className="font-semibold">{s.title}</p>
                  </div>
                </div>
                <div className="mt-2 flex gap-4">
                  <Link
                    href={`/admin/suggested/edit/${s._id}`}
                    className="btnOrange"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(s._id)}
                    className="btnRed"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
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
