import Image from "next/image";
import bookImage from "@/asset/imgae/image.jpeg";

const RelatedProducts = () => {
  const products = [
    {
      id: 1,
      image: "https://example.com/book-cover1.jpg",
      productName: "The Lost Treasure",
      sellingPrice: 450,
      discount: 15,
      author: "Michael Scott",
    },
    {
      id: 2,
      image: "https://example.com/book-cover2.jpg",
      productName: "Whispers in the Wind",
      sellingPrice: 350,
      discount: 10,
      author: "Emily Bronte",
    },
    {
      id: 3,
      image: "https://example.com/book-cover3.jpg",
      productName: "Journey to the Unknown",
      sellingPrice: 550,
      discount: 20,
      author: "Arthur Conan Doyle",
    },
    {
      id: 4,
      image: "https://example.com/book-cover4.jpg",
      productName: "Mysteries of the Ocean",
      sellingPrice: 499,
      discount: 5,
      author: "Jacques Cousteau",
    },
  ];

  return (
    <div>
      <h1 className="p-6 py-4">Related Products</h1>
      <div className="p-6 space-y-8">
        {products &&
          products.map((product) => (
            <div
              key={product.id}
              className="grid grid-cols-3  gap-4  border-b-2 pb-4"
            >
              <div>
                <Image alt="Image" src={bookImage} />
              </div>

              <div className="col-span-2">
                <h1 className="text-gray-700">{product.productName}</h1>
                <h1 className="text-gray-600"> {product.author} </h1>

                {product?.discount ? (
                  <span>
                    <span className="line-through text-sm text-gray-600">
                      TK. {product?.sellingPrice.toFixed(2)}
                    </span>
                    <span className="ml-2 text-[#0397d3] text-sm">
                      TK.{" "}
                      {(
                        product.sellingPrice -
                        (product.sellingPrice * product.discount) / 100
                      ).toFixed(2)}
                    </span>
                  </span>
                ) : (
                  <>TK. {product?.sellingPrice.toFixed(2)}</>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
