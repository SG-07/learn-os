// frontend/src/components/sql-assistant/QuestionInputForm.jsx

import { useEffect, useState } from "react";
import { Sparkles, Database, Plus, Minus, HelpCircle } from "lucide-react";
import ModeToggle from "./ModeToggle";

const QUICK_EXAMPLES = [
  "Find the 2nd highest salary in each department",
  "Calculate rolling 7-day active user averages",
  "Find customers with orders in consecutive months",
];

function QuestionInputForm({
  mode,
  onModeChange,
  onAsk,
  isLoading,
  questionValue = "",
  schemaValue = "",
}) {
  const [question, setQuestion] = useState(questionValue);
  const [schema, setSchema] = useState(schemaValue);
  const [showSchema, setShowSchema] = useState(Boolean(schemaValue));

  useEffect(() => {
    setQuestion(questionValue);
    setSchema(schemaValue);
    if (schemaValue.trim()) setShowSchema(true);
  }, [questionValue, schemaValue]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!question.trim() || isLoading) return;
    onAsk({ question: question.trim(), schema: schema.trim() });
  };

  const handleApplyExample = (ex) => {
    setQuestion(ex);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <h1 className="text-sm font-bold text-slate-900 dark:text-white">
            AI SQL Tutor
          </h1>
        </div>

        <ModeToggle mode={mode} onChange={onModeChange} />
      </div>

      {/* Question Input */}
      <div>
        <label className="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
          <span>Problem statement / SQL Goal</span>
        </label>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={3}
          placeholder="e.g. Find all students who scored above class average in Database Systems..."
          className="w-full resize-none rounded-2xl border border-slate-200/90 bg-white px-3.5 py-2.5 text-xs text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
        />

        {/* Quick Suggestion Chips */}
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
            Try:
          </span>
          {QUICK_EXAMPLES.map((ex, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleApplyExample(ex)}
              className="rounded-lg border border-slate-200/80 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800"
            >
              {ex.slice(0, 32)}...
            </button>
          ))}
        </div>
      </div>

      {/* Schema Specification Accordion */}
      <div>
        <button
          type="button"
          onClick={() => setShowSchema((prev) => !prev)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
        >
          {showSchema ? <Minus className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
          <span>{showSchema ? "Hide Database Schema" : "Add Custom Schema (DDL / Tables)"}</span>
        </button>

        {showSchema && (
          <div className="mt-2 space-y-1 animate-in fade-in duration-150">
            <textarea
              value={schema}
              onChange={(event) => setSchema(event.target.value)}
              rows={4}
              placeholder="CREATE TABLE students (id INT PRIMARY KEY, name VARCHAR(50), score INT);"
              className="w-full rounded-2xl border border-slate-200/90 bg-white px-3.5 py-2.5 font-mono text-xs text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
            />
            <p className="text-[10px] text-slate-400 dark:text-slate-500">
              Paste SQL CREATE TABLE statements to generate visual ER diagrams.
            </p>
          </div>
        )}
      </div>

      {/* Submit Action */}
      <button
        type="submit"
        disabled={!question.trim() || isLoading}
        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:from-indigo-500 hover:to-purple-500 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Sparkles className="h-3.5 w-3.5" />
        <span>{isLoading ? "Consulting AI Coach..." : mode === "teach" ? "Start Socratic Session" : "Get Complete Solution"}</span>
      </button>
    </form>
  );
}

export default QuestionInputForm;

