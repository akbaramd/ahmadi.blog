import { Metadata } from "next";
import Image from "next/image";

import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/app/panel/components/sidebar-nav";
import { ToastProvider } from "@/components/ui/toast";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
};

const sidebarNavItems = [
    {
      title: "پروفایل",
      href: "/panel/settings",
    },
    {
      title: "حساب",
      href: "/panel/settings/account",
    },
    {
      title: "ظاهر",
      href: "/panel/settings/appearance",
    },
    {
      title: "اعلانات",
      href: "/panel/settings/notifications",
    },
    {
      title: "نمایش",
      href: "/panel/settings/display",
    },
  ];


interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
      <div className="space-y-6 p-10 pb-16">
          <div className="space-y-0.5">
              <h2 className="text-2xl font-bold tracking-tight">تنظیمات</h2>
              <p className="text-muted-foreground">
                  اطلاعات وبسایت خود را مدیریت کنید
              </p>
          </div>
          <Separator className="my-6"/>
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0 rtl:space-x-reverse">
              <aside className="-mx-4 lg:w-1/5">
                  <SidebarNav items={sidebarNavItems}/>
              </aside>
              <div className="flex-1 lg:max-w-2xl">{children}</div>
          </div>
      </div>
  );
}