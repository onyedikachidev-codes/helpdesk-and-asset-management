"use client";

import { createClient } from "@/lib/supabase/client";
import { User } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
// 1. Import the new server action
import { updateAvatarUrl } from "@/app/dashboard/profile/actions";

type Profile = {
  id: string;
  avatar_url: string | null;
  full_name: string | null;
};

export default function AvatarUpload({ profile }: { profile: Profile }) {
  const supabase = createClient();
  const router = useRouter(); // We'll keep this for the refresh, though revalidatePath also works
  const [uploading, setUploading] = useState(false);

  const avatarUrl = profile.avatar_url
    ? supabase.storage.from("avatars").getPublicUrl(profile.avatar_url).data
        .publicUrl
    : null;

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];
      const fileExt = file.name.split(".").pop();
      const filePath = `${profile.id}/${new Date().getTime()}.${fileExt}`;

      // Upload the file to the 'avatars' bucket
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Call the Server Action to update the profile
      await updateAvatarUrl(filePath);

      // router.refresh() is good for an immediate client-side refresh
      router.refresh();
    } catch (error) {
      alert("Error uploading avatar!");
      console.error(error);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 overflow-hidden">
        {avatarUrl ? (
          <Image src={avatarUrl} alt="Avatar" fill className="object-cover" />
        ) : (
          <User className="w-12 h-12 text-gray-500" />
        )}
      </div>
      <label
        htmlFor="avatar-upload"
        className="cursor-pointer bg-gray-200 text-sm font-semibold py-1 px-3 rounded-md hover:bg-gray-300"
      >
        {uploading ? "Uploading..." : "Change"}
      </label>
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
        className="hidden"
      />
    </div>
  );
}
