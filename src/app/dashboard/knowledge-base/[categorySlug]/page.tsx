import { createClient } from "@/lib/supabase/server";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import ArticleCard from "@/components/ArticleCard";

type CategoryPageProps = {
  params: { categorySlug: string };
};

// --- Type Definitions for robust data handling ---
type ArticleForCard = {
  title: string;
  slug: string;
  image_url: string | null;
  excerpt: string | null;
};

type CategoryWithArticles = {
  id: number;
  name: string;
  slug: string;
  description: string;
  kb_articles: ArticleForCard[];
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = await createClient();
  const { categorySlug } = params;

  // The query now expects the specific 'CategoryWithArticles' type
  const { data: category } = await supabase
    .from("kb_categories")
    .select("*, kb_articles(title, slug, image_url, excerpt)")
    .eq("slug", categorySlug)
    .single<CategoryWithArticles>();

  if (!category) {
    notFound();
  }

  // FIX: Safely handle the case where a category might exist but have no articles.
  // This prevents runtime errors if `kb_articles` is null or undefined.
  const articles = category.kb_articles || [];

  // Add the category slug to each article so the ArticleCard can build the correct link
  const articlesWithCategory = articles.map((article) => ({
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
