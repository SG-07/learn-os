// frontend/src/components/common/BackButton.jsx

import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

function BackButton({ to = "/dashboard", label = "Back" }) {
  return (
    <Link
      to={to}
      className="group inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
    >
      <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
      <span>{label}</span>
    </Link>
  );
}

export default BackButton;

