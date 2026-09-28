// frontend/src/pages/DashboardHome.jsx

import { Link } from "@tanstack/react-router";

function DashboardHome() {
  return (
    <div className="min-h-full bg-gray-100 px-4 py-10 dark:bg-gray-950 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            What would you like to do today?
          </h1>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 sm:text-base">
            Follow a structured course, or bring your own SQL question and get help right away.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2">
          <Link
            to="/topics"
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:p-8"
          >
            <div
              aria-hidden="true"
              className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-blue-100 transition group-hover:scale-110 dark:bg-blue-900/30"
            />
            <div className="relative flex h-full flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                <span className="material-icons text-2xl">school</span>
              </div>
              <h2 className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">
                Take a Course
              </h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                Work through structured SQL topics step by step, from basics to advanced queries.
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-blue-600 dark:text-blue-400">
                Browse topics
                <span className="material-icons text-base transition group-hover:translate-x-1">
                  arrow_forward
                </span>
              </span>
            </div>
          </Link>

          <Link
            to="/sql-assistant"
            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900 sm:p-8"
          >
            <div
              aria-hidden="true"
              className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-purple-100 transition group-hover:scale-110 dark:bg-purple-900/30"
            />
            <div className="relative flex h-full flex-col">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-600 text-white shadow-md">
                <span className="material-icons text-2xl">smart_toy</span>
              </div>
              <h2 className="mt-5 text-xl font-semibold text-gray-900 dark:text-white">
                Ask/Solve Your Query
              </h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                Share your own SQL question and schema, then get step-by-step guidance or an instant answer.
              </p>
              <span className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-purple-600 dark:text-purple-400">
                Ask now
                <span className="material-icons text-base transition group-hover:translate-x-1">
                  arrow_forward
                </span>
              </span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DashboardHome;
