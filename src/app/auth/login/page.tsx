"use client";

import AuthContainer from "@/components/AuthContainer";
import Image from "next/image";
import React, { useState } from "react";

import CPLogo from "../../../../public/images/cp_logo_colored.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "./actions";

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result.error) {
      setErrorMessage(result.error);
    } else if (result.success) {
      // On successful login, the client-side router handles the redirect.
      router.push("/dashboard");
    }
  };
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
        <h1 className="text-3xl font-bold text-gray-800">Login to Helpdesk</h1>
        <p className="text-gray-600 text-lg">
          Please Fill the form to login to your account.
        </p>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col gap-4">
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="p-3 border border-gray-300 rounded"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              className="p-3 border border-gray-300 rounded"
            />
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <Link href="/auth/forgot-password " className="self-end">
              <span className="text-sm text-purple-700 hover:underline">
                Forgot Password?
              </span>
            </Link>
            <button className="py-3 cursor-pointer bg-purple-800 text-white rounded-sm hover:bg-purple-700 transition">
              Login
            </button>
          </div>
        </form>
      </div>
    </AuthContainer>
  );
}
