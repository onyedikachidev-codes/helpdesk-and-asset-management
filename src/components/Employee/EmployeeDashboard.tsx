import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import StatCard from "@/components/StatCard";
import QuickActions from "@/components/QuickActions";
import OpenTicketsList from "@/components/OpenTicketsList";
import { Ticket, MailQuestion, CheckCircle } from "lucide-react";

export default async function EmployeeDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // The user check is already in the parent page.tsx, but it's good practice
  if (!user) {
    redirect("/auth/login");
  }

  const fullName = user.user_metadata?.full_name || "User";
  const firstName = fullName.split(" ")[0];

  const { count: openTicketsCount } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("created_by", user.id)
    .eq("status", "Open");

  const { count: inProgressTicketsCount } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("created_by", user.id)
    .eq("status", "In Progress");

  const { count: resolvedTicketsCount } = await supabase
    .from("tickets")
    .select("*", { count: "exact", head: true })
    .eq("created_by", user.id)
    .eq("status", "Resolved");

  const { data: openTickets } = await supabase
    .from("tickets")
    .select("id, title, status, created_at")
    .eq("created_by", user.id)
    .in("status", ["Open", "In Progress"])
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="p-6">
      <h2 className="text-xl font-semibold mb-6">
        Good morning, <span className="text-purple-800">{firstName}</span>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="md:col-span-1 lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Open Tickets"
            value={openTicketsCount ?? 0}
            icon={<Ticket />}
          />
          <StatCard
            title="In Progress"
            value={inProgressTicketsCount ?? 0}
            icon={<MailQuestion />}
          />
          <StatCard
            title="Resolved Tickets"
            value={resolvedTicketsCount ?? 0}
            icon={<CheckCircle />}
          />
        </div>

        <div className="lg:col-span-1">
          <QuickActions />
        </div>

        <div className="md:col-span-2 lg:col-span-4">
          <OpenTicketsList tickets={openTickets ?? []} />
        </div>
      </div>
    </main>
  );
}
