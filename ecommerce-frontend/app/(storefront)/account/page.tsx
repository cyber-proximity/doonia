"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { updateProfile, updatePassword } from "@/lib/services/account";

const profileSchema = z.object({
  name:  z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().optional(),
});

const passwordSchema = z
  .object({
    currentPassword:      z.string().min(1, "Current password is required"),
    password:             z.string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[0-9]/, "Must include a number")
      .regex(/[@$!%*#?&]/, "Must include a special character (@$!%*#?&)"),
    passwordConfirmation: z.string(),
  })
  .refine((d) => d.password === d.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type ProfileData   = z.infer<typeof profileSchema>;
type PasswordData  = z.infer<typeof passwordSchema>;

export default function ProfilePage() {
  const { user, setAuth, token } = useAuthStore();
  const [profileSaved, setProfileSaved]   = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [profileError, setProfileError]   = useState("");
  const [passwordError, setPasswordError] = useState("");

  const profileForm = useForm<ProfileData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? "", phone: user?.phone ?? "" },
  });

  const passwordForm = useForm<PasswordData>({
    resolver: zodResolver(passwordSchema),
  });

  async function onProfileSubmit(data: ProfileData) {
    setProfileError("");
    try {
      const updatedUser = await updateProfile(data);
      if (token) setAuth(updatedUser, token);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch {
      setProfileError("Failed to update profile. Please try again.");
    }
  }

  async function onPasswordSubmit(data: PasswordData) {
    setPasswordError("");
    try {
      await updatePassword(data);
      passwordForm.reset();
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setPasswordError(msg ?? "Failed to update password.");
    }
  }

  return (
    <div className="space-y-6">
      {/* Profile info */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-900 text-lg mb-5">Personal Information</h2>

        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input
                {...profileForm.register("name")}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              {profileForm.formState.errors.name && (
                <p className="text-red-500 text-xs mt-1">{profileForm.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                value={user?.email ?? ""}
                disabled
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 text-gray-400 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
              <input
                {...profileForm.register("phone")}
                type="tel"
                placeholder="+233 20 000 0000"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
            </div>
          </div>

          {profileError && <p className="text-red-500 text-sm">{profileError}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={profileForm.formState.isSubmitting}
              className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {profileForm.formState.isSubmitting ? "Saving…" : "Save Changes"}
            </button>
            {profileSaved && (
              <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                <CheckCircle size={16} /> Saved!
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Change password */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="font-bold text-gray-900 text-lg mb-5">Change Password</h2>

        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Current Password</label>
            <input
              {...passwordForm.register("currentPassword")}
              type="password"
              className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
            />
            {passwordForm.formState.errors.currentPassword && (
              <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.currentPassword.message}</p>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">New Password</label>
              <input
                {...passwordForm.register("password")}
                type="password"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              {passwordForm.formState.errors.password && (
                <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.password.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm New Password</label>
              <input
                {...passwordForm.register("passwordConfirmation")}
                type="password"
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-300"
              />
              {passwordForm.formState.errors.passwordConfirmation && (
                <p className="text-red-500 text-xs mt-1">{passwordForm.formState.errors.passwordConfirmation.message}</p>
              )}
            </div>
          </div>

          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={passwordForm.formState.isSubmitting}
              className="px-6 py-2.5 bg-primary-500 hover:bg-primary-600 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors"
            >
              {passwordForm.formState.isSubmitting ? "Updating…" : "Update Password"}
            </button>
            {passwordSaved && (
              <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                <CheckCircle size={16} /> Password updated!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
