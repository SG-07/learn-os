// frontend/src/pages/DashboardHome.jsx

import { Link } from "@tanstack/react-router";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Terminal,
  Database,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Flame,
  Award,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

function DashboardHome() {
  const { user } = useAuth();
  const userName = user?.user_metadata?.name || user?.email?.split("@")[0] || "Scholar";

  return (
    <div className="min-h-full bg-slate-50/50 px-4 py-8 dark:bg-slate-950 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl space-y-10">
        {/* Student Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-indigo-100 bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-950 p-6 text-white shadow-xl shadow-indigo-950/20 sm:p-10 dark:border-indigo-950/80">
          {/* Background Glows */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 right-32 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/15 px-3 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                <span>Ready to level up your SQL skills?</span>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                Welcome back, {userName}! 👋
              </h1>
              <p className="max-w-xl text-sm leading-relaxed text-indigo-100/80 sm:text-base">
                Whether you're prepping for semester exams, university projects, or tech interviews,
                SQL Coach gives you hands-on queries and instant AI feedback.
              </p>
            </div>

            {/* Quick Motivation Card */}
            <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md sm:flex-col sm:items-start sm:p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-indigo-200/70">
                  Student Path
                </p>
                <p className="text-sm font-bold text-white">Active Learner</p>
              </div>
            </div>
          </div>
        </div>

        {/* 2 Primary Learning Paths */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white sm:text-xl">
              Choose your learning mode
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Mode 1: Structured Curriculum */}
            <Link
              to="/topics"
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/40 sm:p-8"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-inner transition-transform group-hover:scale-110 dark:bg-indigo-950/60 dark:text-indigo-400">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    Step-by-Step
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                    Structured Curriculum
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Master SQL sequentially from foundational `SELECT` and `WHERE` filtering to multi-table `JOIN`s, aggregations, and subqueries.
                  </p>
                </div>

                {/* Features Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    Graded Practice
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    Built-in Hints
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    Schema Explorer
                  </span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-indigo-600 dark:text-indigo-400">
                <span>Browse Topics & Questions</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
              </div>
            </Link>

            {/* Mode 2: AI SQL Tutor & Assistant */}
            <Link
              to="/sql-assistant"
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-purple-500/40 sm:p-8"
            >
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 shadow-inner transition-transform group-hover:scale-110 dark:bg-purple-950/60 dark:text-purple-400">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-purple-50 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:bg-purple-950/60 dark:text-purple-300">
                    AI Powered
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-purple-600 dark:text-white dark:group-hover:text-purple-400">
                    AI SQL Assistant
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    Stuck on an assignment or interview problem? Paste your query or schema, get step-by-step Socratic guidance or immediate explanations.
                  </p>
                </div>

                {/* Features Pills */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <CheckCircle2 className="h-3 w-3 text-purple-500" />
                    Socratic Guidance
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <CheckCircle2 className="h-3 w-3 text-purple-500" />
                    ER Diagram Generator
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                    <CheckCircle2 className="h-3 w-3 text-purple-500" />
                    Follow-up Practice
                  </span>
                </div>
              </div>

              <div className="mt-8 flex items-center gap-2 text-sm font-bold text-purple-600 dark:text-purple-400">
                <span>Ask AI Coach</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1.5" />
              </div>
            </Link>
          </div>
        </div>

        {/* Student Feature Highlights */}
        <div className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 shadow-sm backdrop-blur-sm dark:border-slate-800/80 dark:bg-slate-900/50 sm:p-8">
          <h3 className="text-base font-bold text-slate-900 dark:text-white">
            Engineered for student success
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400">
                <Terminal className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Real Sandbox Execution
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Execute queries instantly against real SQLite/PostgreSQL instances without installing DB engines.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Conceptual Understanding
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Get guided hints that teach relational algebra and query optimization rather than just giving away solutions.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                <Database className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Visual Relational Schemas
                </h4>
                <p className="mt-1 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                  Inspect tables, primary keys, and foreign keys visually to construct complex joins with confidence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;

