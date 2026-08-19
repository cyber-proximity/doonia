"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User, Phone, Globe } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const COUNTRIES = [
  "Ghana", "Nigeria", "China",
  "Afghanistan", "Albania", "Algeria", "Angola", "Argentina", "Australia",
  "Austria", "Bangladesh", "Belgium", "Benin", "Bolivia", "Brazil",
  "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Chad",
  "Chile", "Colombia", "Congo", "Côte d'Ivoire", "Cuba", "Denmark",
  "Ecuador", "Egypt", "Ethiopia", "Finland", "France", "Gabon", "Gambia",
  "Germany", "Guinea", "Haiti", "Hungary", "India", "Indonesia", "Iran",
  "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
  "Kenya", "Kuwait", "Lebanon", "Liberia", "Libya", "Madagascar", "Malawi",
  "Malaysia", "Mali", "Mauritania", "Mexico", "Morocco", "Mozambique",
  "Myanmar", "Namibia", "Nepal", "Netherlands", "New Zealand", "Niger",
  "Norway", "Oman", "Pakistan", "Peru", "Philippines", "Poland",
  "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saudi Arabia",
  "Senegal", "Sierra Leone", "Singapore", "Somalia", "South Africa",
  "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Sweden",
  "Switzerland", "Syria", "Tanzania", "Thailand", "Togo", "Tunisia",
  "Turkey", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom",
  "United States", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe",
];

const passwordRules = z
  .string()
  .min(8, "Must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain an uppercase letter")
  .regex(/[0-9]/, "Must contain a number")
  .regex(/[@$!%*#?&]/, "Must contain a special character (@$!%*#?&)");

const schema = z
  .object({
    name:                  z.string().min(2, "Name must be at least 2 characters"),
    email:                 z.string().email("Enter a valid email address"),
    phone:                 z.string().optional(),
    country:               z.string().optional(),
    password:              passwordRules,
    password_confirmation: z.string(),
  })
  .refine((d) => d.password === d.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const { register: registerUser, getApiError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError("");
    try {
      await registerUser({
        name:                  data.name,
        email:                 data.email,
        phone:                 data.phone ?? "",
        country:               data.country ?? "",
        password:              data.password,
        password_confirmation: data.password_confirmation,
      });
    } catch (err) {
      setServerError(getApiError(err));
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 md:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-500 mt-2 text-sm">Join Doonnia and start shopping today</p>
        </div>

        {serverError && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Full name</label>
            <div className="relative">
              <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register("name")}
                type="text"
                placeholder="John Doe"
                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition bg-gray-50"
              />
            </div>
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register("email")}
                type="email"
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition bg-gray-50"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register("phone")}
                  type="tel"
                  placeholder="+233 20 000 0000"
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition bg-gray-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Country <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <div className="relative">
                <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <select
                  {...register("country")}
                  className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition bg-gray-50 appearance-none"
                >
                  <option value="">Select…</option>
                  {COUNTRIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Min. 8 characters"
                className="w-full pl-10 pr-10 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition bg-gray-50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register("password_confirmation")}
                type={showPassword ? "text" : "password"}
                placeholder="Repeat your password"
                className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-transparent transition bg-gray-50"
              />
            </div>
            {errors.password_confirmation && (
              <p className="mt-1 text-xs text-red-500">{errors.password_confirmation.message}</p>
            )}
          </div>

          <p className="text-xs text-gray-400">
            By creating an account, you agree to our{" "}
            <Link href="#" className="text-primary-500 hover:underline">Terms of Service</Link> and{" "}
            <Link href="#" className="text-primary-500 hover:underline">Privacy Policy</Link>.
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-colors shadow-sm"
          >
            {isSubmitting ? "Creating account…" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-500 font-semibold hover:text-primary-600">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
