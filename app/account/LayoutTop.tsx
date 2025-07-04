import Image from "next/image";
import { FC } from "react";
import MenusUser from "./MenusUser";

const LayoutTop: FC<{
  user: any;
}> = ({ user }) => {
  const date = new Date(user.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });

  return (
    <div className="my-4 container">
      <div className="bg-white">
        <div className="flex flex-col md:flex-row gap-4 w-full p-2 md:p-4 pb-0">
          <div className="w-full md:w-1/2">
            <div className="flex items-center">
              <div className="rounded border h-24 w-24 mr-2 p-2 flex items-center justify-center">
                <Image
                  src={`${user.image || "/default.jpg"}`}
                  width={130}
                  height={130}
                  alt="user"
                  className="w-min h-full"
                />
              </div>
              <div>
                <h1 className=" font-bold text-secondary text-md">
                  {user.name}
                </h1>
                <ul className="text-sm">
                  <li> {user.name}</li>
                  <li>Joined {date}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 hidden md:block">
            <div className="grid md:grid-cols-3 grid-cols-2 gap-3">
              <div className="flex items-center text-xs bg-main text-white p-3 rounded-md shadow">
                <span></span>
                <div>
                  <strong>438</strong>
                  <p>Reputation Points</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs bg-main text-white  p-3 rounded-md shadow">
                <div>
                  <strong>179</strong>
                  <p>Profile Views</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs bg-main text-white  p-3 rounded-md shadow">
                <div>
                  <strong>142K</strong>
                  <p>Deal Views</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs bg-main text-white  p-3 rounded-md shadow">
                <div>
                  <strong>29</strong>
                  <p>Deals Posted</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs bg-main text-white  p-3 rounded-md shadow">
                <div>
                  <strong>830</strong>
                  <p>Comments Posted</p>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-xs bg-main text-white  p-3 rounded-md shadow">
                <div>
                  <strong>2.5K</strong>
                  <p>Votes Given</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {user && (
          <>
            {user.isSeller ? (
              <MenusUser
                items={[
                  { title: "My order", link: `/account` },
                  // {
                  //   title: "Messenger",
                  //   link: `/account/chat`,
                  // },
                  { title: "Setting", link: `/account/setting` },
                  { title: "Wishlist", link: `/account/wishlist` },
                  // {
                  //   title: "Seller dashboard",
                  //   link: `/account/seller-dashboard`,
                  // },
                  // {
                  //   title: "Seller product",
                  //   link: `/account/seller-product`,
                  // },
                  // {
                  //   title: "Product Suggestion",
                  //   link: `/account/suggestion`,
                  // },
                  // {
                  //   title: "Seller Setting",
                  //   link: `/account/seller-setting`,
                  // },
                  // {
                  //   title: "Seller withdraw",
                  //   link: `/account/seller-withdraw`,
                  // },
                  // {
                  //   title: "Builder",
                  //   link: `/account/element/main-page/seller-home`,
                  // },
                  // {
                  //   title: "Banner",
                  //   link: `/account/banner`,
                  // },
                  // {
                  //   title: "B2B",
                  //   link: `/account/betterModel`,
                  // },
                ]}
              />
            ) : (
              <MenusUser
                items={[
                  { title: "My order", link: `/account` },
                  // {
                  //   title: "Messenger",
                  //   link: `/account/chat`,
                  // },
                  { title: "Setting", link: `/account/setting` },
                  { title: "Wishlist", link: `/account/wishlist` },
                ]}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LayoutTop;
