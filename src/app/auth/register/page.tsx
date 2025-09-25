"use client";

import AuthContainer from "@/components/AuthContainer";
import Image from "next/image";
import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // 1. Import icons
import { useRouter } from "next/navigation";

import CPLogo from "../../../../public/images/cp_logo_colored.png";
import { signup } from "./actions";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Client-side validation for password match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    const result = await signup(formData);

    if (result.error) {
      setErrorMessage(result.error);
    } else if (result.success) {
      // On success, redirect to login with a success message
      router.push(
        "/login?message=Account created! Please check your email to confirm and then log in."
      );
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

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">
            Signup to Helpdesk
          </h1>

          <p className="text-gray-600 text-lg">
            Please Fill the form to create an account.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col gap-4">
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              className="p-3 border border-gray-300 rounded"
              required // 2. All fields are now required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="p-3 border border-gray-300 rounded"
              required
            />
            {/* 3. Password input with visibility toggle */}
            <div className="relative w-full">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="p-3 border border-gray-300 rounded w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {/* 3. Confirm Password input with visibility toggle */}
            <div className="relative w-full">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="p-3 border border-gray-300 rounded w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600"
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* 4. The role dropdown has been removed */}

            {errorMessage && (
              <p className="text-red-500 text-center">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="py-3 cursor-pointer bg-purple-800 text-white rounded-sm hover:bg-purple-700 transition"
            >
              Create Account
            </button>

            <p className="text-sm text-center text-gray-600">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-purple-700 hover:underline font-semibold"
              >
                Login here.
              </Link>
            </p>
          </div>
        </form>
      </div>
    </AuthContainer>
  );
}
