"use client";

import { useState, useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import AuthContainer from "@/components/AuthContainer";
import CPLogo from "../../../../public/images/cp_logo_colored.png";
import { updatePassword } from "./actions";

const initialState = { error: "", success: "" };

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(updatePassword, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        router.push("/auth/login");
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [state.success, router]);

  return (
    <AuthContainer>
      <div className="flex flex-col items-center justify-center gap-6">
        <Image src={CPLogo} alt="logo" width={100} height={100} />
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Set New Password</h1>
          <p className="text-gray-600 mt-2">
            Please enter and confirm your new password below.
          </p>
        </div>

        {state.success ? (
          <div className="text-center bg-green-50 p-6 rounded-lg w-full">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-green-700 font-semibold">{state.success}</p>
            <p className="text-gray-600 text-sm mt-2">
              Redirecting you to the login page...
            </p>
          </div>
        ) : (
          <form action={formAction} className="w-full">
            <div className="flex flex-col gap-4">
              <div className="relative w-full">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
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
                  placeholder="Confirm New Password"
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
                Update Password
              </button>
            </div>
          </form>
        )}
      </div>
    </AuthContainer>
  );
}
