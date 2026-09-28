// frontend/src/components/sql-assistant/GuidancePanel.jsx

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";

function GuidancePanel({ history, onNextHint, onCheckAttempt, isLoading, solved }) {
  const [attempt, setAttempt] = useState("");

  const handleCheck = () => {
    if (!attempt.trim() || isLoading) return;
    onCheckAttempt(attempt.trim());
  };

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="flex flex-col gap-3">
        {history.map((turn, index) => (
          <div
            key={index}
            className={`rounded-lg border p-3 text-sm leading-6 ${
              turn.role === "assistant"
                ? "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200"
                : "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            {turn.content}
          </div>
        ))}
      </div>

      {!solved && (
        <>
          <button
            type="button"
            onClick={onNextHint}
            disabled={isLoading}
            className="self-start rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            Next hint
          </button>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              Try your query
            </label>
            <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
              <CodeMirror
                value={attempt}
                onChange={setAttempt}
                extensions={[sql()]}
                theme="dark"
                height="150px"
                placeholder="Write your SQL attempt here..."
                basicSetup={{ lineNumbers: true, autocompletion: true }}
              />
            </div>
            <button
              type="button"
              onClick={handleCheck}
              disabled={!attempt.trim() || isLoading}
              className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Checking..." : "Check my attempt"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default GuidancePanel;
