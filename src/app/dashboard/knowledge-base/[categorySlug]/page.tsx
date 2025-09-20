import { createClient } from "@/lib/supabase/server";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";

type CategoryPageProps = {
  params: { categorySlug: string };
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = await createClient();
  const { categorySlug } = params;

  // 2. Updated the query to fetch image_url and excerpt for the cards
  const { data: category } = await supabase
    .from("kb_categories")
    .select("*, kb_articles(title, slug, image_url, excerpt)")
    .eq("slug", categorySlug)
    .single();

  if (!category) {
    notFound();
  }

  // 3. We need to add the category slug to each article so the ArticleCard can build the correct link
  const articlesWithCategory = category.kb_articles.map((article) => ({
    ...article,
    category: { slug: category.slug },
  }));

  return (
    <main className="p-6">
      <nav className="flex items-center text-sm mb-6">
        <Link
          href="/dashboard/knowledge-base"
          className="text-purple-800 hover:underline"
        >
          Knowledge Base
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>{category.name}</span>
      </nav>

      <h1 className="text-3xl font-bold">{category.name}</h1>
      <p className="text-gray-600 mt-2">{category.description}</p>

      {/* 4. Replaced the old list with a cleaner grid of ArticleCards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articlesWithCategory.length > 0 ? (
          articlesWithCategory.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))
        ) : (
          <p className="text-gray-500 md:col-span-3">
            No articles found in this category yet.
          </p>
        )}
      </div>
    </main>
  );
}
