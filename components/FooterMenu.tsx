"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

const FooterMenu = ({
  items,
}: {
  items: { icon: JSX.Element; title: string; link: string }[];
}) => {
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <div className="md:hidden">
      <div
        className={`fixed bottom-0 w-full bg-gray-300 text-xs text-gray-600 shadow-inner transition-transform duration-300 ${
          visible ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="grid grid-cols-4 gap-2 items-center">
          {items.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="flex flex-col items-center space-y p-2"
            >
              {item.icon}
              <span>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FooterMenu;
