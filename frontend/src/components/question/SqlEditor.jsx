// frontend/src/components/question/SqlEditor.jsx

import { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import {
  Play,
  CheckCircle2,
  Lightbulb,
  Table,
  BookOpen,
  Sparkles,
  Command,
} from "lucide-react";
import Modal from "../common/Modal";

function SqlEditor({
  value,
  onChange,
  onRun,
  onSubmit,
  runDisabled = false,
  submitDisabled = false,
  placeholder = "SELECT * FROM employees WHERE department_id = 1;",
  hintText = "",
  onHint,
  expectedRows = null,
  hintLoading = false,
  readOnly = false,
  showHelpers = true,
  submitLabel = "Submit Solution",
  subtitle = "Write your query and run it to preview or verify your results.",
}) {
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [isWalkthroughOpen, setIsWalkthroughOpen] = useState(false);
  const [isExpectedResultOpen, setIsExpectedResultOpen] = useState(false);

  // Keyboard shortcut: Cmd+Enter or Ctrl+Enter to run / submit
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        if (onSubmit && !submitDisabled) {
          onSubmit();
        } else if (onRun && !runDisabled) {
          onRun();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSubmit, onRun, submitDisabled, runDisabled]);

  return (
    <>
      <div className="relative flex h-full flex-col overflow-hidden bg-white dark:bg-slate-950">
        {/* Editor Top Bar */}
        <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 bg-slate-50/70 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900/70">
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-indigo-500 animate-pulse" />
            <div>
              <h2 className="text-xs font-bold text-slate-900 dark:text-white">
                SQL Query Sandbox
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {onRun && (
              <button
                type="button"
                onClick={onRun}
                disabled={runDisabled}
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
                title="Run Query (Ctrl + Enter)"
              >
                <Play className="h-3.5 w-3.5 text-slate-600 dark:text-slate-300" />
                <span>Run</span>
              </button>
            )}

            <button
              type="button"
              onClick={onSubmit}
              disabled={submitDisabled}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-indigo-600 hover:shadow-indigo-500/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{submitLabel}</span>
            </button>
          </div>
        </div>

        {/* CodeMirror Editor Area */}
        <div className="min-h-0 flex-1 overflow-auto bg-slate-950">
          <CodeMirror
            value={value}
            height="100%"
            extensions={[sql()]}
            onChange={onChange}
            editable={!readOnly}
            placeholder={placeholder}
            theme="dark"
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              highlightActiveLine: true,
              autocompletion: true,
            }}
            className="h-full font-mono text-sm leading-relaxed"
          />
        </div>

        {/* Floating Student Tools */}
        {showHelpers && (
          <div className="absolute right-3.5 top-14 z-20 flex flex-col gap-2">
            {/* Hint Button */}
            <button
              type="button"
              onClick={() => {
                setIsHintOpen(true);
                if (onHint) onHint();
              }}
              className="group flex h-9 items-center gap-2 rounded-xl border border-slate-200/90 bg-white/95 px-2.5 py-1.5 shadow-md shadow-slate-900/5 backdrop-blur-md transition-all hover:border-amber-300 hover:bg-amber-50/50 dark:border-slate-700 dark:bg-slate-900/90 dark:hover:border-amber-500/40 dark:hover:bg-amber-950/30"
              title="Get a guided hint"
            >
              <Lightbulb className="h-4 w-4 text-amber-500 transition-transform group-hover:scale-110" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Hint
              </span>
            </button>

            {/* Expected Result Button */}
            <button
              type="button"
              onClick={() => setIsExpectedResultOpen(true)}
              className="group flex h-9 items-center gap-2 rounded-xl border border-slate-200/90 bg-white/95 px-2.5 py-1.5 shadow-md shadow-slate-900/5 backdrop-blur-md transition-all hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-700 dark:bg-slate-900/90 dark:hover:border-blue-500/40 dark:hover:bg-blue-950/30"
              title="View Expected Result table"
            >
              <Table className="h-4 w-4 text-blue-500 transition-transform group-hover:scale-110" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Expected
              </span>
            </button>

            {/* Walkthrough Button */}
            <button
              type="button"
              onClick={() => setIsWalkthroughOpen(true)}
              className="group flex h-9 items-center gap-2 rounded-xl border border-slate-200/90 bg-white/95 px-2.5 py-1.5 shadow-md shadow-slate-900/5 backdrop-blur-md transition-all hover:border-purple-300 hover:bg-purple-50/50 dark:border-slate-700 dark:bg-slate-900/90 dark:hover:border-purple-500/40 dark:hover:bg-purple-950/30"
              title="View concept walkthrough"
            >
              <BookOpen className="h-4 w-4 text-purple-500 transition-transform group-hover:scale-110" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                Guide
              </span>
            </button>
          </div>
        )}
      </div>

      {showHelpers && (
        <>
          {/* Hint Modal */}
          <Modal
            isOpen={isHintOpen}
            onClose={() => setIsHintOpen(false)}
            title="💡 Guided Socratic Hint"
          >
            <div className="rounded-2xl border border-amber-200/80 bg-amber-50/60 p-4.5 dark:border-amber-950/60 dark:bg-amber-950/20">
              <p className="text-sm leading-relaxed text-amber-900 dark:text-amber-200">
                {hintLoading ? "Generating conceptual hint..." : hintText || "No hint is available yet."}
              </p>
            </div>
          </Modal>

          {/* Walkthrough Modal */}
          <Modal
            isOpen={isWalkthroughOpen}
            onClose={() => setIsWalkthroughOpen(false)}
            title="📖 Step-by-Step Problem Walkthrough"
          >
            <div className="space-y-3.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-100 font-mono text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  1
                </span>
                <p>Identify the target tables and check if a <code>JOIN</code> condition or subquery is required.</p>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-100 font-mono text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  2
                </span>
                <p>Construct your <code>WHERE</code> filtering clauses according to the problem constraints.</p>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-100 font-mono text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  3
                </span>
                <p>Apply necessary aggregation functions like <code>COUNT()</code>, <code>AVG()</code>, or <code>MAX()</code> with <code>GROUP BY</code>.</p>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-200/80 bg-slate-50/50 p-3.5 dark:border-slate-800 dark:bg-slate-800/40">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-indigo-100 font-mono text-xs font-bold text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
                  4
                </span>
                <p>Format output columns and use <code>ORDER BY</code> / <code>LIMIT</code> as requested.</p>
              </div>
            </div>
          </Modal>

          {/* Expected Result Modal */}
          <Modal
            isOpen={isExpectedResultOpen}
            onClose={() => setIsExpectedResultOpen(false)}
            title="📋 Expected Output Dataset"
          >
            <ResultTable rows={expectedRows} />
          </Modal>
        </>
      )}
    </>
  );
}

function ResultTable({ rows }) {
  if (!Array.isArray(rows)) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Expected output will be available when running test cases or submission.
        </p>
      </div>
    );
  }

  const columns = rows[0] ? Object.keys(rows[0]) : [];

  if (columns.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50 p-6 text-center dark:border-slate-800 dark:bg-slate-900">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The query result returned 0 rows.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="max-h-96 overflow-x-auto">
        <table className="min-w-full text-left text-xs font-mono">
          <thead className="sticky top-0 border-b border-slate-200/80 bg-slate-50 dark:border-slate-800 dark:bg-slate-800/80">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-2.5 font-bold text-slate-900 dark:text-white">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
            {rows.map((row, index) => (
              <tr
                key={index}
                className="transition-colors hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
              >
                {columns.map((column) => (
                  <td key={column} className="px-4 py-2 text-slate-700 dark:text-slate-300">
                    {String(row[column] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2 text-[11px] text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
        Showing {rows.length} {rows.length === 1 ? "row" : "rows"}
      </div>
    </div>
  );
}

export default SqlEditor;

