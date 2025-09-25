"use client";

import { useState } from "react";
import { Button } from "./ui/button";
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

  // FIX: Make the role check case-insensitive by converting the user's role to uppercase.
  // This will correctly match 'it_staff', 'IT_STAFF', 'It_Staff', etc.
  if (userRole?.toUpperCase() !== "IT_STAFF") {
    return null;
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
