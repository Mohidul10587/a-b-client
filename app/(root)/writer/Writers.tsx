import { IWriter } from "@/types/writer";
import Image from "next/image";
import Link from "next/link";
import React from "react";

// Define the WritersProps interface
interface WritersProps {
  writers: IWriter[];
}

const Writers: React.FC<WritersProps> = ({ writers }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-2">
      {writers.map((item, index) => (
        <Link
          href={`/writer/${item.slug}`}
          key={index}
          className="group flex items-center justify-center flex-col pb-3 border font-bold bg-white"
        >
          <div className="flex items-center justify-center h-24">
            <Image
              src={item.photo || "/default.jpg"}
              width={100}
              height={50}
              alt={item.title}
            />
          </div>
          <div className="grid grid-cols-2 w-full">
            <p className="flex flex-col justify-center items-center">
              <span className="text-sm font-medium">{item.writerProducts}</span>
              <span className="text-sm font-normal">Items</span>
            </p>

            <p className="flex flex-col justify-center items-center">
              <span className="text-sm font-medium">4.5</span>
              <span className="text-sm font-normal">Rating</span>
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Writers;
