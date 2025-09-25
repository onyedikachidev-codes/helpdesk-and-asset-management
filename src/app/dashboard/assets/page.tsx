import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AssetsClient from "@/components/assets/AssetsClient";

// This type definition is correct and matches your database schema.
export type Asset = {
  id: number;
  asset_type: "Laptop" | "Monitor" | "Phone" | "Other";
  asset_tag: string;
  serial_number: string | null;
  manufacturer: string | null;
  model: string | null;
  updated_at: string;
};

export default async function MyAssetsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // FIX 1: Fetch the user's role from the 'profiles' table.
  // This is needed by the AssetCard to determine which button to show.
  let userRole: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    userRole = profile?.role ?? null;
  }

  // This query is now correct.
  const { data: assets, error } = await supabase
    .from("assets")
    .select(
      "id, asset_type, asset_tag, serial_number, manufacturer, model, updated_at"
    )
    .eq("current_user_id", user.id)
    .order("updated_at", { ascending: false })
    .returns<Asset[]>();

  if (error) {
    console.error("Error fetching assets:", error);
  }

  // FIX 2: Pass the fetched userRole down to the client component.
  return <AssetsClient initialAssets={assets ?? []} userRole={userRole} />;
}
