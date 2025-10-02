"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// --- TYPE DEFINITION for form action feedback ---
// FIX: Removed `| null` to ensure an object is always returned.
type ActionState = {
  error?: string;
  success?: string;
};

// --- CREATE ASSET ACTION ---
export async function createAsset(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // ... function body remains the same
  const supabase = await createClient();
  const rawFormData = {
    asset_tag: formData.get("asset_tag") as string,
    serial_number: (formData.get("serial_number") as string) || null,
    asset_type: formData.get("asset_type") as string,
    manufacturer: (formData.get("manufacturer") as string) || null,
    model: (formData.get("model") as string) || null,
    purchase_date: (formData.get("purchase_date") as string) || null,
    warranty_expiry_date:
      (formData.get("warranty_expiry_date") as string) || null,
  };
  if (!rawFormData.asset_tag || !rawFormData.asset_type) {
    return { error: "Asset Tag and Type are required." };
  }
  const { error } = await supabase.from("assets").insert(rawFormData);
  if (error) {
    console.error("Create Asset Error:", error);
    if (error.code === "23505")
      return { error: "An asset with this tag already exists." };
    return { error: "Database error: Could not create asset." };
  }
  revalidatePath("/dashboard/asset-management");
  return { success: "Asset created successfully!" };
}

// --- ASSIGN ASSET ACTION ---
export async function assignAsset(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // ... function body remains the same
  const supabase = await createClient();
  const assetId = parseInt(formData.get("asset_id") as string, 10);
  const userId = formData.get("user_id") as string;

  if (isNaN(assetId) || !userId) {
    return { error: "Invalid asset or user ID." };
  }

  const { error } = await supabase
    .from("assets")
    .update({ current_user_id: userId })
    .eq("id", assetId);

  if (error) {
    console.error("Assign Asset Error:", error);
    return { error: "Database error: Could not assign asset." };
  }

  await supabase
    .from("asset_history")
    .insert({ asset_id: assetId, user_id: userId });

  revalidatePath("/dashboard/asset-management");
  return { success: "Asset assigned successfully!" };
}

// --- UNASSIGN ASSET ACTION ---
export async function unassignAsset(
  prevState: ActionState,
  assetId: number
): Promise<ActionState> {
  // ... function body remains the same
  const supabase = await createClient();

  if (!assetId) {
    return { error: "Asset ID is missing." };
  }

  const { data: assetData, error: fetchError } = await supabase
    .from("assets")
    .select("current_user_id")
    .eq("id", assetId)
    .single();

  if (fetchError || !assetData?.current_user_id) {
    console.error("Unassign Fetch Error:", fetchError);
    return { error: "Could not find the asset or it's already unassigned." };
  }

  const { error: updateError } = await supabase
    .from("assets")
    .update({ current_user_id: null })
    .eq("id", assetId);

  if (updateError) {
    console.error("Unassign Update Error:", updateError);
    return { error: "Database error: Could not unassign asset." };
  }

  await supabase
    .from("asset_history")
    .update({ unassigned_at: new Date().toISOString() })
    .eq("asset_id", assetId)
    .eq("user_id", assetData.current_user_id)
    .is("unassigned_at", null);

  revalidatePath("/dashboard/asset-management");
  return { success: "Asset has been unassigned." };
}

// --- GET ASSET HISTORY ACTION (No changes) ---
export async function getAssetHistory(assetId: number) {
  // ... function body remains the same
  const supabase = await createClient();
  const { data } = await supabase
    .from("asset_history")
    .select("*, user:profiles(full_name)")
    .eq("asset_id", assetId)
    .order("assigned_at", { ascending: false });
  return data ?? [];
}

// --- DELETE ASSET ACTION ---
export async function deleteAsset(
  prevState: ActionState,
  assetId: number
): Promise<ActionState> {
  // ... function body remains the same
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "Authentication required." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return {
      error: "Unauthorized: You do not have permission to delete assets.",
    };
  }

  if (!assetId) {
    return { error: "Asset ID is missing." };
  }

  const { error } = await supabase.from("assets").delete().eq("id", assetId);

  if (error) {
    console.error("Delete Asset Error:", error);
    return { error: "Database error: Could not delete the asset." };
  }

  revalidatePath("/dashboard/asset-management");
  return { success: "Asset was permanently deleted." };
}
