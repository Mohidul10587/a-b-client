"use client";
import { IProduct } from "@/types/product";
import Product from "./Product";

interface ProductBoxProps {
  items: IProduct[];
}

const ProductCats: React.FC<ProductBoxProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {items?.map((item, index) => (
        <Product key={index} {...item} />
      ))}
    </div>
  );
};

export default ProductCats;
