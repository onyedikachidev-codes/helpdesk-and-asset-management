"use client";

import { UserRound } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useMemo, useState } from "react";
import NotificationIcon from "./NotificationIcon";

type DashboardHeaderNavProps = {
  firstName: string;
  userRole: string;
};

const formatRole = (role: string) => {
  if (role === "it_staff") return "IT Staff";
  return role.charAt(0).toUpperCase() + role.slice(1);
};

export default function DashboardHeaderNav({
  firstName,
  userRole,
}: DashboardHeaderNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const pageTitle = useMemo(() => {
    if (!pathname) return "Dashboard";
    const parts = pathname.split("/");
    const lastPart = parts[parts.length - 1];
    return lastPart.replace("-", " ") || "Dashboard";
  }, [pathname]);

  return (
    <>
      <h1 className="font-primary font-bold text-lg text-purple-800 mr-auto capitalize">
        {pageTitle}
      </h1>

      <div className="flex gap-2.5 items-center mr-2">
        <NotificationIcon />
        <div className="flex items-center gap-2.5">
          <div className="cursor-pointer" onClick={() => setOpen(true)}>
            {false ? (
              <Image
                src={""} // You would pass a picture URL prop here
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
            {/* 3. Use the props to display the user's name and role */}
            <span className="font-semibold text-purple-700">{firstName}</span>
            <span className="text-xs font-light">{formatRole(userRole)}</span>
          </div>
        </div>
      </div>
    </>
  );
}
