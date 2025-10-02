import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import UserManagementClient from "./userManagementClient";

// The shape of the user data returned by our new function
export type UserProfile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "admin" | "it_staff" | "employee";
  is_active: boolean;
  job_title: string | null;
  department: string | null;
};

export const dynamic = "force-dynamic";

export default async function UserManagementPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    limit?: string;
    q?: string;
    role?: string;
  };
}) {
  const supabase = await createClient();

  // --- Security Check: Admins only ---
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  // --- Get search and filter params ---
  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = Number(searchParams?.limit) || 10;
  const query = searchParams?.q || "";
  const roleFilter = searchParams?.role || "all";

  // --- Fetch data using the RPC functions ---
  const { data: users, error: usersError } = await supabase
    .rpc("get_paginated_users", {
      page_number: currentPage,
      page_size: itemsPerPage,
      search_query: query,
      role_filter: roleFilter,
    })
    .returns<UserProfile[]>();

  const { data: totalUsers, error: countError } = await supabase
    .rpc("count_filtered_users", {
      search_query: query,
      role_filter: roleFilter,
    })
    .single();

  if (usersError || countError) {
    console.error("Error fetching users:", usersError || countError);
  }

  return (
    <UserManagementClient
      initialUsers={users ?? []}
      totalUsers={totalUsers ?? 0}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
    />
  );
}
