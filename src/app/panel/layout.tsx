import { Metadata } from "next";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./components/sidebar-nav";
import { ToastProvider } from "@/components/ui/toast";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};


const mainNavItems = [
    {
        title: "مقالات",
        href: "/panel/articles/(posts)",
    },
    {
        title: "تنظیمات",
        href: "/panel/settings",
    }
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className={"flex flex-col h-screen divide-y"}>
        <div className={"h-[60px]"}></div>
        <div className={"flex grow divide-x divide-x-reverse"}>
            <div className={"w-[300px] p-4"}>
                <SidebarNav items={mainNavItems}/>
            </div>
            <div className={"grow"}>
                {children}
            </div>
        </div>

    </div>
  );
}