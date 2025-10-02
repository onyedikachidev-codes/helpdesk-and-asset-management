import AdminDashboard from "@/components/Admin/AdminDashboard";
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

  // 2. Add a check for the 'admin' role.
  // The order is important: check for admin first, then IT staff.
  if (profile?.role === "admin") {
    return <AdminDashboard />;
  }

  if (profile?.role === "it_staff") {
    return <ITStaffDashboard />;
  }

  // Default to the Employee Dashboard if the user is not an admin or IT staff.
  return <EmployeeDashboard />;
}
