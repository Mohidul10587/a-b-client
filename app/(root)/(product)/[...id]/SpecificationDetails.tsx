"use client";
import { InfoSection } from "@/types/product";
import React, { useState } from "react";

interface SpecificationsProps {
  infoSectionsData: InfoSection[];
}

const SpecificationsDetails: React.FC<SpecificationsProps> = ({
  infoSectionsData,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white border mt-2">
      <div className={`${isExpanded ? "" : "overflow-hidden h-72"}`}>
        {infoSectionsData.map((section, index) => (
          <div key={index}>
            <h3 className="text-main text-lg font-bold p-2 flex items-center gap-x-2">
              {section.sectionTitle}
            </h3>
            <table className="w-full">
              <tbody className="w-full">
                {section.fields.map((field, index) => (
                  <tr
                    key={index}
                    className="w-full flex flex-wrap md:items-center flex-col md:flex-row"
                  >
                    <td className="md:w-1/4 px-2 py-1 font-bold flex items-center">
                      <span>{field.fieldTitle}</span>
                    </td>
                    <td className="md:w-3/4">
                      <pre className="px-2 py-1 font-serif break-words break-all whitespace-pre-wrap">
                        {field.content}
                      </pre>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
      <button
        onClick={toggleReadMore}
        className="text-main hover:text-main cursor-pointer uppercase font-bold outline-none p-2 block"
      >
        {isExpanded ? "Show less" : "Show more"}
      </button>
    </div>
  );
};

export default SpecificationsDetails;
