// frontend/src/components/question/McqOptions.jsx

import { useState } from "react";

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
    <div className="flex h-full flex-col overflow-hidden bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <div>
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Choose your answer
          </h2>

          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
            Select one option and submit your answer.
          </p>
        </div>

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!selectedOption || disabled}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit
        </button>
      </div>

      {/* Options */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {options.map((option) => {
            const isSelected = selectedOption === option.id;

            return (
              <button
                key={option.id}
                type="button"
                disabled={disabled}
                onClick={() => setSelectedOption(option.id)}
                className={`flex w-full items-center gap-3 rounded-lg border px-4 py-2.5 text-left transition ${
                  isSelected
                    ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950/30"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-800"
                } ${
                  disabled
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"
                }`}
              >
                {/* Radio indicator */}
                <span
                  className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                    isSelected
                      ? "border-blue-600 dark:border-blue-400"
                      : "border-gray-400 dark:border-gray-500"
                  }`}
                >
                  {isSelected && (
                    <span className="h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                  )}
                </span>

                {/* Option label */}
                <span className="flex min-w-0 gap-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {option.id.toUpperCase()}.
                  </span>

                  <span className="text-sm leading-5 text-gray-700 dark:text-gray-300">
                    {option.text}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default McqOptions;

