"use client";
import { IProduct } from "@/types/product";
import Product from "./Product.home";
import Link from "next/link";
import Image from "next/image";

interface ProductDivProps {
  products: IProduct[];
  gridForMobile?: string;
  gridForDesktop?: string;
}

const ProductDiv: React.FC<ProductDivProps> = ({
  products,
  gridForMobile = "2",
  gridForDesktop = "5",
}) => {
  return (
    <div
      className={`grid grid-cols-${gridForMobile} md:grid-cols-${gridForDesktop} gap-4 w-full`}
    >
      {products?.map((product, index) => (
        <Product key={index} {...product} />
      ))}
      {fakeProduct} {fakeProduct} {fakeProduct} {fakeProduct} {fakeProduct}
    </div>
  );
};

export default ProductDiv;
const fakeProduct = (
  <div className="group relative border bg-white block rounded h-full">
    <div className="w-full">
      <div className="w-full relative md:h-48 p-2 pb-0 h-40 flex items-center justify-center">
        <Image
          src={"/default.jpg"}
          width={600}
          height={600}
          alt={"title"}
          quality={100}
          className="h-full w-min cursor-pointer object-cover"
        />
      </div>
      <div className="p-2 block">
        <h2 className="line-clamp-2 mb-2 text-base font-semibold text-black"></h2>
      </div>
    </div>
  </div>
);
