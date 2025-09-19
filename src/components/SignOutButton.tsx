"use client";

import { signout } from "@/app/auth/actions";
import { LogOut } from "lucide-react";

export default function SignoutButton() {
  return (
    <form action={signout} className="w-full">
      <button
        type="submit"
        className="flex cursor-pointer w-full items-center text-white relative group rounded-lg transition-colors duration-200"
      >
        <LogOut
          className={`
            stroke-[1.3] w-[22px] h-[22px] transition-colors duration-200
            group-hover:text-amber-400
            text-white
          `}
        />
        <span
          className={`
            no-underline text-[15px] font-primary tracking-wider ml-6
            transition-colors duration-200 text-white
          `}
        >
          Sign Out
        </span>
      </button>
    </form>
  );
}
