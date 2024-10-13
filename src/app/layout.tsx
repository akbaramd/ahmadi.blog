import "@/styles/globals.css";
import { Github } from "lucide-react";
import { type Metadata } from "next";
import { cn } from "@/lib/utils";
import { QueryClientProvider } from "@tanstack/react-query";
import { TRPCReactProvider } from "@/trpc/react";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Upgrade T3 App",
    description: "A tool to upgrade your create-t3-app instance",
    openGraph: {
        images: [{ url: "/opengraph-image.png" }],
    },
    twitter: {
        card: "summary_large_image",
        images: [{ url: "/opengraph-image.png" }],
    },
    metadataBase: new URL("https://t3-upgrade.vercel.app/"),
};

// Main menu array (center menu after title)
const mainMenuItems = [
    { name: "مقالات", href: "/" },
    { name: "دسته بندی ها", href: "/features" },
];

// Left-side menu array
const leftMenuItems = [
    { name: "گیت هاب", href: "/blog" },
    { name: "درباره من", href: "/support" },
];

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body
            dir="rtl"
            className={cn("min-h-screen")}
        >
        <div className="container max-w-6xl mx-auto bg-white">
            {/* Top Navigation Bar */}
            <nav className="flex items-center gap-6 py-4  px-4 border rounded-b-md">

                {/* Title */}
                <h1 className="text-lg font-bold">
                    اکبر احمدی سرای
                </h1>

                {/* Center Menu (mainMenuItems) */}
                <div className="flex space-x-4 grow rtl:space-x-reverse">
                    {mainMenuItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="text-gray-700 hover:text-indigo-600 transition"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                {/* Left Menu (leftMenuItems) */}
                <div className="flex space-x-4 rtl:space-x-reverse">
                    {leftMenuItems.map((item, index) => (
                        <Link
                            key={index}
                            href={item.href}
                            className="text-gray-700 hover:text-indigo-600 transition"
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>
            </nav>

            {/* Page content */}
            <TRPCReactProvider>{children}</TRPCReactProvider>
        </div>
        </body>
        </html>
    );
}
