import { apiUrl } from "@/app/shared/urls";
import { signOut } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { FC, useState } from "react";
import {
  FaBook,
  FaChevronCircleDown,
  FaHeart,
  FaShoppingBag,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";

const DropdownMenu: FC<{ user: any }> = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: <FaUser size={18} />, label: "My Profile" },
    { icon: <FaShoppingBag size={18} />, label: "Orders" },
    { icon: <FaBook size={18} />, label: "eBook Library" },
    { icon: <FaHeart size={18} />, label: "Wishlist" },
  ];
  async function handleLogOut() {
    try {
      const res = await fetch(`${apiUrl}/user/logout`, {
        credentials: "include",
        method: "POST",
      });
      if (res.ok) {
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
    // Redirect to the sign-out callback URL
    signOut({ callbackUrl: "/auth" });
  }
  return (
    <div className="relative inline-block text-left z-50">
      <button
        onClick={toggleDropdown}
        className=" flex items-center gap-2 px-2 py-1 bg-white border rounded-lg shadow-sm hover:bg-gray-100"
      >
        <Image
          src={`${user?.image || "/defaultUser.jpeg"}`}
          width={30}
          height={30}
          alt={"User"}
          className="rounded-full"
        />
        <span className="truncate">{user?.name || "Mr. User"}</span>

        <FaChevronCircleDown className="hover:text-blue-600" size={18} />
      </button>

      {isOpen && (
        <div
          className="absolute -right-8 mt-2 w-56 bg-white border rounded-lg shadow-lg"
          onMouseLeave={() => {
            setIsOpen(false);
          }}
        >
          {menuItems.map((item, index) => (
            <Link
              href={`/account`}
              key={index}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 hover:text-blue-600 cursor-pointer"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          <div
            onClick={() => handleLogOut()}
            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-100 hover:text-red-600 cursor-pointer"
          >
            <FaSignOutAlt size={18} /> <span>Sign Out</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
