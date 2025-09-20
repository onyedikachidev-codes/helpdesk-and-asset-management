"use client";

import NotificationBell from "@/app/dashboard/notificationBell";
import { UserRound } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useMemo } from "react";

type Notification = {
  id: number;
  message: string;
  link_to: string | null;
  is_read: boolean;
  created_at: string;
};

type NavbarProps = {
  firstName: string;
  userRole: string;
  avatarUrl: string | null;
  notifications: Notification[];
  unreadCount: number;
};

const formatRole = (role: string) => {
  if (role === "it_staff") return "IT Staff";
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export default function Navbar({
  firstName,
  userRole,
  avatarUrl,
  notifications,
  unreadCount,
}: NavbarProps) {
  const pathname = usePathname();

  const pageTitle = useMemo(() => {
    if (!pathname) return "Dashboard";
    const parts = pathname.split("/");
    const lastPart = parts[parts.length - 1];
    return lastPart.replace(/-/g, " ") || "Dashboard";
  }, [pathname]);

  return (
    <>
      <h1 className="font-primary font-bold text-lg text-purple-800 mr-auto capitalize">
        {pageTitle}
      </h1>

      <div className="flex gap-2.5 items-center mr-2">
        <NotificationBell
          notifications={notifications}
          unreadCount={unreadCount}
        />

        <div className="flex items-center gap-2.5">
          <div className="cursor-pointer">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt="profile"
                width={36}
                height={36}
                className="h-9 w-9 rounded-full object-cover"
              />
            ) : (
              <div className="p-3 rounded-full bg-stone-300">
                <UserRound size={12} strokeWidth={1.5} />
              </div>
            )}
          </div>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-purple-700">{firstName}</span>
            <span className="text-xs font-light">{formatRole(userRole)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
