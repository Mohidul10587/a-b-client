"use client";
import { apiUrl } from "@/app/shared/urls";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import LoadingComponent from "@/components/loading";

// Define the Writer interface
interface Writer {
  _id: string;
  title: string;
  description: string;
  rating: number;
  img: string;
}

const IndexPage: React.FC = () => {
  const [writers, setWriters] = useState<Writer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

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
      } finally {
        setLoading(false);
      }
    };

    fetchWriters();
  }, []);

  // Delete a single writer
  const deleteWriter = async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/writer/deleteWriter/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
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
    <div className="container my-6 px-2 sm:px-4">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h1 className="text-xl font-bold">Writers</h1>
        <Link
          href="/admin/writer/add"
          className="bg-main py-2 px-4 rounded-md text-white text-sm"
        >
          Add
        </Link>
      </div>

      {loading ? (
        <LoadingComponent />
      ) : (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white p-4 rounded shadow">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 text-left">Photo</th>
                  <th className="py-2 text-left">Name</th>
                  <th className="py-2 text-left">Rating</th>
                  <th className="py-2 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {writers.map((writer) => (
                  <tr key={writer._id} className="border-t">
                    <td className="py-2">
                      <Image
                        src={writer.img || "/defaultUser.jpeg"}
                        alt={writer.title}
                        width={60}
                        height={60}
                        className="w-16 h-16 object-cover rounded-full"
                      />
                    </td>
                    <td className="py-2">{writer.title}</td>
                    <td className="py-2">{writer.rating}</td>

                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        className="btnOrange inline-block"
                        href={`/admin/writer/${writer._id}`}
                      >
                        Edit
                      </Link>
                      <button
                        className="btnRed inline-block"
                        onClick={() => deleteWriter(writer._id)}
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
            {writers.map((writer) => (
              <div
                key={writer._id}
                className="bg-white p-4 shadow rounded-lg flex flex-col sm:flex-row gap-3"
              >
                <div className="flex gap-4 items-center">
                  <Image
                    src={writer.img || "/defaultUser.jpeg"}
                    alt={writer.title}
                    width={60}
                    height={60}
                    className="w-16 h-16 object-cover rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{writer.title}</h3>
                    <p className="text-sm text-gray-600">
                      Rating: {writer.rating}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    className="flex-1 bg-red-500 text-white py-2 text-sm rounded"
                    onClick={() => deleteWriter(writer._id)}
                  >
                    Delete
                  </button>
                  <Link
                    href={`/admin/writer/${writer._id}`}
                    className="flex-1 bg-orange-500 text-white py-2 text-sm rounded text-center"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default IndexPage;
