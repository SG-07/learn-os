// frontend/src/components/sql-assistant/ModeToggle.jsx

import { GraduationCap, Zap } from "lucide-react";

function ModeToggle({ mode, onChange }) {
  return (
    <div className="flex w-full rounded-2xl border border-slate-200/80 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-slate-800/80">
      <button
        type="button"
        onClick={() => onChange("teach")}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-bold transition-all ${
          mode === "teach"
            ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
      >
        <GraduationCap className="h-3.5 w-3.5" />
        <span>Socratic Tutor</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("answer")}
        className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl py-1.5 text-xs font-bold transition-all ${
          mode === "answer"
            ? "bg-white text-purple-600 shadow-sm dark:bg-slate-900 dark:text-purple-400"
            : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
        }`}
      >
        <Zap className="h-3.5 w-3.5" />
        <span>Instant Answer</span>
      </button>
    </div>
  );
}

export default ModeToggle;

