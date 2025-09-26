"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import AuthContainer from "@/components/AuthContainer";
import CPLogo from "../../../../public/images/cp_logo_colored.png";
import { signup } from "./actions";

const initialState = { error: "", success: false };

export default function RegisterPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(signup, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // This effect will run when the server action returns a response.
  useEffect(() => {
    if (state.success) {
      // FIX: This is the corrected redirect logic.
      // It uses the new, correct message and pushes the user to the login page.
      const message = "Account created successfully. Please log in.";
      router.push(`/auth/login?message=${encodeURIComponent(message)}`);
    }
  }, [state.success, router]);

  return (
    <AuthContainer>
      <div className="flex flex-col items-center justify-center gap-6">
        <Image
          src={CPLogo}
          alt="logo"
          width={100}
          height={100}
          className="h-auto"
        />
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-800">
            Signup to Helpdesk
          </h1>
          <p className="text-gray-600">
            Please fill the form to create an account.
          </p>
        </div>

        <form action={formAction} className="w-full">
          <div className="flex flex-col gap-4">
            <input
              name="fullName"
              type="text"
              placeholder="Full Name"
              className="p-3 border border-gray-300 rounded"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              className="p-3 border border-gray-300 rounded"
              required
            />
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

            {state.error && (
              <p className="text-red-500 text-center">{state.error}</p>
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
