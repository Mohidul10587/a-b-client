import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Post {
  img: string;
  title: string;
}

interface Item {
  link: string;
  post: Post[];
}

interface ComparesProps {
  items: Item[];
}

const Compares: React.FC<ComparesProps> = ({ items }) => {
  return (
    <div className="container my-4">
        <h2 className="text-xl font-semibold">
            Latest comparisons
        </h2>
        <p>
            The most recent product comparisons
        </p>
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2'>
            {items.map((item, index) => (
                <div key={index} className='rounded-md border overflow-hidden cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all duration-200 ease-in-out bg-white flex flex-col space-y-4 h-full p-4'>
                    <Link
                        href={item.link}
                        className="flex flex-col justify-center items-center text-center space-y-4 h-full group"
                    >
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-1">
                                <Image
                                    src={item.post[0].img || "/default.jpg"}
                                    width={100}
                                    height={100}
                                    alt={item.post[0].title}
                                    className="cursor-pointer hover:opacity-80"
                                />
                                <p className="text-sm text-center pt-2 line-clamp-4">
                                    {item.post[0].title}
                                </p>
                            </div>

                            <div className="col-span-1 flex flex-col items-center justify-center space-y-2">
                                <p className="text-4xl font-bold text-gray-500">VS</p>
                            </div>

                            <div className="col-span-1">
                                <Image
                                    src={item.post[1].img || "/default.jpg"}
                                    width={100}
                                    height={100}
                                    alt={item.post[1].title}
                                    className="cursor-pointer hover:opacity-80"
                                />
                                <p className="text-sm text-center pt-2 line-clamp-4">
                                    {item.post[1].title}
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            ))}
        </div>
    </div>
  );
};

export default Compares;
