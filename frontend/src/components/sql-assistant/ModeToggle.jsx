// frontend/src/components/sql-assistant/ModeToggle.jsx

function ModeToggle({ mode, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-gray-700 dark:bg-gray-800">
      <button
        type="button"
        onClick={() => onChange("teach")}
        className={`rounded-md px-4 py-2 text-sm font-medium transition ${
          mode === "teach"
            ? "bg-white text-blue-700 shadow-sm dark:bg-gray-900 dark:text-blue-400"
            : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        }`}
      >
        Teaching Assistant
      </button>
      <button
        type="button"
        onClick={() => onChange("answer")}
        className={`rounded-md px-4 py-2 text-sm font-medium transition ${
          mode === "answer"
            ? "bg-white text-blue-700 shadow-sm dark:bg-gray-900 dark:text-blue-400"
            : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        }`}
      >
        Get Answer Now
      </button>
    </div>
  );
}

export default ModeToggle;
