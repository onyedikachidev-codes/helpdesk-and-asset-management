"use client";

import { useActionState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createArticle } from "@/app/dashboard/knowledge-base/actions";

type Category = {
  id: number;
  name: string;
};

type CreateArticleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
};

const initialState = {
  error: "",
  success: "",
};

export default function CreateArticleModal({
  isOpen,
  onClose,
  categories,
}: CreateArticleModalProps) {
  const [state, formAction] = useActionState(createArticle, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        onClose();
        formRef.current?.reset();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [state.success, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New Knowledge Base Article</DialogTitle>
          <DialogDescription>
            Fill in the details below to add a new article.
          </DialogDescription>
        </DialogHeader>

        <form ref={formRef} action={formAction} className="space-y-4 py-4">
          <div>
            <label htmlFor="title" className="font-semibold">
              Title
            </label>
            <Input id="title" name="title" required />
          </div>

          <div>
            <label htmlFor="category" className="font-semibold">
              Category
            </label>
            <Select name="category_id" required>
              <SelectTrigger>
                <SelectValue placeholder="Select a category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={String(category.id)}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label htmlFor="excerpt" className="font-semibold">
              Excerpt (A short summary)
            </label>
            <Textarea
              id="excerpt"
              name="excerpt"
              placeholder="A brief, one-sentence summary of the article."
              required
            />
          </div>

          <div>
            <label htmlFor="content" className="font-semibold">
              Content (Use numbered lists for steps)
            </label>
            <Textarea
              id="content"
              name="content"
              rows={8}
              placeholder="1. First step...&#10;2. Second step..."
              required
            />
          </div>

          <div>
            <label htmlFor="image_url" className="font-semibold">
              Image URL (Optional)
            </label>
            <Input
              id="image_url"
              name="image_url"
              placeholder="https://example.com/image.png"
            />
          </div>

          <DialogFooter>
            <div className="w-full text-center mr-4">
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
            <Button type="submit">Create Article</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
