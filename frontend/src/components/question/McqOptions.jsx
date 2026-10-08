// frontend/src/components/question/McqOptions.jsx

import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

function McqOptions({
  options = [],
  onSubmit,
  disabled = false,
}) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSubmit = () => {
    if (!selectedOption || disabled) return;
    onSubmit(selectedOption);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200/80 bg-slate-50/70 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900/70">
        <div>
          <h2 className="text-xs font-bold text-slate-900 dark:text-white">
            Multiple Choice Challenge
          </h2>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Select the best option and submit your response.
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedOption || disabled}
          className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-indigo-500/20 transition hover:from-indigo-500 hover:to-indigo-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>Submit Answer</span>
        </button>
      </div>

      {/* Options */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
        <div className="space-y-3">
          {options.map((option) => {
            const isSelected = selectedOption === option.id;

            return (
              <button
                key={option.id}
                type="button"
                disabled={disabled}
                onClick={() => setSelectedOption(option.id)}
                className={`flex w-full items-start gap-3.5 rounded-2xl border p-4 text-left transition-all ${
                  isSelected
                    ? "border-indigo-500 bg-indigo-50/80 shadow-md shadow-indigo-500/10 dark:border-indigo-500 dark:bg-indigo-950/40"
                    : "border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/70 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 dark:hover:bg-slate-800/50"
                } ${
                  disabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"
                }`}
              >
                {/* Radio indicator */}
                <span className="mt-0.5 shrink-0">
                  {isSelected ? (
                    <CheckCircle2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  ) : (
                    <Circle className="h-5 w-5 text-slate-400 dark:text-slate-600" />
                  )}
                </span>

                {/* Option label & text */}
                <div className="min-w-0 space-y-0.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    Option {option.id.toUpperCase()}
                  </span>
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    {option.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default McqOptions;


