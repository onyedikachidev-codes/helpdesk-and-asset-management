import ArticleAdminControls from "@/components/Admin/ArticleAdminControls";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

type ArticlePageProps = {
  params: { categorySlug: string; articleSlug: string };
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const supabase = await createClient();
  const { categorySlug, articleSlug } = params;

  // 2. Fetch the current user's ID and role for permission checks
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id;
  let userRole: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    userRole = profile?.role ?? null;
  }

  // 3. Fetch the article, including its author_id, which is crucial for permissions
  const { data: article } = await supabase
    .from("kb_articles")
    .select("*, category:kb_categories!inner(name, slug)")
    .eq("slug", articleSlug)
    .eq("category.slug", categorySlug)
    .single();

  if (!article) {
    notFound();
  }

  // 4. The server component's only job is to fetch data and pass it to the client component.
  // All UI logic, including modals and buttons, is now handled in ArticleAdminControls.
  return (
    <main className="p-6">
      <ArticleAdminControls
        article={article}
        userId={userId}
        userRole={userRole}
      />
    </main>
  );
}
