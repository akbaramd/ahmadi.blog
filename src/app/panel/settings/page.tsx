// app/settings/profile/page.tsx
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { Separator } from "@/components/ui/separator";
import { ProfileForm } from "./profile-form";
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
      <div>
        <h3 className="text-lg font-medium">پروفایل</h3>
        <p className="text-sm text-muted-foreground">
          اطلاعات شما که کاربران روی سایت میبینند
        </p>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
}
