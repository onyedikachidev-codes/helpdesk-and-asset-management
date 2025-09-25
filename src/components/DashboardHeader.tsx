import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Header from "./Header";
import Navbar from "./Navbar";

export default async function DashboardHeader() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  // Fetch profile and notification DETAILS in parallel
  const [profileRes, notificationsRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("full_name, role, avatar_url")
      .eq("id", user.id)
      .single(),
    // Fetch the 5 most recent notifications
    supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const { data: profile } = profileRes;
  const notifications = notificationsRes.data ?? [];

  // Calculate unread count from the fetched notifications
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const avatarUrl = profile?.avatar_url
    ? supabase.storage.from("avatars").getPublicUrl(profile.avatar_url).data
        .publicUrl
    : null;

  return (
    <Header>
      <Navbar
        firstName={profile?.full_name?.split(" ")[0] ?? "User"}
        userRole={profile?.role ?? "employee"}
        avatarUrl={avatarUrl}
        notifications={notifications} // Pass the full notifications array
        unreadCount={unreadCount}
      />
    </Header>
  );
}
