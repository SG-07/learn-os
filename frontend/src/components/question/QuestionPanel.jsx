// frontend/src/components/question/QuestionPanel.jsx

import { useRouter } from "@tanstack/react-router";
import SchemaDesign from "./SchemaDesign";

function QuestionPanel({ question }) {
  const router = useRouter();
  const handleBack = () => {
    router.history.back();
  };
  if (!question) {
    return (
      <section className="h-full bg-white p-6 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Loading question...
        </p>
      </section>
    );
  }
  return (
    <section className="h-full bg-white p-6 dark:bg-gray-900">
      {/* Back button */}
      <button
        type="button"
        onClick={handleBack}
        className="mb-5 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="h-4 w-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        Back
      </button>

      {/* Question metadata */}
      <div className="mb-5 flex flex-wrap gap-2">
        {question.topicName && (
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
            {question.topicName}
          </span>
        )}
        {question.difficulty && (
          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            {question.difficulty}
          </span>
        )}
        {question.type && (
          <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
            {question.type}
          </span>
        )}
      </div>

      {/* Question title */}
      <h1 className="mb-4 text-[30px]! font-semibold text-gray-900 dark:text-white">
        {question.title}
      </h1>

      {/* Question prompt */}
      <div className="mb-6">
        <h2 className="mb-2 text-[20px]! font-semibold text-gray-700 dark:text-gray-300">
          Problem
        </h2>
        <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600 dark:text-gray-400">
          {question.prompt}
        </p>
      </div>

      {/* Schema */}
      <SchemaDesign schema={question.schema} />
    </section>
  );
}

export default QuestionPanel;