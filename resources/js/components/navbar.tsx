import React from 'react';

const Navbar = () => {
  return (
    <div className="flex flex-col h-screen">
      {/* Scrollable Top Navbar */}
      <div className="flex-shrink-0 bg-gray-800 text-white p-4 overflow-y-auto">
        <h1 className="text-xl font-bold">My Application</h1>
        <p className="mt-2">Scrollable content goes here...</p>
        {/* Add more content to make it scrollable */}
        <div className="mt-4 space-y-2">
          {Array.from({ length: 20 }, (_, i) => (
            <div key={i} className="bg-gray-700 p-2 rounded">
              Item {i + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Tabs */}
      <div className="flex-shrink-0 bg-gray-900 text-white p-4">
        <div className="flex justify-around">
          <a href="#" className="flex-1 text-center py-2 hover:bg-gray-700 rounded">
            Home
          </a>
          <a href="#" className="flex-1 text-center py-2 hover:bg-gray-700 rounded">
            Categories
          </a>
          <a href="#" className="flex-1 text-center py-2 hover:bg-gray-700 rounded">
            Profile
          </a>
          <a href="#" className="flex-1 text-center py-2 hover:bg-gray-700 rounded">
            Settings
          </a>
        </div>
      </div>
    </div>
  );
};

export default Navbar;