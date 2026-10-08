// frontend/src/pages/Settings.jsx

import { useState } from "react";
import { KeyRound, Lock, Mail, Eye, EyeOff, CheckCircle2, AlertCircle, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { changePassword, adminChangePassword } from "../api/auth";
import BackButton from "../components/common/BackButton";

function Settings() {
  const { user } = useAuth();
  const userRole = (user?.app_metadata?.role || "").toLowerCase();
  const isAdmin = userRole === "admin";
  const [adminMode, setAdminMode] = useState("own"); // "own" or "other"

  const [adminForm, setAdminForm] = useState({
    email: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [userForm, setUserForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleAdminFormChange = (e) => {
    const { name, value } = e.target;
    setAdminForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUserFormChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!adminForm.email) {
      setMessage({ type: "error", text: "Target student/user email is required." });
      return;
    }

    if (!adminForm.newPassword) {
      setMessage({ type: "error", text: "New password is required." });
      return;
    }

    if (adminForm.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    if (adminForm.newPassword !== adminForm.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    try {
      setLoading(true);
      await adminChangePassword(adminForm.email, adminForm.newPassword);
      setMessage({ type: "success", text: "User password updated successfully!" });
      setAdminForm({
        email: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Failed to update user password.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!userForm.currentPassword) {
      setMessage({ type: "error", text: "Current password is required." });
      return;
    }

    if (!userForm.newPassword) {
      setMessage({ type: "error", text: "New password is required." });
      return;
    }

    if (userForm.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      return;
    }

    if (userForm.newPassword !== userForm.confirmPassword) {
      setMessage({ type: "error", text: "New password and confirmation do not match." });
      return;
    }

    if (userForm.currentPassword === userForm.newPassword) {
      setMessage({
        type: "error",
        text: "New password must be different from current password.",
      });
      return;
    }

    try {
      setLoading(true);
      await changePassword(userForm.currentPassword, userForm.newPassword);
      setMessage({ type: "success", text: "Password changed successfully!" });
      setUserForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Failed to change password. Please verify current password.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-slate-50/50 p-4 sm:p-8 dark:bg-slate-950">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <BackButton to="/dashboard" label="Dashboard" />
        </div>

        <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900 sm:p-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                Security & Password
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Update your account password or manage security credentials.
              </p>
            </div>
          </div>

          {/* Admin Mode Switcher */}
          {isAdmin && (
            <div className="mt-6 flex rounded-2xl border border-slate-200/80 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-slate-800/80">
              <button
                type="button"
                onClick={() => {
                  setAdminMode("own");
                  setMessage({ type: "", text: "" });
                }}
                className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                  adminMode === "own"
                    ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Change My Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setAdminMode("other");
                  setMessage({ type: "", text: "" });
                }}
                className={`flex-1 rounded-xl py-2 text-xs font-bold transition-all ${
                  adminMode === "other"
                    ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                Reset Student / User Password
              </button>
            </div>
          )}

          {/* Status Message */}
          {message.text && (
            <div
              className={`mt-6 flex items-start gap-2.5 rounded-2xl border p-4 text-xs font-semibold ${
                message.type === "success"
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-300"
                  : "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-950 dark:bg-rose-950/40 dark:text-rose-300"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
              )}
              <span>{message.text}</span>
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={isAdmin && adminMode === "other" ? handleAdminSubmit : handleUserSubmit}
            className="mt-6 space-y-4"
          >
            {isAdmin && adminMode === "other" ? (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Target User Email
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={adminForm.email}
                    onChange={handleAdminFormChange}
                    required
                    className="w-full rounded-2xl border border-slate-200/90 bg-white py-2.5 pl-10 pr-4 text-xs text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                    placeholder="user@example.com"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    value={userForm.currentPassword}
                    onChange={handleUserFormChange}
                    required
                    className="w-full rounded-2xl border border-slate-200/90 bg-white py-2.5 pl-10 pr-10 text-xs text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                New Password (minimum 6 characters)
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showNewPassword ? "text" : "password"}
                  name="newPassword"
                  value={isAdmin && adminMode === "other" ? adminForm.newPassword : userForm.newPassword}
                  onChange={isAdmin && adminMode === "other" ? handleAdminFormChange : handleUserFormChange}
                  required
                  className="w-full rounded-2xl border border-slate-200/90 bg-white py-2.5 pl-10 pr-10 text-xs text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={isAdmin && adminMode === "other" ? adminForm.confirmPassword : userForm.confirmPassword}
                  onChange={isAdmin && adminMode === "other" ? handleAdminFormChange : handleUserFormChange}
                  required
                  className="w-full rounded-2xl border border-slate-200/90 bg-white py-2.5 pl-10 pr-10 text-xs text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition hover:from-indigo-500 hover:to-indigo-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span>{loading ? "Updating..." : "Update Password"}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Settings;

