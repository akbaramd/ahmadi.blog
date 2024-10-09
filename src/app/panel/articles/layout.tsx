import { Metadata } from "next";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/app/panel/components/sidebar-nav";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
    title: "Forms",
    description: "Advanced form example using react-hook-form and Zod.",
};

const sidebarNavItems = [
    {
        title: "نوشته ها",
        href: "/panel/articles/posts",
    },
    {
        title: "دسته بندی ها",
        href: "/panel/articles/categories",
    },
    {
        title: "برچسب ها",
        href: "/panel/articles/tags",
    },
];

interface SettingsLayoutProps {
    children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
    return (
        <div className=" p-10 pb-16 h-full">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">مقالات</h2>
                <p className="text-muted-foreground">
                    در این قسمت مقالات خود را ویرایش نمایید
                </p>
            </div>
            <Separator className="mt-4" />

            <div className="flex flex-col lg:flex-row h-full gap-4">
                {/* Sidebar Section */}
                <aside className="lg:w-1/5 mt-4">
                    <SidebarNav items={sidebarNavItems} />
                </aside>

                {/* Vertical Separator */}
                <Separator orientation="vertical" className="h-full lg:h-auto" />

                {/* Main Content */}
                <div className="mt-4 flex-1 lg:max-w-2xl">{children}</div>
            </div>
        </div>
    );
}
