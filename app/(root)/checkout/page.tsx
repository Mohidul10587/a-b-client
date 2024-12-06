import React from 'react';
import type { Metadata } from 'next'
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Price in Kenya',
  description: 'Page not found',
}

const NotFound: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-40 bg-white">
      <div className="flex flex-col space-y-4 items-center">
        <h1 className="text-2xl font-bold">
          Content not found
        </h1>
        <p className="text-sm">
        The content you are looking for could not be displayed at this time.<br />
        Please check your internet connection or navigate to our homepage.
        </p>
        <Link
          href="/"
          className='bg-main py-2 px-4 rounded-md text-white'
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;