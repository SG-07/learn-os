// frontend/src/components/common/BackButton.jsx

import { Link } from "@tanstack/react-router";

function BackButton({ to = "/dashboard", label = "Back" }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
    >
      <span className="material-icons text-base">arrow_back</span>
      {label}
    </Link>
  );
}

export default BackButton;
