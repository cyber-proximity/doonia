"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const schema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[0-9]/, "Must include a number")
      .regex(/[@$!%*#?&]/, "Must include a special character (@$!%*#?&)"),
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type FormData = z.infer<typeof schema>;

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const token        = searchParams.get("token") ?? "";
  const email        = searchParams.get("email") ?? "";

  const [showPass,    setShowPass]    = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [done,        setDone]        = useState(false);
  const [serverError, setServerError] = useState("");

  const { resetPassword, getApiError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError("");
    if (!token || !email) {
      setServerError("Invalid or expired reset link. Please request a new one.");
      return;
    }
    try {
      await resetPassword({ email, token, password: data.password, password_confirmation: data.password_confirmation });
      setDone(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      setServerError(getApiError(err));
    }
  }

  if (done) {
    return (
      <div className="text-center space-y-4">
        <CheckCircle size={48} className="text-green-500 mx-auto" />
        <h1 className="text-2xl font-bold text-gray-900">Password reset!</h1>
        <p className="text-gray-500 text-sm">Your password has been updated. Redirecting you to sign in…</p>
        <Link href="/login" className="inline-block text-sm text-primary-500 font-semibold hover:underline">
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Set New Password</h1>
        <p className="text-gray-500 mt-2 text-sm">Choose a strong password for your account.</p>
        {email && <p className="text-xs text-gray-400 mt-1">{email}</p>}
      </div>

      {serverError && (
        <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {serverError}
          {serverError.toLowerCase().includes("invalid") && (
            <span>
              {" "}<Link href="/forgot-password" className="font-semibold underline">Request a new link</Link>
            </span>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register("password")}
              type={showPass ? "text" : "password"}
              placeholder="Min. 8 characters"
              className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 bg-gray-50"
            />
            <button
              type="button"
              onClick={() => setShowPass((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
          <div className="relative">
            <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register("password_confirmation")}
              type={showConfirm ? "text" : "password"}
              placeholder="Repeat your password"
              className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 bg-gray-50"
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password_confirmation && (
            <p className="mt-1 text-xs text-red-500">{errors.password_confirmation.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
        >
          {isSubmitting ? "Resetting…" : "Reset Password"}
        </button>
      </form>

      <p className="text-center mt-6 text-sm text-gray-500">
        Remember it?{" "}
        <Link href="/login" className="text-primary-500 font-semibold hover:underline">Sign In</Link>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
        <Suspense fallback={<p className="text-center text-gray-400 text-sm">Loading…</p>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
