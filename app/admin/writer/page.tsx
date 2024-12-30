"use client";
import { apiUrl } from "@/app/shared/urls";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { fetchWithTokenRefresh } from "@/app/shared/fetchWithTokenRefresh";

// Define the Writer interface
interface Writer {
  _id: string;
  title: string;
  description: string;
  rating: number;
  photo: string;
}

const IndexPage: React.FC = () => {
  const [writers, setWriters] = useState<Writer[]>([]);

  // Fetch all writers
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

    fetchWriters();
  }, []);

  // Delete a single writer
  const deleteWriter = async (id: string) => {
    const token = localStorage.getItem("accessToken");
    try {
      const response = await fetchWithTokenRefresh(
        `${apiUrl}/writer/deleteWriter/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setWriters((prevWriters) =>
          prevWriters.filter((writer) => writer._id !== id)
        );
      } else {
        throw new Error("Failed to delete writer");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="container my-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">Writer list</h1>
          <Link
            href="/admin/writer/add"
            className="bg-main py-1 px-4 rounded-md text-white"
          >
            Add
          </Link>
        </div>
        <div className="bg-white p-2 my-2">
          <table className="table-auto text-left w-full">
            <thead>
              <tr className="flex justify-between gap-x-4 p-2 bg-gray-300 font-bold mb-2">
                <th className="text-center w-1/12">Photo</th>
                <th className="text-center w-1/12">Name</th>

                <th className="text-center w-1/12">Rating</th>
                <th className="text-center w-1/12">Action</th>
                <th className="text-center w-1/12 text-gray-300">.</th>
              </tr>
            </thead>
            <tbody>
              {writers.map((writer) => (
                <tr
                  key={writer._id}
                  className="flex justify-between items-center my-1 border border-gray-300  gap-x-4 px-2 py-1"
                >
                  <td className="text-center w-1/12">
                    {/* Use the Image component to display the photo */}
                    <div className=" overflow-hidden">
                      {" "}
                      {/* Smaller container */}
                      <Image
                        src={writer.photo}
                        alt={writer.title}
                        width={90}
                        height={40}
                        className="w-16 h-20 rounded-full"
                      />
                    </div>
                  </td>
                  <td className="text-center w-1/12">{writer.title}</td>

                  <td className="text-center w-1/12">{writer.rating}</td>
                  <td className="text-center w-2/12 space-x-1 flex items-center">
                    <button
                      className="text-red-500 border border-red-500 rounded-md px-1"
                      onClick={() => deleteWriter(writer._id)}
                    >
                      Dlt
                    </button>
                    <Link
                      className="text-orange-500  border border-orange-500 rounded-md px-1"
                      href={`/admin/writer/${writer._id}`}
                    >
                      Edit
                    </Link>
                    {/* <Link
                      className="text-green-500  border border-green-500 rounded-md px-1"
                      href={`/admin/manageElement/showElement/${writer._id}/writer`}
                    >
                      Manage page
                    </Link> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default IndexPage;
