// frontend/src/pages/Profile.jsx

import { Link } from "@tanstack/react-router";
import { User, Mail, Shield, KeyRound, Award, GraduationCap, Calendar } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import BackButton from "../components/common/BackButton";

function Profile() {
  const { user } = useAuth();

  const name = user?.user_metadata?.name || user?.email?.split("@")[0] || "Student";
  const email = user?.email || "Not available";
  const userRole = (user?.app_metadata?.role || "student").toLowerCase();
  const isAdmin = userRole === "admin";
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <div className="min-h-full bg-slate-50/50 p-4 sm:p-8 dark:bg-slate-950">
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <BackButton to="/dashboard" label="Dashboard" />
        </div>

        {/* Profile Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-xl shadow-slate-900/5 dark:border-slate-800 dark:bg-slate-900">
          {/* Cover Banner */}
          <div className="h-32 bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6">
            <div className="flex justify-end">
              <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md">
                {isAdmin ? "Admin Account" : "Student Account"}
              </span>
            </div>
          </div>

          <div className="px-6 pb-8 sm:px-8">
            {/* Avatar & Main Info */}
            <div className="relative -mt-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
              <div className="flex items-end gap-4">
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 text-2xl font-black text-white shadow-lg shadow-indigo-500/30 ring-4 ring-white dark:ring-slate-900">
                  {initials}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-slate-900 dark:text-white">
                    {name}
                  </h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {email}
                  </p>
                </div>
              </div>

              <Link
                to="/password"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
              >
                <KeyRound className="h-3.5 w-3.5 text-slate-500" />
                <span>Change Password</span>
              </Link>
            </div>

            {/* Details Grid */}
            <div className="mt-8 grid gap-4 border-t border-slate-100 pt-6 dark:border-slate-800 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    Platform Role
                  </p>
                  <p className="text-xs font-bold capitalize text-slate-800 dark:text-slate-200">
                    {isAdmin ? "Administrator" : "Student Learner"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800/60 dark:bg-slate-800/40">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400">
                  <Award className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500">
                    Access Level
                  </p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Full Free Educational Tier
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

