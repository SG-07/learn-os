// frontend/src/components/sql-assistant/ModeToggle.jsx

function ModeToggle({ mode, onChange }) {
  const buttonClass = (active) =>
    `flex-1 rounded-md px-2 py-1 text-xs font-medium transition ${
      active
        ? "bg-white text-blue-700 shadow-sm dark:bg-gray-900 dark:text-blue-400"
        : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
    }`;

  return (
    <div className="flex w-full rounded-lg border border-gray-200 bg-gray-100 p-0.5 dark:border-gray-700 dark:bg-gray-800">
      <button
        type="button"
        onClick={() => onChange("teach")}
        className={buttonClass(mode === "teach")}
      >
        Teaching Assistant
      </button>
      <button
        type="button"
        onClick={() => onChange("answer")}
        className={buttonClass(mode === "answer")}
      >
        Get Answer Now
      </button>
    </div>
  );
}

export default ModeToggle;
