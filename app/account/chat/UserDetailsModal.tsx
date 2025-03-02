"use client";

import Image from "next/image";

interface UserDetailsModal {
  isOpen: boolean;
  onClose: () => void;
  presentReceiver: any;
}

export default function UserDetailsModal({
  isOpen,
  onClose,
  presentReceiver,
}: UserDetailsModal) {
  if (!isOpen) return null;

  return (
    <div className="fixed  inset-0 bg-black/50 md:hidden p-2 flex items-center justify-center z-50">
      <div className="max-w-md w-full h-full">
        <button className="absolute right-2 top-2 text-red-500 z-50 bg-white p-1" onClick={() => onClose()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="30"
            height="30"
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
        <div className="bg-white w-full h-full overflow-y-auto">
          {presentReceiver?.isSeller ? (
            <>
              <div className="block relative h-auto">
                <Image
                  src={
                    presentReceiver.sellerInfo?.coverPhoto || "/default.jpg"
                  }
                  alt=""
                  width={400}
                  height={160}
                  className="w-full h-24 object-cover"
                />
                <div className="flex items-end p-2 gap-2 -mt-8 z-50">
                  {presentReceiver?.image ? (
                    <Image
                      src={
                        presentReceiver.sellerInfo?.photo ||
                        presentReceiver.image ||
                        "/default.jpg"
                      }
                      alt={`${presentReceiver.name}'s profile`}
                      width={80}
                      height={80}
                      className="w-12 h-12 bg-white border object-cover"
                    />
                  ) : (
                    <span className="text-gray-500 text-lg font-bold">
                      {presentReceiver?.name?.charAt(0)}
                    </span>
                  )}
                  <h1 className="font-bold">
                    {presentReceiver.sellerInfo.companyName || "N/A"}
                  </h1>
                </div>
              </div>
              <div className="p-2 block text-sm">
                <p>
                  <strong>
                    {presentReceiver.sellerInfo.email || "example@gmail.com"}
                  </strong>
                </p>
                <p>
                  <strong>Country:</strong>
                  {presentReceiver.sellerInfo.country || "N/A"}
                </p>
                <p>
                  <strong>City:</strong>{" "}
                  {presentReceiver.sellerInfo.city || "N/A"}
                </p>
                <p>
                  <strong>Postal Code:</strong>
                  {presentReceiver.sellerInfo.postalCode || "N/A"}
                </p>
                <p>
                  <strong>Street:</strong>{" "}
                  {presentReceiver.sellerInfo.street || "N/A"}
                </p>
                <p>
                  <strong>Address:</strong>
                  {presentReceiver.sellerInfo.address || "N/A"}
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center overflow-hidden mb-4">
                {presentReceiver?.image ? (
                  <Image
                    src={presentReceiver.image}
                    alt={`${presentReceiver.name}'s profile`}
                    width={80}
                    height={80}
                  />
                ) : (
                  <span className="text-gray-500 text-lg font-bold">
                    {presentReceiver?.name?.charAt(0)}
                  </span>
                )}
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                {presentReceiver?.sellerInfo?.companyName ||
                  presentReceiver?.name}
              </h2>
              <p className="text-sm text-gray-500">
                {presentReceiver?.email}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
