import Link from "next/link";
import Image from "next/image";

type Article = {
  title: string;
  slug: string;
  image_url: string | null;
  excerpt: string | null;
  category: {
    slug: string;
  } | null;
};

export default function ArticleCard({ article }: { article: Article }) {
  const articleUrl = `/dashboard/knowledge-base/${article.category?.slug}/${article.slug}`;
  const placeholderImage = "https://picsum.photos/seed/picsum/400/200";

  return (
    <Link href={articleUrl} className="block group">
      <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow">
        <div className="relative h-40 w-full">
          <Image
            src={article.image_url || placeholderImage}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="p-6 flex-grow flex flex-col">
          <h3 className="text-lg font-bold group-hover:text-purple-800 transition-colors">
            {article.title}
          </h3>
          <p className="text-sm text-gray-600 mt-2 flex-grow">
            {article.excerpt}
          </p>
          <span className="text-sm font-semibold text-purple-800 mt-4 self-start">
            Read More →
          </span>
        </div>
      </div>
    </Link>
  );
}
