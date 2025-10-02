"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, BookOpen, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  updateArticle,
  deleteArticle,
} from "@/app/dashboard/knowledge-base/actions";

type Article = {
  id: number;
  title: string;
  content: string | null;
  excerpt: string | null;
  author_id: string | null;
  category: {
    name: string | null;
    slug: string | null;
  } | null;
};

type ArticleAdminControlsProps = {
  article: Article;
  userId: string | undefined;
  userRole: string | null;
};

const initialState = { error: "", success: "" };

export default function ArticleAdminControls({
  article,
  userId,
  userRole,
}: ArticleAdminControlsProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Determine user's permissions
  const isAdmin = userRole?.toLowerCase() === "admin";
  const isAuthor = userId === article.author_id;
  const canEdit = isAuthor || isAdmin;
  const canDelete = isAdmin;

  // --- Article Content Parsing ---
  const lines = (article.content ?? "")
    .split("\n")
    .filter((line) => line.trim() !== "");
  let intro = "";
  const steps: string[] = [];
  let isListStarted = false;
  for (const line of lines) {
    if (line.match(/^\d+\.\s/)) {
      isListStarted = true;
      steps.push(line.replace(/^\d+\.\s/, "").trim());
    } else if (!isListStarted) {
      intro += line.trim() + " ";
    }
  }

  return (
    <>
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

      {/* --- Admin Controls Header --- */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">{article.title}</h1>
          {intro && (
            <p className="mt-2 text-lg text-gray-700">{intro.trim()}</p>
          )}
        </div>
        {(canEdit || canDelete) && (
          <div className="flex gap-2">
            {canEdit && (
              <Button onClick={() => setIsEditModalOpen(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            )}
            {canDelete && (
              <Button
                onClick={() => setIsDeleteModalOpen(true)}
                variant="destructive"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
        )}
      </div>

      {/* --- Article Content Display --- */}
      <div className="bg-white rounded-xl shadow-lg border overflow-hidden">
        <div className="bg-gray-50 px-8 py-6 border-b">
          <div className="flex items-center">
            <BookOpen className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Step-by-Step Instructions
            </h2>
          </div>
        </div>
        <div className="p-8">
          <div className="space-y-6">
            {steps.map((instruction, index) => (
              <div key={index} className="flex items-start">
                <div className="flex items-center justify-center w-8 h-8 bg-purple-100 text-purple-700 rounded-full mr-4 font-semibold text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-gray-700 leading-relaxed">{instruction}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
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

      {isEditModalOpen && (
        <EditArticleModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          article={article}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteArticleModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          articleId={article.id}
        />
      )}
    </>
  );
}

// --- Edit Article Modal Component ---
function EditArticleModal({
  isOpen,
  onClose,
  article,
}: {
  isOpen: boolean;
  onClose: () => void;
  article: Article;
}) {
  const [state, formAction] = useActionState(updateArticle, initialState);

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(onClose, 1500);
      return () => clearTimeout(timer);
    }
  }, [state.success, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Article</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4 py-4">
          <input type="hidden" name="articleId" value={article.id} />
          <div>
            <label className="font-semibold">Title</label>
            <Input name="title" defaultValue={article.title} required />
          </div>
          <div>
            <label className="font-semibold">Excerpt</label>
            <Textarea name="excerpt" defaultValue={article.excerpt ?? ""} />
          </div>
          <div>
            <label className="font-semibold">Content</label>
            <Textarea
              name="content"
              defaultValue={article.content ?? ""}
              rows={10}
            />
          </div>
          <DialogFooter>
            <div className="w-full text-center">
              {state.error && (
                <p className="text-red-500 text-sm">{state.error}</p>
              )}
              {state.success && (
                <p className="text-green-500 text-sm">{state.success}</p>
              )}
            </div>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function DeleteArticleModal({
  isOpen,
  onClose,
  articleId,
}: {
  isOpen: boolean;
  onClose: () => void;
  articleId: number;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(deleteArticle, initialState);
  useEffect(() => {
    if (state.success) {
      router.push("/dashboard/knowledge-base");
      onClose();
    }
  }, [state.success, onClose, router]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogHeader>
        <p>
          This action cannot be undone. This will permanently delete the
          article.
        </p>
        <form action={formAction}>
          <input type="hidden" name="articleId" value={articleId} />
          <DialogFooter>
            <div className="w-full text-center">
              {state.error && (
                <p className="text-red-500 text-sm">{state.error}</p>
              )}
              {state.success && (
                <p className="text-green-500 text-sm">{state.success}</p>
              )}
            </div>
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive">
              Yes, delete article
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
