// frontend/src/components/layout/Navbar.jsx

import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { logout } from "../../api/auth";

function Navbar() {
  const navigate = useNavigate();

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const { user, isAuthenticated, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [loggingOut, setLoggingOut] = useState(false);

  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";

  async function handleLogout() {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      await logout();

      // Clear client-side auth state
      await signOut();

      toast.success("Logged out successfully");

      navigate({
        to: "/login",
      });
    } catch (error) {
      console.error("Logout failed:", error);

      toast.error(error?.message || "Failed to logout. Please try again.");
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <nav className="border-b bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Application Name */}
        <Link
          to={isAuthenticated ? "/dashboard" : "/"}
          className="text-xl font-bold text-gray-900 dark:text-white"
        >
          SQL Coach
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            <span className="material-icons text-gray-700 dark:text-gray-200">
              {theme === "dark" ? "light_mode" : "dark_mode"}
            </span>
          </button>

          {!isAuthenticated ? (
            <>
              {/* Login page → show Signup */}
              {isLoginPage && (
                <Link
                  to="/signup"
                  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  Sign up
                </Link>
              )}

              {/* Signup page → show Login */}
              {isSignupPage && (
                <Link
                  to="/login"
                  className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
                >
                  Login
                </Link>
              )}
            </>
          ) : (
            /* Profile Menu */
            <div className="group relative">
              {/* Profile Icon */}
              <button
                type="button"
                className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                title={user?.email || "Profile"}
              >
                <span className="material-icons text-gray-700 dark:text-gray-200">
                  person
                </span>
              </button>

              {/* Dropdown */}
              <div className="invisible absolute right-0 top-full z-50 w-56 pt-2 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100">
                <div className="rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                  {/* User Info */}
                  <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                    <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                      {user?.user_metadata?.name || "User"}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500 dark:text-gray-400">
                      {user?.email}
                    </p>
                  </div>

                  {/* Profile */}
                  <Link
                    to="/profile"
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                  >
                    <span className="material-icons text-[20px]">person</span>

                    <span>Profile</span>
                  </Link>

                  {/* Change Password - Disabled */}
                  <button
                    type="button"
                    disabled
                    className="flex w-full cursor-not-allowed items-center gap-3 px-4 py-2 text-left text-sm text-gray-400 dark:text-gray-600"
                  >
                    <span className="material-icons text-[20px]">lock</span>

                    <span>Change password</span>
                  </button>

                  {/* Logout */}
                  <div className="my-1 border-t border-gray-200 dark:border-gray-700" />

                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-3 px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:text-red-400 dark:hover:bg-gray-800"
                  >
                    <span className="material-icons text-[20px]">logout</span>

                    <span>{loggingOut ? "Logging out..." : "Logout"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
