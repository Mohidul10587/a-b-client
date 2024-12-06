import React from "react";

const LoadingComponent = () => {
  return (
    <div className="container my-4">
      <div className="grid md:grid-cols-4 grid-cols-1">
        <div className="border border-white shadow rounded-md p-4 w-full">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="bg-white h-40 w-full"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-white rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-white rounded col-span-2"></div>
                  <div className="h-2 bg-white rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-white rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="border border-white shadow rounded-md p-4 w-full">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="bg-white h-40 w-full"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-white rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-white rounded col-span-2"></div>
                  <div className="h-2 bg-white rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-white rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="border border-white shadow rounded-md p-4 w-full">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="bg-white h-40 w-full"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-white rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-white rounded col-span-2"></div>
                  <div className="h-2 bg-white rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-white rounded"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="border border-white shadow rounded-md p-4 w-full">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="bg-white h-40 w-full"></div>
            <div className="flex-1 space-y-6 py-1">
              <div className="h-2 bg-white rounded"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-3 gap-4">
                  <div className="h-2 bg-white rounded col-span-2"></div>
                  <div className="h-2 bg-white rounded col-span-1"></div>
                </div>
                <div className="h-2 bg-white rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingComponent;
