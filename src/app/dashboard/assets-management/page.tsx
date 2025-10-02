import AssetManagementClient from "@/components/AssetManagementClient";
import { createClient } from "@/lib/supabase/server";

export type Asset = {
  id: number;
  asset_tag: string;
  asset_type: string;
  manufacturer: string | null;
  model: string | null;
  serial_number: string | null;
  purchase_date: string | null;
  warranty_expiry_date: string | null;
  current_user: {
    id: string;
    full_name: string | null;
  } | null;
};

export type AssetHistory = {
  id: number;
  assigned_at: string;
  unassigned_at: string | null;
  user: {
    full_name: string | null;
  } | null;
};

export type User = {
  id: string;
  full_name: string | null;
};

// Ensure this page is always dynamic
export const dynamic = "force-dynamic";

export default async function AssetManagementPage({
  searchParams,
}: {
  searchParams?: {
    page?: string;
    limit?: string;
    q?: string;
    type?: string;
    assigned?: "yes" | "no";
  };
}) {
  const supabase = await createClient();

  // Fetches the current user's role for permission handling
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRole = "user"; // Default role if not found
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    if (profile) {
      userRole = profile.role;
    }
  }

  const currentPage = Number(searchParams?.page) || 1;
  const itemsPerPage = Number(searchParams?.limit) || 10;
  const query = searchParams?.q || "";
  const typeFilter = searchParams?.type;
  const assignedFilter = searchParams?.assigned;

  const from = (currentPage - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  let queryBuilder = supabase.from("assets").select(
    `
      id,
      asset_tag,
      asset_type,
      manufacturer,
      model,
      serial_number,
      purchase_date,
      warranty_expiry_date,
      current_user:profiles(id, full_name)
    `,
    { count: "exact" }
  );

  // Apply search query
  if (query) {
    queryBuilder = queryBuilder.or(
      `asset_tag.ilike.%${query}%,manufacturer.ilike.%${query}%,model.ilike.%${query}%`
    );
  }

  // Apply asset type filter
  if (typeFilter && typeFilter !== "All") {
    queryBuilder = queryBuilder.eq("asset_type", typeFilter);
  }

  // Apply assigned/unassigned filter
  if (assignedFilter === "yes") {
    queryBuilder = queryBuilder.not("current_user_id", "is", null);
  } else if (assignedFilter === "no") {
    queryBuilder = queryBuilder.is("current_user_id", null);
  }

  const {
    data: assets,
    error,
    count,
  } = await queryBuilder
    .order("created_at", { ascending: false })
    .range(from, to)
    .returns<Asset[]>();

  if (error) {
    console.error("Error fetching assets:", error);
  }

  const totalAssets = count ?? 0;

  // Fetch all users for the assignment dropdown
  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name")
    .returns<User[]>();

  return (
    <AssetManagementClient
      initialAssets={assets ?? []}
      totalAssets={totalAssets}
      users={users ?? []}
      currentPage={currentPage}
      itemsPerPage={itemsPerPage}
      userRole={userRole} // Pass the user role to the client
    />
  );
}
