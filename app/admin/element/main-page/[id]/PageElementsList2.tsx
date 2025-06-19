"use client";

import React, { useEffect, useState } from "react";
import { apiUrl } from "@/app/shared/urls";
import Link from "next/link";
import LoadingComponent from "@/components/loading";

import EditElementModal from "../../EditElementModal";
import UpdateElement from "../../UpdateElement";

interface PageElementsListProps {
  id: string;
  pageName: string;
  loadData: boolean;
}

const PageElementsList: React.FC<PageElementsListProps> = ({
  id,
  pageName,
  loadData,
}) => {
  const [pageElements, setPageElements] = useState<any[]>([]); // Store fetched page elements
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [error, setError] = useState<string | null>(null); // Error state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedElement, setSelectedElement] = useState<any | null>(null);
  const [change, setChange] = useState(true);
  const openModal = (element: any) => {
    setSelectedElement(element);
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedElement(null);
  };

  // Fetch page elements by targetedPageId
  useEffect(() => {
    const fetchPageElements = async () => {
      try {
        setLoading(true); // Set loading to true when the fetch starts
        const response = await fetch(
          `${apiUrl}/element/elementByIdAndPage/${id}/${pageName}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch page elements");
        }

        const data = await response.json();
        setPageElements(data.data); // Assuming the data is in the 'data' field
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false); // Set loading to false after fetching completes
      }
    };

    fetchPageElements();
  }, [id, pageName, change, loadData]);

  // Update element status
  const handleToggle = async (elementId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(
        `${apiUrl}/element/updateStatus/${elementId}`,
        {
          method: "PATCH", // Change to PATCH
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: !currentStatus }), // Toggle the status
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the element status");
      }

      // Update the local state to reflect the change
      setPageElements((prevElements) =>
        prevElements.map((element) =>
          element._id === elementId
            ? { ...element, status: !currentStatus } // Update the status field
            : element
        )
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Delete element
  const handleDelete = async (elementId: string) => {
    try {
      const response = await fetch(`${apiUrl}/element/delete/${elementId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to delete element");
      }

      // Remove the element from the state after successful deletion
      setPageElements((prevElements) =>
        prevElements.filter((element) => element._id !== elementId)
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <>
      {/* Loading/Error Component */}
      {loading ? (
        <LoadingErrorState loading={loading} error={error} />
      ) : (
        <div>
          {pageElements.length > 0 ? (
            pageElements.map((element) => (
              <div
                key={element._id}
                className="flex items-center w-full mb-3 group"
              >
                <h2 className="text-xl p-3 w-12 relative text-center rounded-md mr-3 bg-white group-hover:shadow">
                  {element.position}
                </h2>
                <div className="flex items-center p-2 rounded-md bg-white justify-between w-full group-hover:shadow">
                  <h2 className="text-base font-normal">
                    {element.sectionTitle}
                  </h2>
                  {/* Action Buttons integrated directly */}
                  <div className="flex space-x-3 items-center">
                    {/* Edit Button */}
                    <Link
                      // href={`/admin/element/main-page/update/${element._id}`}
                      href={`#`}
                      onClick={() => openModal(element)}
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

                    {/* Delete Button */}
                    <button
                      onClick={() => handleDelete(element._id)}
                      className=""
                    >
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
                    <div>
                      {/* Status Toggle */}
                      <div
                        onClick={() =>
                          handleToggle(element._id, element.status)
                        }
                        className={`relative inline-flex items-center h-6 border rounded-full w-10 cursor-pointer transition-colors duration-300 ${
                          element.status
                            ? "border-main bg-main"
                            : "border-gray-300 bg-white"
                        }`}
                      >
                        <span
                          className={`inline-block w-3 h-3 transform rounded-full transition-transform duration-300 ${
                            element.status
                              ? "bg-white translate-x-5"
                              : "translate-x-1 bg-main"
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {isModalOpen && selectedElement?._id === element._id && (
                  <EditElementModal onClose={closeModal}>
                    {/* Only display the UpdateElement component for the selected element */}
                    <UpdateElement
                      onClose={closeModal}
                      id={element._id}
                      setChange={setChange}
                      change={change}
                    />
                  </EditElementModal>
                )}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No page elements found.</p>
          )}
        </div>
      )}
    </>
  );
};

export default PageElementsList;

const LoadingErrorState: React.FC<{
  loading: boolean;
  error: string | null;
}> = ({ loading, error }) => {
  return (
    <>
      {loading && <LoadingComponent />}

      {error && <p className="text-center text-gray-500">{error}</p>}
    </>
  );
};
