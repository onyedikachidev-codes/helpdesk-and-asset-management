import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import AssetsClient from "@/components/assets/AssetsClient";

export type Asset = {
  id: number;
  name: string;
  type: "Laptop" | "Monitor" | "Phone" | "Other";
  asset_tag: string;
  serial_number: string;
  assigned_at: string;
};

export default async function MyAssetsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: assets, error } = await supabase
    .from("assets")
    .select("id, asset_name, category, asset_tag, serial_number, assigned_at")
    .eq("assigned_to", user.id)
    .order("assigned_at", { ascending: false })
    .returns<Asset[]>();

  if (error) {
    console.error("Error fetching assets:", error);
  }

  return <AssetsClient initialAssets={assets ?? []} />;
}
