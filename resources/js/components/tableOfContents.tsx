'use client';
import { useToC } from '@/hooks/ToCContext';
import { Category } from '@/types';
import { Link } from '@inertiajs/react';
import { ChevronDown, ChevronUp, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const baseUrl = 'https://www.tafaria.com';
// const baseUrl = "http://localhost:3000";
// const baseUrl = "https://tafaria-staging.vercel.app";

const TableOfContents = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [openCategories, setOpenCategories] = useState<string[]>([]);
    const { isOpen, setIsOpen } = useToC();
    const sidebarRef = useRef<HTMLElement>(null);
    const fetchCategories = async () => {
        try {
            const response: any = await fetch(
                'https://website-cms.tafaria.com/api/categories',
            );
            return response.data;
        } catch (error: any) {}
    };
    useEffect(() => {
        const loadCategories = async () => {
            try {
                const data = await fetchCategories();
                setCategories(data);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        loadCategories();
    }, []);

    //   useEffect(() => {
    //     const handleOutsideClick = (event: MouseEvent) => {
    //       if (
    //         isOpen &&
    //         sidebarRef.current &&
    //         !sidebarRef.current.contains(event.target as Node)
    //       ) {
    //         setIsOpen(false);
    //       }
    //     };
    //     document.addEventListener("mousedown", handleOutsideClick);
    //     return () => document.removeEventListener("mousedown", handleOutsideClick);
    //   }, [isOpen, setIsOpen]);

    const toggleCategory = (categoryId: string) => {
        setOpenCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId],
        );
    };

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <aside
            ref={sidebarRef}
            className={`fixed top-0 left-0 h-full w-72 transform bg-white p-6 shadow-lg ${isOpen ? 'translate-x-0' : '-translate-x-full'} z-40 overflow-y-auto transition-transform duration-300 ease-in-out`}
            role="navigation"
            aria-label="Table of Contents"
        >
            <nav>
                <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Table of Contents
                    </h2>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-600 hover:text-gray-800"
                        aria-label="Close Table of Contents"
                    >
                        <X className="h-8 w-8 text-[#902729]" />
                    </button>
                </div>
                <ul className="space-y-3">
                    {categories?.map((category) => {
                        const isCategoryOpen = openCategories.includes(
                            category.id,
                        );
                        return (
                            <li
                                key={category.id}
                                className="border-b border-gray-200 pb-2"
                            >
                                <button
                                    onClick={() => toggleCategory(category.id)}
                                    className="flex w-full items-center justify-between py-2 text-left text-base font-medium text-gray-800 transition-colors duration-200 hover:text-[#902729] focus:outline-none"
                                    aria-expanded={isCategoryOpen}
                                    aria-controls={`category-${category.id}`}
                                >
                                    <h3 className="text-l font-bold">
                                        {category.name}
                                    </h3>
                                    {isCategoryOpen ? (
                                        <ChevronUp className="h-5 w-5" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5" />
                                    )}
                                </button>
                                {isCategoryOpen && (
                                    <ul
                                        id={`category-${category.id}`}
                                        className="mt-2 space-y-2 pl-4"
                                    >
                                        {category.posts?.map((post, index) => (
                                            <li key={post.slug}>
                                                <Link
                                                    href={`${baseUrl}/${category.slug}/${post.slug}`}
                                                    className="text-sm text-gray-600 transition-colors duration-200 hover:text-[#902729] hover:underline"
                                                    prefetch={index < 5}
                                                    onClick={handleLinkClick}
                                                >
                                                    {post.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </nav>
        </aside>
    );
};

export default TableOfContents;
