import { Bell } from "lucide-react";
import React from "react";

export default function NotificationIcon() {
  return (
    <div className="p-2 rounded-full cursor-pointer">
      <div className="relative">
        <Bell className="h-6 w-6 text-gray-500" />

        <span className="absolute top-0 -right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500"></span>
      </div>
    </div>
  );
}
