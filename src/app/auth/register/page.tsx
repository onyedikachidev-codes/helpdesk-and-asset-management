import AuthContainer from "@/components/AuthContainer";
import Image from "next/image";
import React from "react";

import CPLogo from "../../../../public/images/cp_logo_colored.png";
import Link from "next/link";
import { signup } from "./actions";

export default function RegisterPage() {
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
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Signup to Helpdesk
          </h1>
          <p className="text-gray-600 text-lg">
            Please Fill the form to create an account.
          </p>
        </div>

        <form action={signup} className="w-full">
          <div className="flex flex-col gap-4">
            <input
              name="fullName" // <-- ADD THIS
              type="text"
              placeholder="Full Name"
              className="p-3 border border-gray-300 rounded"
              required
            />
            <input
              name="email" // <-- ADD THIS
              type="email"
              placeholder="Email"
              className="p-3 border border-gray-300 rounded"
              required
            />
            <input
              name="password" // <-- ADD THIS
              type="password"
              placeholder="Password"
              className="p-3 border border-gray-300 rounded"
              required
            />
            <input
              // This field isn't used by the server action, but it's good practice
              name="confirmPassword" // <-- ADD THIS
              type="password"
              placeholder="Confirm Password"
              className="p-3 border border-gray-300 rounded"
            />
            <select
              name="role" // This one is correct
              className="p-3 border border-gray-300 rounded bg-white"
            >
              <option value="employee">Employee</option>
              <option value="it_staff">IT Staff</option>
            </select>
            <button className="py-3 cursor-pointer bg-purple-800 text-white rounded-sm hover:bg-purple-700 transition">
              Create Account
            </button>
          </div>
        </form>
      </div>
    </AuthContainer>
  );
}
