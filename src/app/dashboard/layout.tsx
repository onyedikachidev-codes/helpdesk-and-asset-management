import React, { ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";

// Corrected import name
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Use the imported function
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const fullName = user.user_metadata?.full_name || "User";

  const firstName = fullName.split(" ")[0];

  const userRole = profile?.role || "employee";

  return (
    <div
      className={`antialiased min-h-screen flex w-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100`}
    >
      <Sidebar role={userRole as "employee" | "it_staff" | "admin"} />

      <div className="flex-1 overflow-x-hidden">
        <Header>
          <Navbar firstName={firstName} userRole={userRole} />
        </Header>
        <main className={` min-h-screen bg-gray-200`}>{children}</main>
      </div>
    </div>
  );
}
