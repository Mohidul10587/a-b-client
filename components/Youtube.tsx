import Image from "next/image";
import Link from "next/link";
import React from "react";

interface YoutubeProps {
  videos: string[];
  title: string;
}

const Youtube: React.FC<YoutubeProps> = ({ videos, title }) => {
  // Split the video IDs string into an array

  // Determine the number of columns based on the number of videos
  let gridColsClass = "";
  if (videos.length === 1) {
    gridColsClass = "grid-cols-1";
  } else if (videos.length === 2) {
    gridColsClass = "grid-cols-2";
  } else if (videos.length === 3) {
    gridColsClass = "grid-cols-3";
  } else {
    gridColsClass = "grid-cols-3"; // If more than 3 videos, still use 3 columns
  }

  // Check if there are videos to display
  const hasVideos = videos.length > 0;

  return (
    <>
      {hasVideos && (
        <div className="container">
          <h2 className="text-xl font-semibold">Video reviews</h2>
          <p className="line-clamp-1 text-sm font-normal">
            The best video reviews for {title}
          </p>
          <div className="mt-2">
            <div className={`grid grid-cols-2 md:${gridColsClass} gap-2`}>
              {videos.map((videoId, index) => (
                <Link
                  href={`https://youtu.be/${videoId}`}
                  key={index}
                  className="p-2 bg-white border rounded-md"
                  passHref
                  target="_blank"
                >
                  <Image
                    src={`https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`}
                    width={400}
                    height={250}
                    alt={`Video ${index + 1}`}
                  />
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Youtube;
