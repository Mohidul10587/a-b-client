"use client";
import { IProduct } from "@/types/product";
import Product from "./Product";

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
    </div>
  );
};

export default ProductDiv;
