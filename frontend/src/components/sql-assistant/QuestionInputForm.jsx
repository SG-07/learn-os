// frontend/src/components/sql-assistant/QuestionInputForm.jsx

import { useState } from "react";
import ModeToggle from "./ModeToggle";

function QuestionInputForm({ mode, onModeChange, onAsk, isLoading }) {
  const [question, setQuestion] = useState("");
  const [schema, setSchema] = useState("");
  const [showSchema, setShowSchema] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!question.trim() || isLoading) return;
    onAsk({ question: question.trim(), schema: schema.trim() });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-3">
        <h1 className="m-0! text-[20px]! font-semibold tracking-normal! text-gray-900 dark:text-white">
          SQL Assistant
        </h1>
        <ModeToggle mode={mode} onChange={onModeChange} />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
          Your SQL question
        </label>
        <textarea
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={3}
          placeholder="e.g. Find the second highest salary in each department"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
        />
      </div>

      <div>
        <button
          type="button"
          onClick={() => setShowSchema((prev) => !prev)}
          className="mb-1 text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          {showSchema ? "Hide schema (optional)" : "Add schema (optional)"}
        </button>
        {showSchema && (
          <textarea
            value={schema}
            onChange={(event) => setSchema(event.target.value)}
            rows={4}
            placeholder={
              "e.g. CREATE TABLE employees (id INT, name VARCHAR, salary INT, department_id INT);"
            }
            className="w-full rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={!question.trim() || isLoading}
        className="self-start rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Thinking..." : "Ask"}
      </button>
    </form>
  );
}

export default QuestionInputForm;
