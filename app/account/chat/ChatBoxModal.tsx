"use client";

import { ReactNode } from "react";

interface ChatBoxModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}

export default function ChatBoxModal({
  children,
  isOpen,
  onClose,
}: ChatBoxModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white w-full h-full">
        <button className="absolute right-2 top-3 text-red-500 z-50 bg-white p-1" onClick={() => onClose()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            viewBox="0 0 16 16"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="m7.116 8l-4.558 4.558l.884.884L8 8.884l4.558 4.558l.884-.884L8.884 8l4.558-4.558l-.884-.884L8 7.116L3.442 2.558l-.884.884z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
}
