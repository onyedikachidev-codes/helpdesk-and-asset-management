import { createClient } from "@/lib/supabase/server";
import { Book, Laptop, AppWindow, Wifi } from "lucide-react";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard"; // 1. Import the new component

// A map to render icons based on the name stored in the DB
const iconMap: { [key: string]: React.ReactNode } = {
  Laptop: <Laptop className="h-8 w-8 text-purple-800" />,
  AppWindow: <AppWindow className="h-8 w-8 text-purple-800" />,
  Wifi: <Wifi className="h-8 w-8 text-purple-800" />,
};

export default async function KnowledgeBasePage() {
  const supabase = await createClient();

  // Fetch all categories
  const { data: categories } = await supabase.from("kb_categories").select("*");

  // 2. Updated the query to fetch image_url and excerpt, and limit to 3
  const { data: recentArticles } = await supabase
    .from("kb_articles")
    .select("title, slug, image_url, excerpt, category:kb_categories(slug)")
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <main className="p-6">
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <h1 className="text-3xl font-bold">Knowledge Base</h1>
        <p className="text-gray-600 mt-2">
          Find answers and solutions to common problems.
        </p>
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
        {/* 3. Replaced the old list with a grid of ArticleCard components */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {recentArticles?.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </main>
  );
}
