// frontend/src/components/question/FeedbackPanel.jsx

import { useState } from "react";

function FeedbackPanel({ feedback, onRetry }) {
  const [followUpAnswer, setFollowUpAnswer] = useState("");

  const hasResult = Boolean(feedback);
  const isCorrect = Boolean(feedback?.correct);
  const canRetry = hasResult && !isCorrect;
  const learningComplete = false;
  const message = feedback?.message || feedback?.error || "Run or submit your query to see feedback.";

  const handleRetry = () => {
    if (onRetry) onRetry();
  };

  const handleFollowUpSubmit = () => {
    if (!followUpAnswer.trim()) return;

    console.log("Submit follow-up:", followUpAnswer);
  };

  const handleNextQuestion = () => {
    console.log("Next question");
  };

  return (
    <section className="relative flex h-full flex-col overflow-hidden bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="shrink-0 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
            Feedback
          </h2>

          {hasResult && (
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                isCorrect
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                  : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
              }`}
            >
              {isCorrect ? "Correct" : "Incorrect"}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="space-y-5">
          {/* Feedback message */}
          <div>
            <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
              {message}
            </p>
            {Array.isArray(feedback?.rows) && feedback.rows.length > 0 && (
              <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-700 dark:bg-gray-950 dark:text-gray-300">
                {JSON.stringify(feedback.rows, null, 2)}
              </pre>
            )}
          </div>

          {/* Retry */}
          {!isCorrect && canRetry && (
            <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Retry
              </button>
            </div>
          )}

          {/* Follow-up */}
          {isCorrect && !learningComplete && feedback?.followUp && (
            <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
              <div className="mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Follow-up question
                </p>

                <p className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-300">
                  {feedback.followUp}
                </p>
              </div>

              <textarea
                value={followUpAnswer}
                onChange={(event) => setFollowUpAnswer(event.target.value)}
                placeholder="Write your explanation..."
                rows={3}
                className="w-full resize-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-950 dark:text-white dark:placeholder:text-gray-500"
              />

              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={handleFollowUpSubmit}
                  disabled={!followUpAnswer.trim()}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Submit
                </button>
              </div>
            </div>
          )}

          {/* Learning complete */}
          {learningComplete && (
            <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
              <div className="mb-3 rounded-lg bg-green-50 p-3 dark:bg-green-950/30">
                <p className="text-sm font-medium text-green-700 dark:text-green-300">
                  Learning complete
                </p>

                <p className="mt-1 text-xs text-green-600 dark:text-green-400">
                  You have completed the required follow-up questions.
                </p>
              </div>

              <button
                type="button"
                onClick={handleNextQuestion}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default FeedbackPanel;