"use client";

import AuthContainer from "@/components/AuthContainer";
import Image from "next/image";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // 1. Import icons

import CPLogo from "../../../../public/images/cp_logo_colored.png";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { login } from "./actions";

export default function LoginPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false); // 2. State for password visibility

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result.error) {
      setErrorMessage(result.error);
    } else if (result.success) {
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
          className="h-auto m-0"
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
              required
              className="p-3 border border-gray-300 rounded"
            />
            {/* 3. Password input with visibility toggle */}
            <div className="relative w-full">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                className="p-3 border border-gray-300 rounded w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <Link href="/auth/forgot-password " className="self-end">
              <span className="text-sm text-purple-700 hover:underline">
                Forgot Password?
              </span>
            </Link>
            {/* 4. Explicitly set type="submit" to ensure Enter key works */}
            <button
              type="submit"
              className="py-3 cursor-pointer bg-purple-800 text-white rounded-sm hover:bg-purple-700 transition"
            >
              Login
            </button>
            <p className="text-sm text-center text-gray-600">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/register"
                className="text-purple-700 hover:underline font-semibold"
              >
                Register here.
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthContainer>
  );
}
