"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { User } from "@supabase/supabase-js";

type ActionState = { error?: string; success?: string };

// Helper to get user and role securely
async function getUserAndRole(): Promise<{
  user: User | null;
  role: string | null;
  error?: string;
}> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { user: null, role: null, error: "You must be logged in." };

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  return { user, role: profile?.role ?? null };
}

// --- Existing Action (with updated auth) ---
export async function createArticle(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const { user, role, error: authError } = await getUserAndRole();
  if (authError || !user)
    return { error: authError ?? "Authentication failed." };

  // FIX: Allow both 'it_staff' and 'admin' to create articles.
  const userRole = role?.toLowerCase();
  if (userRole !== "it_staff" && userRole !== "admin") {
    return {
      error: "Permission Denied: You are not authorized to create articles.",
    };
  }

  const supabase = await createClient();
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const categoryId = parseInt(formData.get("category_id") as string, 10);

  if (!title || !content || isNaN(categoryId))
    return { error: "Missing required fields." };

  const slug = title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");

  const { error } = await supabase.from("kb_articles").insert({
    title,
    slug,
    content,
    excerpt: formData.get("excerpt") as string | null,
    image_url: formData.get("image_url") as string | null,
    category_id: categoryId,
    author_id: user.id,
  });

  if (error) {
    if (error.code === "23505")
      return { error: "An article with this title already exists." };
    console.error("Create Article Error:", error);
    return { error: "Database error: Could not create article." };
  }

  revalidatePath("/dashboard/knowledge-base", "layout");
  return { success: "Article created successfully!" };
}

// --- NEW: Action to update an article ---
export async function updateArticle(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // RLS policies in the database will handle authorization.
  const supabase = await createClient();
  const articleId = parseInt(formData.get("articleId") as string, 10);
  if (isNaN(articleId)) return { error: "Invalid Article ID." };

  const updatedData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    excerpt: formData.get("excerpt") as string,
  };

  const { error } = await supabase
    .from("kb_articles")
    .update(updatedData)
    .eq("id", articleId);
  if (error) {
    console.error("Update Article Error:", error);
    return { error: "Database error: Could not update the article." };
  }

  revalidatePath("/dashboard/knowledge-base", "layout");
  return { success: "Article updated successfully." };
}

// --- NEW: Action to delete an article ---
export async function deleteArticle(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  // RLS policies will handle the authorization, ensuring only admins can delete.
  const supabase = await createClient();
  const articleId = parseInt(formData.get("articleId") as string, 10);
  if (isNaN(articleId)) return { error: "Invalid Article ID." };

  const { error } = await supabase
    .from("kb_articles")
    .delete()
    .eq("id", articleId);

  if (error) {
    console.error("Delete Article Error:", error);
    return { error: "Database error: Could not delete the article." };
  }

  // No specific revalidation needed as the user will be redirected.
  return { success: "Article deleted. Redirecting..." };
}
