"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface MenuItem {
  title: string;
  link: string;
}

interface MenusProps {
  items: MenuItem[];
}

const MenusUser: React.FC<MenusProps> = ({ items }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-row overflow-x-auto nober w-full bg-white">
      {items.map((item) => (
        <Link
          key={item.link}
          href={item.link}
          className={`flex-none px-3 py-2 border-b-[3px] hover:border-secondary ${
            pathname === item.link
              ? "border-main text-main"
              : "border-white text-gray-700 dark:border-dark"
          }`}
        >
          <span className="leading-none whitespace-nowrap font-bold text-xs md:text-sm">
            {item.title}
          </span>
        </Link>
      ))}
    </div>
  );
};

export default MenusUser;
