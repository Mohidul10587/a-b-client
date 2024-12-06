"use client";
import { InfoSection } from "@/types/product";
import React from "react";

interface SpecificationsProps {
  highlights: string;
  title: string;
  infoSectionsData: InfoSection[];
}

const Specifications: React.FC<SpecificationsProps> = ({
  highlights,
  title,
  infoSectionsData,
}) => {
  const hasInformation = infoSectionsData.some((section) =>
    section.fields.some((field) => field.display !== false)
  );

  return (
    <>
      {hasInformation && (
        <h1 className="font-medium leading-tight text-base max-w-full mb-3">{highlights} {title}</h1>
      )}
      <table className="w-full">
        <tbody className="w-full">
        {infoSectionsData.map((section, index) => (
          <React.Fragment key={index}>
            {section.fields.map(
              (field, fieldIndex) =>
                // Only render the field if display is true or undefined
                field.display && (
                  <tr
                    key={fieldIndex}
                    className="px-2 py-1 flex gap-2 rounded"
                  >
                    <td className="font-medium whitespace-nowrap">{field.fieldTitle}</td>
                    <td className="line-clamp-1">{field.content}</td>
                  </tr>
                )
            )}
         </React.Fragment>
        ))}
        </tbody>
      </table>
    </>
  );
};

export default Specifications;
