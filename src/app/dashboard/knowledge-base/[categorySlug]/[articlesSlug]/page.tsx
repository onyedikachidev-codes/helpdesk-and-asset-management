import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type ArticlePageProps = {
  params: { categorySlug: string; articleSlug: string };
};

export default async function ArticlePage({ params }: ArticlePageProps) {
  const supabase = await createClient();
  const { categorySlug, articleSlug } = params; // Get both params

  // Corrected Query: Filter by both the article slug and the category slug
  const { data: article } = await supabase
    .from("kb_articles")
    .select("*, category:kb_categories!inner(name, slug)") // Use !inner for a required join
    .eq("slug", articleSlug)
    .eq("category.slug", categorySlug) // Filter on the category's slug
    .single();

  if (!article) {
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
        <Link
          href={`/dashboard/knowledge-base/${article.category?.slug}`}
          className="text-purple-800 hover:underline"
        >
          {article.category?.name}
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>{article.title}</span>
      </nav>

      <article className="prose lg:prose-xl max-w-none bg-white p-8 rounded-lg shadow-md">
        <h1>{article.title}</h1>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {article.content ?? ""}
        </ReactMarkdown>
      </article>
    </main>
  );
}
