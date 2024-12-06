"use client";
import React, { useState } from "react";

interface Area {
  name: string;
  selected?: boolean; // Added 'selected' property
}

interface City {
  name: string;
  areas: Area[];
}

interface LocationProps {
  items: City[];
}

const Location: React.FC<LocationProps> = ({ items }) => {
  const [selectedCity, setSelectedCity] = useState<string>(items[0]?.name || "");
  const defaultSelectedArea = items.find(city => city.name === selectedCity)?.areas.find(area => area.selected)?.name || "";
  const [selectedArea, setSelectedArea] = useState<string>(defaultSelectedArea);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
    const defaultSelectedArea = items.find(city => city.name === e.target.value)?.areas.find(area => area.selected)?.name || "";
    setSelectedArea(defaultSelectedArea);
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedArea(e.target.value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <div>
        <p>
          city
        </p>
        <select
          value={selectedCity}
          onChange={handleCityChange}
          className="block w-full px-4 py-2 mt-2 bg-white border border-gray-300 rounded-md focus:outline-none"
        >
          {items.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      {selectedCity && (
        <div>
          <p>
            Area
          </p>
          <select
            value={selectedArea}
            onChange={handleAreaChange}
            className="block w-full px-4 py-2 mt-2 bg-white border border-gray-300 rounded-md focus:outline-none"
          >
            {items
              .find((city) => city.name === selectedCity)
              ?.areas.map((area) => (
                <option key={area.name} value={area.name}>
                  {area.name}
                </option>
              ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default Location;
