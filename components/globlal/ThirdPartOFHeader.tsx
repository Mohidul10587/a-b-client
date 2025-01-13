import React from "react";

const ThirdPartOFHeader = () => {
  return (
    <div className="flex items-center gap-3 py-4 bg-white max-w-6xl m-auto">
      <div className="group relative">
        <button className="text-lg font-medium text-gray-700 hover:text-blue-600 focus:outline-none">
          লেখক
        </button>
        <div className="absolute hidden group-hover:block bg-white shadow-lg border rounded-md p-4 z-50">
          <div className="grid grid-cols-4 gap-4 w-[1152px]">
            <p className="text-gray-700 hover:text-blue-600">হুমায়ূন আহমেদ</p>
            <p className="text-gray-700 hover:text-blue-600">সমরেশ মজুমদার</p>
            <p className="text-gray-700 hover:text-blue-600">
              রবীন্দ্রনাথ ঠাকুর
            </p>
            <p className="text-gray-700 hover:text-blue-600">
              সুনীল গঙ্গোপাধ্যায়
            </p>
            <p className="text-gray-700 hover:text-blue-600">অনীশুল হক</p>
            <p className="text-gray-700 hover:text-blue-600">
              শীর্ষেন্দু মুখোপাধ্যায়
            </p>
            <p className="text-gray-700 hover:text-blue-600">সত্যজিৎ রায়</p>
          </div>
        </div>
      </div>

      <div className="group relative">
        <button className="text-lg font-medium text-gray-700 hover:text-blue-600 focus:outline-none">
          বিষয়
        </button>
        <div className="absolute hidden group-hover:block bg-white shadow-lg border rounded-md  p-4 space-y-2 z-50 ">
          <div className="grid grid-cols-4 gap-4 w-[1152px]">
            <p className="text-gray-700 hover:text-blue-600">আহমদ ছফা</p>
            <p className="text-gray-700 hover:text-blue-600">
              বিভূতিভূষণ বন্দ্যোপাধ্যায়
            </p>
            <p className="text-gray-700 hover:text-blue-600">সৈয়দ শামসুল হক</p>
            <p className="text-gray-700 hover:text-blue-600">সাদাত হোসাইন</p>
            <p className="text-gray-700 hover:text-blue-600">
              তাসির শরিফুল সুনিম
            </p>
            <p className="text-gray-700 hover:text-blue-600">সেলিনা হোসেন</p>
            <p className="text-gray-700 hover:text-blue-600">জহির রায়হান</p>
          </div>
        </div>
      </div>
      <div className="group relative">
        <button className="text-lg font-medium text-gray-700 hover:text-blue-600 focus:outline-none">
          প্রকাশনী
        </button>
        <div className="absolute hidden group-hover:block bg-white shadow-lg border rounded-md mt-2 p-4 space-y-2">
          <p className="text-gray-700 hover:text-blue-600">ড্যান ব্রাউন</p>
          <p className="text-gray-700 hover:text-blue-600">চেতন ভগত</p>
          <p className="text-gray-700 hover:text-blue-600">রবিন শর্মা</p>
          <p className="text-gray-700 hover:text-blue-600">নাসিম তালেব</p>
          <p className="text-gray-700 hover:text-blue-600">ইবনুল কাসিম</p>
          <p className="text-gray-700 hover:text-blue-600">
            ইসলামিক বুক ফাউন্ডেশন
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThirdPartOFHeader;
