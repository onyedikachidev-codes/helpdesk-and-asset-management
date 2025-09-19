import { createClient } from "@/lib/supabase/server";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type CategoryPageProps = {
  params: { categorySlug: string };
};

export default async function CategoryPage({ params }: CategoryPageProps) {
  const supabase = await createClient();
  const { categorySlug } = params;

  // Fetch category details and its articles
  const { data: category } = await supabase
    .from("kb_categories")
    .select("*, kb_articles(title, slug)")
    .eq("slug", categorySlug)
    .single();

  if (!category) {
    notFound();
  }

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

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">
          Articles in this category
        </h2>
        <ul className="space-y-4">
          {category.kb_articles.length > 0 ? (
            category.kb_articles.map((article) => (
              <li key={article.slug}>
                <Link
                  href={`/dashboard/knowledge-base/${category.slug}/${article.slug}`}
                  className="text-lg text-purple-800 hover:underline"
                >
                  {article.title}
                </Link>
              </li>
            ))
          ) : (
            <p className="text-gray-500">
              No articles found in this category yet.
            </p>
          )}
        </ul>
      </div>
    </main>
  );
}
