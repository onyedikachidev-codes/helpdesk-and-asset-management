import { createClient } from "@/lib/supabase/server";
import { Book, Laptop, AppWindow, Wifi } from "lucide-react";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import CreateArticleButton from "@/components/CreateArticleButton";

const iconMap: { [key: string]: React.ReactNode } = {
  Laptop: <Laptop className="h-8 w-8 text-purple-800" />,
  AppWindow: <AppWindow className="h-8 w-8 text-purple-800" />,
  Wifi: <Wifi className="h-8 w-8 text-purple-800" />,
};

type RecentArticle = {
  title: string;
  slug: string;
  image_url: string | null;
  excerpt: string | null;
  category: {
    slug: string;
  } | null;
};

export default async function KnowledgeBasePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let userRole: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    userRole = profile?.role ?? null;
  }

  const { data: categories } = await supabase.from("kb_categories").select("*");

  const { data: recentArticles } = await supabase
    .from("kb_articles")
    .select("title, slug, image_url, excerpt, category:kb_categories(slug)")
    .order("created_at", { ascending: false })
    .limit(3)
    .returns<RecentArticle[]>();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold">Knowledge Base</h1>
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="text-md text-gray-500 mt-1">
            Find answers and solutions to common problems.
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <CreateArticleButton
            userRole={userRole}
            categories={categories ?? []}
          />
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Browse by Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories?.map((category) => (
            <Link
              key={category.id}
              href={`/dashboard/knowledge-base/${category.slug}`}
              className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center gap-4">
                {iconMap[category.icon_name ?? ""] || (
                  <Book className="h-8 w-8 text-purple-800" />
                )}
                <div>
                  <h3 className="font-bold text-lg">{category.name}</h3>
                  <p className="text-sm text-gray-500">
                    {category.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Recent Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentArticles?.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </main>
  );
}
