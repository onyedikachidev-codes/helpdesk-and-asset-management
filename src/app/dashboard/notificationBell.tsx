"use client";

import { useState, useRef, useEffect, RefObject } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { markNotificationsAsRead } from "@/app/dashboard/notifications/actions";

// --- THIS IS THE FIX ---
// Allow the ref's type to be `HTMLDivElement | null` to match how `useRef` is initialized.
function useOnClickOutside(
  ref: RefObject<HTMLDivElement | null>,
  handler: (event: MouseEvent | TouchEvent) => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

type Notification = {
  id: number;
  message: string;
  link_to: string | null;
  is_read: boolean;
  created_at: string;
};

type NotificationBellProps = {
  notifications: Notification[];
  unreadCount: number;
};

export default function NotificationBell({
  notifications,
  unreadCount,
}: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markNotificationsAsRead();
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={handleToggle} className="p-2 rounded-full cursor-pointer">
        <div className="relative">
          <Bell className="h-6 w-6 text-gray-500" />
          {unreadCount > 0 && (
            <span className="absolute top-0 -right-0 block h-2 w-2 rounded-full ring-2 ring-white bg-red-500" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-10">
          <div className="p-4 border-b">
            <h3 className="font-semibold text-gray-800">Notifications</h3>
          </div>
          <div className="py-2 max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <Link
                  key={notif.id}
                  href={notif.link_to ?? "#"}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-start px-4 py-3 hover:bg-gray-100 ${
                    !notif.is_read ? "font-bold" : ""
                  }`}
                >
                  <div className="flex-shrink-0 pt-1">
                    <CheckCheck
                      size={16}
                      className={
                        !notif.is_read ? "text-blue-500" : "text-gray-400"
                      }
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-gray-700 leading-tight">
                      {notif.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDistanceToNow(new Date(notif.created_at), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <div className="text-center py-6">
                <p className="text-sm text-gray-500">
                  You have no notifications.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
