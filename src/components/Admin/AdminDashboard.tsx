import { createClient } from "@/lib/supabase/server";
import { Users, HardDrive, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";
import TicketsLineChart from "../LineChart";
import UserRolesBarChart from "../BarChart";

function StatCard({
  title,
  value,
  icon,
  link,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  link: string;
}) {
  return (
    <Link
      href={link}
      className="block bg-white py-4 px-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
    >
      <div className="flex flex-col items-start justify-between">
        <div className="flex items-center justify-between w-full">
          <p className="text-base font-semibold text-gray-500">{title}</p>
          <div className="p-2 rounded-full bg-purple-100">{icon}</div>
        </div>
        <p
          className={`text-3xl font-bold text-gray-800 mt-2 ${
            typeof value === "string" && value.length > 5 ? "text-2xl" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </Link>
  );
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  // 2. Fetch all necessary data in parallel for efficiency, including chart data
  const [
    totalUsersRes,
    totalAssetsRes,
    openTicketsRes,
    avgResolutionTimeRes,
    dailyTicketsRes,
    userRolesRes,
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("assets").select("*", { count: "exact", head: true }),
    supabase
      .from("tickets")
      .select("*", { count: "exact", head: true })
      .neq("status", "Resolved"),
    supabase.rpc("get_avg_resolution_time"),
    supabase.rpc("get_daily_ticket_counts"),
    supabase.rpc("get_user_role_counts"),
  ]);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullName = user?.user_metadata?.full_name || "User";
  const firstName = fullName.split(" ")[0];

  return (
    <main className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        Welcome, <span className="text-purple-800">{firstName}</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={totalUsersRes.count ?? 0}
          icon={<Users className="text-purple-800" />}
          link="/dashboard/user-management"
        />
        <StatCard
          title="Total Assets"
          value={totalAssetsRes.count ?? 0}
          icon={<HardDrive className="text-purple-800" />}
          link="/dashboard/assets-management"
        />
        <StatCard
          title="Open Tickets"
          value={openTicketsRes.count ?? 0}
          icon={<AlertCircle className="text-purple-800" />}
          link="/dashboard/ticket-queue"
        />
        <StatCard
          title="Avg. Resolution Time"
          value={avgResolutionTimeRes.data ?? "N/A"}
          icon={<Clock className="text-purple-800" />}
          link="/dashboard/ticket-queue"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TicketsLineChart data={dailyTicketsRes.data ?? []} />
        <UserRolesBarChart data={userRolesRes.data ?? []} />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <p className="text-gray-600 mb-4">
            View, edit, and manage user roles and permissions across the system.
          </p>
          <Link
            href="/dashboard/user-management"
            className="font-semibold text-purple-800 hover:underline"
          >
            Go to User Management &rarr;
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Asset Management</h2>
          <p className="text-gray-600 mb-4">
            Assign assets to users, monitor inventory, and maintain detailed
            records for accountability.
          </p>
          <Link
            href="/dashboard/assets-management"
            className="font-semibold text-purple-800 hover:underline"
          >
            Go to Asset Management &rarr;
          </Link>
        </div>
      </div>
    </main>
  );
}
