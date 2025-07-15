"use client";

import { apiUrl } from "@/app/shared/urls";
import Image from "next/image";
import { useEffect, useState } from "react";
import Modal from "../admin/UniversalModal";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const IndexPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [idOfUpdatableUser, setIdOfUpdatableUser] = useState("");
  const [updatableUser, setUpdatableUser] = useState<any>({});
  const [password, setPassword] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const { data, error, isLoading, mutate } = useSWR(
    `${apiUrl}/user/allUserForAdmin`,
    fetcher
  );

  useEffect(() => {
    if (data?.users) {
      setUsers(data.users);
      setFilteredUsers(data.users);
    }
  }, [data]);
  
  useEffect(() => {
    if (searchQuery) {
      setFilteredUsers(
        users.filter((user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const toggleUserRole = async (
    userId: string,
    currentRole: "seller" | "user"
  ) => {
    const newRole = currentRole === "seller" ? "user" : "seller";

    try {
      const res = await fetch(
        `${apiUrl}/user/updateSellerStatusOfUser/${userId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (!res.ok) throw new Error("Failed to update role");
      mutate(); // refresh SWR cache
    } catch (err) {
      console.error(err);
    }
  };

  const updateUserStatusOfUser = async (
    userId: string,
    currentStatus: boolean
  ) => {
    try {
      const response = await fetch(
        `${apiUrl}/user/updateUserStatusOfUser/${userId}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ isUser: !currentStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the user status");
      }
      mutate();
    } catch (err: any) {}
  };

  const updateUserPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${apiUrl}/user/updateUserPassword/${idOfUpdatableUser}`,
        {
          method: "PATCH",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update the user password");
      }
      const result = await response.json();
      setModalIsOpen(false);
      setPassword("");
      setIdOfUpdatableUser("");
      setUpdatableUser({});
      alert(result.message);
    } catch (error) {
      console.error("Error updating user password:", error);
    }
  };

  const paginateUsers = (users: any[]) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return users.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Failed to fetch users: {error.message}</p>;
  }

  return (
    <div className="container my-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Users</h1>
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border rounded-md p-2 max-w-72 w-full outline-0"
        />
      </div>
      <div>
        {paginateUsers(filteredUsers)?.map((user) => (
          <div
            key={user._id}
            className="bg-white mb-2 flex flex-col md:flex-row md:justify-between justify-center md:items-center"
          >
            <div className="p-2 flex items-center gap-2">
              <Image
                src={user.image || "/default.jpg"}
                width={75}
                height={50}
                unoptimized
                alt={user.name}
                className="w-12 h-12 object-cover"
              />
              <div>
                <h1 className="font-bold">{user.name}</h1>
                <div className="flex items-center divide-x gap-2 line-clamp-1">
                  <p>{user.email}</p>
                  {user.phone && <span>{user.phone}</span>}
                </div>
              </div>
            </div>

            <div className="p-2">
              <div className="flex items-center gap-2 md:justify-end justify-center">
                <div className="flex items-center space-x-2 gap-1">
                  <p>Password</p>
                  <button
                    type="button"
                    onClick={() => {
                      setModalIsOpen(true);
                      setIdOfUpdatableUser(user._id);
                      setUpdatableUser(user);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="25"
                      height="25"
                      viewBox="0 0 15 15"
                    >
                      <path
                        fill="none"
                        stroke="currentColor"
                        d="M12.5 8.5v-1a1 1 0 0 0-1-1h-10a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1m0-4h-4a2 2 0 1 0 0 4h4m0-4a2 2 0 1 1 0 4m-9-6v-3a3 3 0 0 1 6 0v3m2.5 4h1m-3 0h1m-3 0h1"
                      />
                    </svg>
                  </button>
                </div>

                <div className="flex items-center space-x-2 p-1">
                  <p>Seller</p>
                  <div
                    onClick={() => toggleUserRole(user._id, user.role)}
                    className={`relative inline-flex h-6 w-10 cursor-pointer items-center rounded-full border transition-colors duration-300
              ${
                user.role === "seller"
                  ? "border-main bg-main"
                  : "border-gray-300 bg-white"
              }`}
                  >
                    <span
                      className={`inline-block h-3 w-3 transform rounded-full transition-transform duration-300
                ${
                  user.role === "seller"
                    ? "translate-x-5 bg-white"
                    : "translate-x-1 bg-main"
                }`}
                    />
                  </div>
                </div>

                {/* <div className="flex items-center space-x-2 p-1">
                  <p>User</p>
                  <div
                    onClick={() =>
                      updateUserStatusOfUser(user._id, user.isUser)
                    }
                    className={`relative inline-flex items-center h-6 border rounded-full w-10 cursor-pointer transition-colors duration-300 ${
                      user.isUser
                        ? "border-main bg-main"
                        : "border-gray-300 bg-white"
                    }`}
                  >
                    <span
                      className={`inline-block w-3 h-3 transform rounded-full transition-transform duration-300 ${
                        user.isUser
                          ? "bg-white translate-x-5"
                          : "translate-x-1 bg-main"
                      }`}
                    />
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
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
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <Modal
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        className="w-1/2"
      >
        <div>
          <form onSubmit={updateUserPassword}>
            <p className="flex justify-center">
              Update password for {updatableUser.name}
            </p>
            <div className="flex justify-center mt-2">
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password"
                required
                className="border rounded px-2 py-1 outline-0"
              />
            </div>

            <div className="flex justify-center mt-2">
              <button
                type="submit"
                className="border py-2 px-4 bg-main text-white my-3"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default IndexPage;
