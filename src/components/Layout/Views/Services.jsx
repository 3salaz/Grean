import React from "react";

function Services() {
  return (
    <div className="h-full container bg-white flex flex-col items-center p-2">
      <header className="bg-grean text-white w-full p-2 drop-shadow-lg">
        <div className="rounded-sm font-bold text-lg">Services</div>
      </header>
      <main className="w-full h-full pr-4 flex flex-col gap-4 flex-wrap items-center justify-center">
        <div className="w-full flex h-80 gap-2">
            <div className="w-1/2 bg-red-300 flex items-center justify-center rounded-md">Home</div>
            <div className="w-1/2 bg-blue-300 flex items-center justify-center rounded-md">Business</div>
        </div>
        <div className="w-full bg-grean h-40 flex items-center justify-center rounded-md">
            Drivers
        </div>
      </main>
    </div>
  );
}

export default Services;
