import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, BookOpen } from "lucide-react"; // Added BookOpen icon

type ArticlePageProps = {
  params: { categorySlug: string; articleSlug: string };
};

// Helper function to parse the article content
function parseArticleContent(content: string) {
  const lines = content.split("\n").filter((line) => line.trim() !== "");

  let intro = "";
  const steps: string[] = [];
  let isListStarted = false;

  for (const line of lines) {
    if (line.match(/^\d+\.\s/)) {
      isListStarted = true;
      // Remove the "1. ", "2. ", etc. from the start of the line
      steps.push(line.replace(/^\d+\.\s/, "").trim());
    } else if (!isListStarted) {
      intro += line.trim() + " ";
    }
  }

  return {
    intro: intro.trim(),
    steps: steps,
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const supabase = await createClient();
  const { categorySlug, articleSlug } = params;

  const { data: article } = await supabase
    .from("kb_articles")
    .select("*, kb_categories!inner(name, slug)")
    .eq("slug", articleSlug)
    .eq("kb_categories.slug", categorySlug)
    .single();

  if (!article) {
    notFound();
  }

  // Parse the content into an intro and an array of steps
  const { intro, steps } = parseArticleContent(article.content ?? "");

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
          href={`/dashboard/knowledge-base/${article.kb_categories?.slug}`}
          className="text-purple-800 hover:underline"
        >
          {article.kb_categories?.name}
        </Link>
        <ChevronRight className="h-4 w-4 mx-1" />
        <span>{article.title}</span>
      </nav>

      {/* Intro paragraph appears above the card */}
      {intro && <p className="mb-6 text-lg text-gray-900">{intro}</p>}

      {/* The new card component */}
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        {/* Card Header */}
        <div className="bg-gray-50 px-8 py-6 border-b">
          <div className="flex items-center">
            <BookOpen className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Step-by-Step Instructions
            </h2>
          </div>
        </div>

        {/* Instructions List */}
        <div className="p-8">
          <div className="space-y-6">
            {steps.map((instruction, index) => (
              <div key={index} className="flex items-start">
                {/* Step Number */}
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-700 rounded-full mr-4 font-semibold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                {/* Step Content */}
                <div className="flex-1 pt-1">
                  <p className="text-gray-700 leading-relaxed">{instruction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Card Footer */}
        <div className="bg-gray-50 px-8 py-4 border-t">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {steps.length} steps total
            </div>
            <div className="text-sm text-gray-500">
              Need more help?{" "}
              <Link
                href="/dashboard/tickets"
                className="text-purple-800 hover:underline font-semibold"
              >
                Create a new ticket.
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
