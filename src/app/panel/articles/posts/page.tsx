// app/settings/profile/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Separator } from "@/components/ui/separator";
import { console } from "inspector";
import { authOptions } from "@/server/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "حساب کاربری - پروفایل",
  description: "حساب کاربری ",
};

export default async function SettingsProfilePage() {
  // Fetch the session
  const session = await getServerSession(authOptions);
  // If no session, redirect to login page
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="space-y-6">
      <b>مطالب</b>
    </div>
  );
}
