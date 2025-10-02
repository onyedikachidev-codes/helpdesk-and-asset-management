"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import {
  LayoutGrid, // Dashboard
  Ticket, // My Tickets, Ticket Queue
  Book, // Knowledge Base
  HardDrive, // Asset Management
  Users, // User Managemente
  Settings, // Settings
  HelpCircle, // Support
  UserCircle,
} from "lucide-react";

import CPLogo from "../../public/images/cp_logo_colored.png";
import SignoutButton from "./SignOutButton";

// Central configuration for all possible menu items and their permissions
const menuConfig = [
  {
    name: "Dashboard",
    icon: LayoutGrid,
    path: `/dashboard`,
    exact: true,
    roles: ["employee", "it_staff", "admin"],
  },
  {
    name: "My Tickets",
    icon: Ticket,
    path: `/dashboard/tickets`,
    roles: ["employee"],
  },
  {
    name: "My Tickets",
    icon: Ticket,
    path: `/dashboard/tickets/it-staff`,
    roles: ["it_staff"],
  },
  {
    name: "My Tickets",
    icon: Ticket,
    path: `/dashboard/tickets/admin`,
    roles: ["admin"],
  },
  {
    name: "My Assets",
    icon: HardDrive,
    path: `/dashboard/assets`,
    exact: true,
    roles: ["employee", "it_staff", "admin"],
  },
  {
    name: "Ticket Queue",
    icon: Ticket,
    path: "/dashboard/ticket-queue",

    roles: ["it_staff", "admin"],
  },
  {
    name: "Knowledge Base",
    icon: Book,
    path: `/dashboard/knowledge-base`,
    roles: ["employee", "it_staff", "admin"],
  },
  // IT Staff & Admin Section

  {
    name: "Support",
    icon: HelpCircle,
    path: "/dashboard/support",
    marginClass: "mt-16",
    roles: ["employee"],
  },

  {
    name: "Asset Management",
    icon: HardDrive,
    path: "/dashboard/assets-management",
    marginClass: "mt-16",
    roles: ["it_staff", "admin"],
  },
  // Admin Only Section
  {
    name: "User Management",
    icon: Users,
    path: "/dashboard/user-management",
    roles: ["admin"],
  },

  {
    name: "My Profile",
    icon: UserCircle,
    path: "/dashboard/profile",
    roles: ["employee", "it_staff", "admin"],
  },
];

// Define the type for the props the component will accept
type SidebarProps = {
  role: "employee" | "it_staff" | "admin";
};

function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Filter the menu items based on the user's role before rendering
  const visibleMenus = menuConfig.filter((menu) => menu.roles.includes(role));

  return (
    <div className="w-[16rem] bg-purple-800 shadow-md flex flex-col">
      <div className="block font-bold text-base text-white mt-7 mx-10">
        <div className="flex justify-center items-center mb-5">
          <Image
            src={CPLogo}
            alt="logo"
            width={50}
            height={50}
            className="h-auto m-0 border-r border-white/25 pr-3.5 cursor-pointer"
            onClick={() => router.push("/dashboard")}
          />
          <span className="text-md pl-4 font-light tracking-[3.2px] -top-3 text-white">
            HELPDESK
          </span>
        </div>
      </div>

      <aside>
        <nav className="flex flex-col gap-8 mt-7 text-base">
          {visibleMenus.map((menu) => {
            const Icon = menu.icon;
            const isActive = menu.exact
              ? pathname === menu.path
              : pathname?.startsWith(menu.path) ?? false;

            // This is for the margin
            const marginClass = menu.marginClass || ""; // Use marginClass from config

            return (
              <Link key={menu.name} href={menu.path}>
                <div
                  className={`
                    ml-10 flex items-center text-white relative group rounded-lg transition-colors duration-200 ${marginClass}`}
                >
                  <Icon
                    className={`
                      stroke-[1.3] w-[22px] h-[22px] transition-colors duration-200
                      group-hover:text-amber-400
                      ${isActive ? "text-amber-400 stroke-[1.8]" : "text-white"}
                    `}
                  />
                  <span
                    className={`
                      no-underline text-[15px] font-primary tracking-wider ml-6
                      transition-colors duration-200 ${
                        isActive ? "text-amber-400" : "text-white"
                      }
                    `}
                  >
                    {menu.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="mt-auto ml-10 mb-4">
        <SignoutButton />
      </div>
    </div>
  );
}

export default Sidebar;
