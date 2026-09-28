// frontend/src/components/sql-assistant/ReinforcementPrompt.jsx

function ReinforcementPrompt({ onPractice, isLoading }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">
      <p className="text-sm font-medium text-green-800 dark:text-green-300">
        Nice work! Want to reinforce this with a similar question?
      </p>
      <button
        type="button"
        onClick={onPractice}
        disabled={isLoading}
        className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isLoading ? "Generating..." : "Practice similar question"}
      </button>
    </div>
  );
}

export default ReinforcementPrompt;
