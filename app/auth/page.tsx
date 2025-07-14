import Auth from "./Auth";
import Image from "next/image";
import Link from "next/link";

const IndexPage: React.FC = () => {
  return (
    <>
      <div className=" fixed top-0 left-0 right-0 bottom-0 bg-main bg-bg bg-no-repeat bg-cover flex justify-center items-center">
        <div className="flex flex-col items-center w-full max-w-3xl">
          <Link href="/" className="mb-4">
            <Image src="/logo.png" width={150} height={50} alt="logo" />
          </Link>
          <div className="w-full rounded-xl p-6">
            <Auth />
          </div>
        </div>
      </div>
    </>
  );
};

export default IndexPage;
