import Image from "next/image";
import React from "react";

function FirstPartOfHeder() {
  return (
    <div className="bg-main hidden md:block">
      <div className="max-w-6xl m-auto">
        <Image src="/add.webp" height={800} width={1400} alt="" />
      </div>
    </div>
  );
}

export default FirstPartOfHeder;
