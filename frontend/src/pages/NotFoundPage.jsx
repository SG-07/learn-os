// frontend/src/pages/NotFoundPage.jsx

import { Link } from "@tanstack/react-router";

function NotFoundPage() {
  return (
    <div className="flex min-h-full items-center justify-center bg-gray-50 px-6 dark:bg-gray-950">
      <div className="text-center">
        <p className="text-7xl font-bold tracking-tight text-gray-900 dark:text-white">
          404
        </p>

        <h1 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-white">
          Page not found
        </h1>

        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          The page you are looking for does not exist or may have been moved.
        </p>

        <Link
          to="/dashboard"
          className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
