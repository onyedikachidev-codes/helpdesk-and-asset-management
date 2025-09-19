import AuthContainer from "@/components/AuthContainer";
import Image from "next/image";
import React from "react";

import CPLogo from "../../../public/images/cp_logo_colored.png";
import Link from "next/link";

export default function AuthPage() {
  return (
    <AuthContainer>
      <div className="flex flex-col items-center justify-center gap-6">
        <Image
          src={CPLogo}
          alt="logo"
          width={100}
          height={100}
          className="h-auto m-0 border-r border-white/25 pr-3.5 cursor-pointer"
        />
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome to Helpdesk
        </h1>
        <p className="text-gray-600 text-lg">
          Your central hub for all IT support requests and asset management.
          Please log in to create a new ticket, track an existing issue, or view
          your assigned equipment.
        </p>
        <div className="w-full flex flex-col gap-3">
          <Link
            href="/auth/register"
            className="w-full py-3 bg-purple-800 text-white rounded-sm hover:bg-purple-700 transition"
          >
            Create an Account
          </Link>
          <Link
            href="/auth/login"
            className="w-full py-3 border border-purple-800 text-purple-700 rounded-sm hover:border-purple-700 hover:bg-gray-200 transition"
          >
            Already Have an account? Login
          </Link>
        </div>
      </div>
    </AuthContainer>
  );
}
