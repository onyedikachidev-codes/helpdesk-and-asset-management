import EmployeeDashboard from "@/components/Employee/EmployeeDashboard";
import ITStaffDashboard from "@/components/IT_STAFF/ITStaffDashboard";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "it_staff") {
    return <ITStaffDashboard />;
  }

  return <EmployeeDashboard />;
}
