// frontend/src/components/layout/Navbar.jsx

import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  LayoutDashboard,
  Sun,
  Moon,
  User,
  KeyRound,
  ShieldCheck,
  LogOut,
  ChevronDown,
  ArrowRight,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { logout } from "../../api/auth";

function Navbar() {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const { user, isAuthenticated, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const userRole = (user?.app_metadata?.role || "").toLowerCase();
  const isAdmin = userRole === "admin";

  const [loggingOut, setLoggingOut] = useState(false);

  const isLoginPage = pathname === "/login";
  const isSignupPage = pathname === "/signup";

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    if (loggingOut) return;

    try {
      setLoggingOut(true);
      await logout();
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
      setDropdownOpen(false);
    }
  }

  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Student";
  const userInitials = userName.slice(0, 2).toUpperCase();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md transition-colors dark:border-slate-800/80 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <Link
            to={isAuthenticated ? "/dashboard" : "/"}
            className="group flex items-center gap-2.5 transition-transform active:scale-95"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 text-white shadow-md shadow-indigo-500/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-indigo-500/30">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                  SQL<span className="text-indigo-600 dark:text-indigo-400">Coach</span>
                </span>
                <span className="rounded-full bg-indigo-50 px-1.5 py-0.5 text-[10px] font-bold tracking-wide uppercase text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-300">
                  Edu
                </span>
              </div>
            </div>
          </Link>

          {/* Main Navigation Links for Authenticated Students */}
          {isAuthenticated && (
            <nav className="hidden items-center gap-1 md:flex">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  pathname === "/dashboard"
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-semibold"
                    : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>

              <Link
                to="/topics"
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  pathname.startsWith("/topics") || pathname.startsWith("/questions")
                    ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 font-semibold"
                    : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                }`}
              >
                <BookOpen className="h-4 w-4" />
                Courses & Topics
              </Link>

              <Link
                to="/sql-assistant"
                className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                  pathname === "/sql-assistant"
                    ? "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 font-semibold"
                    : "text-slate-600 hover:bg-slate-100/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/50 dark:hover:text-slate-200"
                }`}
              >
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                AI Assistant
              </Link>
            </nav>
          )}
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-slate-50 text-slate-600 transition-all hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-600 transition-transform duration-300 hover:-rotate-12" />
            )}
          </button>

          {!isAuthenticated ? (
            <div className="flex items-center gap-2">
              {isLoginPage && (
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-4 py-2 text-sm font-semibold text-white shadow-sm shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-indigo-600 hover:shadow-indigo-500/30 active:scale-95"
                >
                  Create Account
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}

              {isSignupPage && (
                <Link
                  to="/login"
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-400 hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                >
                  Sign In
                </Link>
              )}
            </div>
          ) : (
            /* Profile Pill & Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/80 p-1 pr-3 text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-100 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-slate-700 dark:hover:bg-slate-800"
              >
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-xs font-bold text-white shadow-sm">
                  {userInitials}
                </div>
                <span className="hidden max-w-[120px] truncate text-xs font-semibold sm:inline">
                  {userName}
                </span>
                <ChevronDown className="h-3 w-3 text-slate-400 transition-transform duration-200" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 origin-top-right rounded-2xl border border-slate-200/90 bg-white/95 p-2 shadow-xl shadow-slate-900/10 backdrop-blur-md animate-in fade-in zoom-in-95 dark:border-slate-800 dark:bg-slate-900/95 dark:shadow-black/40">
                  {/* User Profile Header */}
                  <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60">
                    <div className="flex items-center justify-between">
                      <p className="truncate text-sm font-bold text-slate-900 dark:text-white">
                        {userName}
                      </p>
                      <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-semibold capitalize text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                        {isAdmin ? "Admin" : "Student"}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">
                      {user?.email}
                    </p>
                  </div>

                  <div className="my-1.5 h-px bg-slate-100 dark:bg-slate-800" />

                  {/* Menu Options */}
                  <div className="space-y-0.5">
                    <Link
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <span>My Profile</span>
                    </Link>

                    <Link
                      to="/password"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                    >
                      <KeyRound className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <span>Security & Password</span>
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin-users"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-indigo-600 transition hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-950/40"
                      >
                        <ShieldCheck className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        <span>Manage Users</span>
                      </Link>
                    )}
                  </div>

                  <div className="my-1.5 h-px bg-slate-100 dark:bg-slate-800" />

                  {/* Logout Button */}
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-600 transition hover:bg-rose-50 disabled:opacity-50 dark:text-rose-400 dark:hover:bg-rose-950/30"
                  >
                    <LogOut className="h-4 w-4 text-rose-500" />
                    <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

