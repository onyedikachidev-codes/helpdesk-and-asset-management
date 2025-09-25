"use client";

import { useActionState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import AuthContainer from "@/components/AuthContainer";
import CPLogo from "../../../../public/images/cp_logo_colored.png";
import { requestPasswordReset } from "./actions";

const initialState = { error: "", success: "" };

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState(
    requestPasswordReset,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.success) {
      formRef.current?.reset();
    }
  }, [state.success]);

  return (
    <AuthContainer>
      <div className="flex flex-col items-center justify-center gap-6">
        <Image src={CPLogo} alt="logo" width={100} height={100} />
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">Forgot Password</h1>
          <p className="text-gray-600 text-lg mt-2">
            No worries, we&apos;ll send you reset instructions.
          </p>
        </div>

        <form action={formAction} ref={formRef} className="w-full space-y-4">
          <div className="flex flex-col gap-4">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="p-3 border border-gray-300 rounded"
            />
          </div>

          {state.error && (
            <p className="text-red-500 text-sm text-center">{state.error}</p>
          )}
          {state.success && (
            <p className="text-green-600 bg-green-50 p-3 rounded-md text-sm text-center">
              {state.success}
            </p>
          )}

          <button
            type="submit"
            className="py-3 w-full cursor-pointer bg-purple-800 text-white rounded-sm hover:bg-purple-700 transition"
          >
            Send Reset Link
          </button>
        </form>

        <Link
          href="/auth/login"
          className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>
      </div>
    </AuthContainer>
  );
}
