"use client";
import { useState, ReactNode } from "react";

interface AccountProps {
  title: ReactNode;
  sub: ReactNode;
}

const Account: React.FC<AccountProps> = ({ title, sub }) => {
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  return (
    <div 
      className="relative hidden md:block"
      onMouseEnter={() => setIsSubMenuOpen(true)}
      onMouseLeave={() => setIsSubMenuOpen(false)}
    >
      <div className="cursor-pointer">{title}</div>
      {isSubMenuOpen && (
        <div className="absolute w-52 z-50 right-0 bg-white">
          {sub}
        </div>
      )}
    </div>
  );
};

export default Account;