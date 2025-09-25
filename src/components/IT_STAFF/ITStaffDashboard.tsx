import { createClient } from "@/lib/supabase/server";
import { Inbox, UserCheck, BarChart, CheckCircle } from "lucide-react";
import Link from "next/link";

// A local StatCard component for the IT dashboard's specific style
function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col justify-between h-28">
        <div className="flex items-center justify-between">
          <p className="text-base font-semibold text-gray-500 max-w-[60%]">
            {title}
          </p>
          <div className={`p-2 rounded-full ${color}`}>{icon}</div>
        </div>
        <p className="text-3xl font-bold text-gray-800 text-left mt-auto">
          {value}
        </p>
      </div>
    </div>
  );
}

export default async function ITStaffDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const fullName = user?.user_metadata?.full_name || "User";
  const firstName = fullName.split(" ")[0];

  // --- FIX 2: Calculate date range for "today" ---
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today in local timezone
  const startOfToday = today.toISOString();

  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startOfTomorrow = tomorrow.toISOString();

  // --- Fetch aggregate ticket counts ---
  const { count: unassignedCount } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .is("assigned_to", null)
    .neq("status", "Resolved");

  const { count: myTicketsCount } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("assigned_to", user!.id)
    .neq("status", "Resolved");

  const { count: totalOpenCount } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .neq("status", "Resolved");

  // Query for tickets resolved today
  const { count: resolvedTodayCount } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("status", "Resolved")
    .gte("updated_at", startOfToday)
    .lt("updated_at", startOfTomorrow);

  // --- FIX 1: Add foreign key hint to resolve ambiguity ---
  const { data: unassignedTickets } = await supabase
    .from("tickets")
    .select(
      "id, title, created_at, created_by:profiles!tickets_created_by_fkey(full_name)"
    )
    .is("assigned_to", null)
    .neq("status", "Resolved")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        Good morning, <span className="text-purple-800">{firstName}</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Unassigned Tickets"
          value={unassignedCount ?? 0}
          icon={<Inbox className="text-orange-800" />}
          color="bg-orange-100"
        />
        <StatCard
          title="My Assigned Tickets"
          value={myTicketsCount ?? 0}
          icon={<UserCheck className="text-blue-800" />}
          color="bg-blue-100"
        />
        <StatCard
          title="Total Open Tickets"
          value={totalOpenCount ?? 0}
          icon={<BarChart className="text-purple-800" />}
          color="bg-purple-100"
        />
        <StatCard
          title="Resolved Today"
          value={resolvedTodayCount ?? 0}
          icon={<CheckCircle className="text-green-800" />}
          color="bg-green-100"
        />
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md border">
        <h2 className="text-xl font-semibold mb-4">
          Recent Unassigned Tickets
        </h2>
        <ul className="space-y-4">
          {unassignedTickets && unassignedTickets.length > 0 ? (
            unassignedTickets.map((ticket) => (
              <li
                key={ticket.id}
                className="flex justify-between items-center border-b pb-2"
              >
                <div>
                  <Link
                    href={`/dashboard/ticket-queue`} // Link to the queue for action
                    className="font-semibold text-purple-800 hover:underline"
                  >
                    {ticket.title}
                  </Link>
                  <p className="text-sm text-gray-500">
                    Created by {ticket.created_by?.full_name ?? "N/A"}
                  </p>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(ticket.created_at).toLocaleDateString()}
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No unassigned tickets. Great job!</p>
          )}
        </ul>
      </div>
    </main>
  );
}
