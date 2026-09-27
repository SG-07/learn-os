// frontend/src/pages/Settings.jsx

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { changePassword, adminChangePassword } from "../api/auth";

function Settings() {
  const { user } = useAuth();
  const userRole = (user?.user_metadata?.role || user?.app_metadata?.role || "").toLowerCase();
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

    // Validation
    if (!adminForm.email) {
      setMessage({ type: "error", text: "Email is required" });
      return;
    }

    if (!adminForm.newPassword) {
      setMessage({ type: "error", text: "New password is required" });
      return;
    }

    if (adminForm.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    if (adminForm.newPassword !== adminForm.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    try {
      setLoading(true);
      await adminChangePassword(adminForm.email, adminForm.newPassword);
      setMessage({ type: "success", text: "User password updated successfully" });
      setAdminForm({
        email: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Failed to update password",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    // Validation
    if (!userForm.currentPassword) {
      setMessage({ type: "error", text: "Current password is required" });
      return;
    }

    if (!userForm.newPassword) {
      setMessage({ type: "error", text: "New password is required" });
      return;
    }

    if (userForm.newPassword.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters" });
      return;
    }

    if (userForm.newPassword !== userForm.confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (userForm.currentPassword === userForm.newPassword) {
      setMessage({
        type: "error",
        text: "New password must be different from current password",
      });
      return;
    }

    try {
      setLoading(true);
      await changePassword(userForm.currentPassword, userForm.newPassword);
      setMessage({ type: "success", text: "Password changed successfully" });
      setUserForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error?.message || "Failed to change password",
      });
    } finally {
      setLoading(false);
    }
  };

  const isAdminOwnPasswordFormValid =
    userForm.currentPassword.trim() &&
    userForm.newPassword.trim() &&
    userForm.confirmPassword.trim();

  const isAdminOtherPasswordFormValid =
    adminForm.email.trim() &&
    adminForm.newPassword.trim() &&
    adminForm.confirmPassword.trim();

  const isUserFormValid =
    userForm.currentPassword.trim() &&
    userForm.newPassword.trim() &&
    userForm.confirmPassword.trim();

  return (
    <div className="min-h-full bg-gray-100 p-4 dark:bg-gray-950 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Change Password
        </h1>

        {/* Password Change Section */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Change Password
          </h2>

          {isAdmin && (
            <div className="mt-6 mb-6 space-y-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                What would you like to do?
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="adminMode"
                    value="own"
                    checked={adminMode === "own"}
                    onChange={(e) => {
                      setAdminMode(e.target.value);
                      setMessage({ type: "", text: "" });
                    }}
                    className="h-4 w-4 cursor-pointer"
                  />
                  <span className="cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                    Reset my password
                  </span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="adminMode"
                    value="other"
                    checked={adminMode === "other"}
                    onChange={(e) => {
                      setAdminMode(e.target.value);
                      setMessage({ type: "", text: "" });
                    }}
                    className="h-4 w-4 cursor-pointer"
                  />
                  <span className="cursor-pointer text-sm text-gray-700 dark:text-gray-300">
                    Reset another user's password
                  </span>
                </label>
              </div>
            </div>
          )}

          {isAdmin && adminMode === "own" ? (
            <form onSubmit={handleUserSubmit} className="mt-6 space-y-5">
              {/* Message Alert */}
              {message.text && (
                <div
                  className={`rounded-lg p-4 text-sm font-medium ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Current Password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={userForm.currentPassword}
                  onChange={handleUserFormChange}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  placeholder="Enter your current password"
                />
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={userForm.newPassword}
                  onChange={handleUserFormChange}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  placeholder="Enter your new password"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Minimum 6 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={userForm.confirmPassword}
                  onChange={handleUserFormChange}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  placeholder="Confirm your new password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isAdminOwnPasswordFormValid}
                className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:focus:ring-offset-gray-950"
              >
                {loading ? "Updating..." : "Change Password"}
              </button>
            </form>
          ) : isAdmin && adminMode === "other" ? (
            <form onSubmit={handleAdminSubmit} className="mt-6 space-y-5">
              {/* Message Alert */}
              {message.text && (
                <div
                  className={`rounded-lg p-4 text-sm font-medium ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Email */}
              <div>
                <label
                  htmlFor="adminEmail"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  User Email
                </label>
                <input
                  type="email"
                  id="adminEmail"
                  name="email"
                  value={adminForm.email}
                  onChange={handleAdminFormChange}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  placeholder="Enter user email"
                />
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="adminNewPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="adminNewPassword"
                  name="newPassword"
                  value={adminForm.newPassword}
                  onChange={handleAdminFormChange}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  placeholder="Enter new password"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Minimum 6 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="adminConfirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="adminConfirmPassword"
                  name="confirmPassword"
                  value={adminForm.confirmPassword}
                  onChange={handleAdminFormChange}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  placeholder="Confirm new password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isAdminOtherPasswordFormValid}
                className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:focus:ring-offset-gray-950"
              >
                {loading ? "Updating..." : "Update Password"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleUserSubmit} className="mt-6 space-y-5">
              {/* Message Alert */}
              {message.text && (
                <div
                  className={`rounded-lg p-4 text-sm font-medium ${
                    message.type === "success"
                      ? "bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                      : "bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Current Password */}
              <div>
                <label
                  htmlFor="currentPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  value={userForm.currentPassword}
                  onChange={handleUserFormChange}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  placeholder="Enter your current password"
                />
              </div>

              {/* New Password */}
              <div>
                <label
                  htmlFor="userNewPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  New Password
                </label>
                <input
                  type="password"
                  id="userNewPassword"
                  name="newPassword"
                  value={userForm.newPassword}
                  onChange={handleUserFormChange}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  placeholder="Enter your new password"
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Minimum 6 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="userConfirmPassword"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="userConfirmPassword"
                  name="confirmPassword"
                  value={userForm.confirmPassword}
                  onChange={handleUserFormChange}
                  required
                  className="mt-2 w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                  placeholder="Confirm your new password"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !isUserFormValid}
                className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:focus:ring-offset-gray-950"
              >
                {loading ? "Updating..." : "Change Password"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Settings;
