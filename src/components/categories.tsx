// components/Categories.tsx
"use client"
import React from "react";
import Link from "next/link";
import {usePathname} from "next/navigation";

const categories = [
    { id: 1, name: "توسعه وب", path: "/categories/web-development" },
    { id: 2, name: "طراحی رابط کاربری", path: "/categories/ui-design" },
    { id: 3, name: "مدیریت پروژه", path: "/categories/project-management" },
    { id: 4, name: "تکنولوژی", path: "/categories/technology" },
    { id: 5, name: "آموزش", path: "/categories/education" },
];

const Categories = () => {
    const router = usePathname(); // This helps in identifying the current route

    return (
        <div className="mt-4">
            {/* List of Categories */}
            <ul className="mt-2 space-y-1">
                {categories.map((category) => {
                    const isActive = router === category.path;

                    return (
                        <li key={category.id}>
                            {/* Navigation Links */}
                            <Link href={category.path} passHref className={`block text-sm px-4 py-2 rounded-md transition-colors duration-150 ${
                                        isActive
                                            ? "bg-neutral-200 text-gray-800 font-medium"
                                            : "hover:bg-neutral-100 text-gray-600"
                                    }`}
                                >
                                    {category.name}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default Categories;
