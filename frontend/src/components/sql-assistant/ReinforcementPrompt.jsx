// frontend/src/components/sql-assistant/ReinforcementPrompt.jsx

import { Sparkles, ArrowRight, Award } from "lucide-react";

function ReinforcementPrompt({ onPractice, isLoading }) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-emerald-200/80 bg-gradient-to-r from-emerald-50/80 via-teal-50/50 to-emerald-50/80 p-4 shadow-sm dark:border-emerald-950/60 dark:from-emerald-950/30 dark:to-teal-950/20">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
          <Award className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
            Great mastery shown!
          </p>
          <p className="text-[11px] text-emerald-700 dark:text-emerald-400">
            Lock in this concept by tackling a similar generated challenge.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onPractice}
        disabled={isLoading}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm shadow-emerald-500/20 transition-all hover:from-emerald-500 hover:to-teal-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>{isLoading ? "Generating Question..." : "Practice Similar Question"}</span>
      </button>
    </div>
  );
}

export default ReinforcementPrompt;

