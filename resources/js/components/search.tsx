// app/components/Search.tsx
"use client";
import React, { useEffect, useRef, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { useDropdown } from '../context/DropdownContext';
import { useQuery } from '@tanstack/react-query';
import { fetchPostsByCategory, Post } from '../querries/categories/getpostsfromcategories';

interface Activity {
  id: string;
  name: string;
}

interface SearchProps {
  onActivitySelect: (activity: Activity) => void;
}

const Search = ({  onActivitySelect }: SearchProps) => {
  const { isDropdownOpen, toggleDropdown } = useDropdown();
  const [dropdownOpened, setDropdownOpened] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        if (isDropdownOpen) {
          toggleDropdown();
          setDropdownOpened(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDropdownOpen, toggleDropdown]);

  const handleButtonClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent the click event from propagating to the document
    if (isDropdownOpen) {
      toggleDropdown();
      setDropdownOpened(false);
    } else {
      toggleDropdown();
      setDropdownOpened(true);
    }
  };

  // var filteredActivities = activities;
    
  const { data, isLoading, error } = useQuery({
    queryKey: ['categories', 'Tafaria experience'],
    queryFn: () => fetchPostsByCategory('Tafaria experience'  ),
  }); 
  
  if (isLoading) return <p>Loading tafaria experience...</p>;
  if (error) return <p>Error: {error.message}</p>;
  console.log("data is what", data);
  const filteredActivities = data?.posts.map((post: Post) => ({
    id: post.id,
    name: post.title,
  }));
  return (
    <div className="relative z-50">
      <div className="flex justify-center">
        <button
          ref={buttonRef}
          onClick={handleButtonClick}
          className="flex w-64 items-center bg-gray-200 text-gray-600 text-sm px-4 py-2 rounded-full shadow hover:bg-gray-300"
        >
          <FaSearch className="mr-2" />
          Tafaria&apos;s Experience
        </button>
      </div>

<p className='hidden'>{dropdownOpened}</p>
      {isDropdownOpen && (
        <div ref={dropdownRef} className="bg-white shadow-md rounded-md w-64 z-50 mt-2 mx-auto">
          <div className="flex justify-center">
            <div className="max-h-48 overflow-y-auto">
              <ul className="py-2">
                {filteredActivities && filteredActivities.length > 0 ? (
                  filteredActivities.map((activity) => (
                    <li
                      key={activity.id}
                      className="px-4 py-2 hover:bg-gray-200 text-black cursor-pointer"
                      onClick={() => {
                        onActivitySelect(activity);
                        toggleDropdown();
                      }}
                    >
                      {activity.name}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-black">No results found</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;