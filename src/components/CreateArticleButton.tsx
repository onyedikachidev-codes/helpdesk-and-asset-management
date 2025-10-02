"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import CreateArticleModal from "./CreateArticleModal";

type Category = {
  id: number;
  name: string;
};

type CreateArticleButtonProps = {
  userRole: string | null;
  categories: Category[];
};

export default function CreateArticleButton({
  userRole,
  categories,
}: CreateArticleButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // FIX: Updated the check to be case-insensitive and to include the 'admin' role.
  // This will ensure the button is visible to all authorized users.
  const canCreateArticle =
    userRole?.toLowerCase() === "it_staff" ||
    userRole?.toLowerCase() === "admin";

  if (!canCreateArticle) {
    return null; // Correctly hide the button for unauthorized roles like 'employee'.
  }

  return (
    <>
      <Button
        className="bg-purple-800 hover:bg-purple-700"
        onClick={() => setIsModalOpen(true)}
      >
        <PlusCircle className="mr-2 h-4 w-4" />
        Create Article
      </Button>
      <CreateArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
      />
    </>
  );
}
