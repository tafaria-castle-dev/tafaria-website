// app/components/Toolbar.tsx
"use client";
import React from 'react';

const Toolbar = () => {
  // const [isCollapsed, setIsCollapsed] = useState(false);



  return (
    <div className={`transition-all 'max-h-0 overflow-hidden' : 'max-h-screen'}`}>
      <div className="p-4 bg-gray-800 text-white">
        <div className="space-y-4">
          <div className="p-4 bg-gray-700 rounded">Toolbar Item 1</div>
          <div className="p-4 bg-gray-700 rounded">Toolbar Item 2</div>
          <div className="p-4 bg-gray-700 rounded">Toolbar Item 3</div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;