// components/MainSidebar.tsx
import React from "react";
import Image from "next/image";
import { Github, Linkedin, Twitter } from "lucide-react";
import Link from "next/link";
import XCard from "@/components/x-card";
import Categories from "@/components/categories";

const MainSidebar = () => {
    return (
        <aside className="lg:w-1/4 w-full">
            {/* Author Card */}
            <XCard>
                <div className="flex flex-col items-center text-center space-y-4">
                    {/* Avatar */}
                    <Image
                        src="/akbar-ahmadi-saray.jpg"
                        width={120}
                        height={120}
                        alt="Profile"
                        className="rounded-full"
                    />
                    {/* Name */}
                    <h2 className="text-xl font-semibold">اکبر احمدی</h2>
                    {/* Introduction */}
                    <p className="text-sm text-gray-500">
                        توسعه دهنده وب و علاقه‌مند به یادگیری تکنولوژی‌های جدید.
                    </p>
                    {/* Social Media Icons */}
                    <div className="flex space-x-4 rtl:space-x-reverse">
                        <Link href="https://github.com" aria-label="GitHub" passHref>
                            <Github className="w-6 h-6 text-gray-600 hover:text-gray-800" />
                        </Link>
                        <Link href="https://twitter.com" aria-label="Twitter" passHref>
                            <Twitter className="w-6 h-6 text-gray-600 hover:text-gray-800" />
                        </Link>
                        <Link href="https://linkedin.com" aria-label="LinkedIn" passHref>
                            <Linkedin className="w-6 h-6 text-gray-600 hover:text-gray-800" />
                        </Link>
                    </div>
                </div>
            </XCard>

            {/* Categories Card */}
            <XCard title={"دسته بندی"}>
                <Categories />
            </XCard>
        </aside>
    );
};

export default MainSidebar;
