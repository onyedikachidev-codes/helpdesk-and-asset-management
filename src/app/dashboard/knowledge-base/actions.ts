"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type ActionState = {
  error?: string;
  success?: string;
};

// Helper to generate a URL-friendly slug from a title
const createSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/[^\w-]+/g, ""); // Remove all non-word chars
};

export async function createArticle(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  // 1. Authentication: Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return { error: "You must be logged in to create an article." };
  }

  // 2. Authorization: Check if the user has the IT_STAFF role (case-insensitive)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role?.toLowerCase() !== "it_staff") {
    return { error: "Permission Denied: You are not authorized." };
  }

  // 3. Get and validate form data
  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const excerpt = formData.get("excerpt") as string;
  const categoryId = parseInt(formData.get("category_id") as string, 10);
  const imageUrl = formData.get("image_url") as string | null;

  if (!title || !content || !excerpt || isNaN(categoryId)) {
    return {
      error: "Missing required fields: Title, Category, Excerpt, and Content.",
    };
  }

  // 4. Prepare data for insertion
  const slug = createSlug(title);

  // 5. Insert into Supabase
  try {
    const { error } = await supabase.from("kb_articles").insert({
      title,
      slug,
      content,
      excerpt,
      image_url: imageUrl,
      category_id: categoryId,
      author_id: user.id, // Link the article to the author
    });

    if (error) {
      // Check for unique constraint violation on the slug
      if (error.code === "23505") {
        return {
          error:
            "An article with this title already exists. Please choose a different title.",
        };
      }
      throw error;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.error("Error creating article:", e);
    return { error: `A database error occurred: ${e.message}` };
  }

  // 6. On success, revalidate paths to show the new article
  revalidatePath("/dashboard/knowledge-base");

  const { data: category } = await supabase
    .from("kb_categories")
    .select("slug")
    .eq("id", categoryId)
    .single();
  if (category) {
    revalidatePath(`/dashboard/knowledge-base/${category.slug}`);
  }

  return { success: "Article created successfully!" };
}
