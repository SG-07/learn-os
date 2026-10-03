import { useState } from "react";

function FeedbackPanel({
  status,
  feedback,
  canRetry = true,
  followUpQuestion = "",
  onRetry,
  onFollowUpSubmit,
  onNextQuestion,
  messages = [],
  isLoading = false,
  onNextHint,
  idleText = "Run or submit your query to see feedback.",
  children,
}) {
  const [followUpAnswer, setFollowUpAnswer] = useState("");

  const feedbackObject = feedback && typeof feedback === "object" ? feedback : null;
  const feedbackText = typeof feedback === "string" ? feedback : "";
  const resolvedStatus = status
    ?? (feedbackObject ? (feedbackObject.correct ? "correct" : "incorrect") : "idle");
  const isCorrect = resolvedStatus === "correct";
  const isIncorrect = resolvedStatus === "incorrect";
  const learningComplete = resolvedStatus === "completed";
  const message = feedbackText || feedbackObject?.message || feedbackObject?.error || "";
  const followUp = followUpQuestion || feedbackObject?.followUp || "";
  const rows = Array.isArray(feedbackObject?.rows) ? feedbackObject.rows : [];

  const handleRetry = () => {
    setFollowUpAnswer("");
    onRetry?.();
  };
  const handleFollowUpSubmit = () => {
    const answer = followUpAnswer.trim();
    if (!answer) return;
    onFollowUpSubmit?.(answer);
  };
  const handleNextQuestion = () => {
    onNextQuestion?.();
  };

  return (
    <section className="relative flex h-full flex-col overflow-hidden bg-white dark:bg-gray-900">
      <div className="shrink-0 border-b border-gray-200 px-4 py-3 dark:border-gray-800">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[20px]! font-semibold text-gray-900 dark:text-white">
            Feedback
          </h2>
          <div className="flex items-center gap-2">
            {isIncorrect && canRetry && (
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Retry
              </button>
            )}
            {isCorrect && (
              <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                Correct
              </span>
            )}
            {isIncorrect && (
              <span className="rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-300">
                Incorrect
              </span>
            )}
            {learningComplete && (
              <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-300">
                Complete
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="space-y-5">
          {resolvedStatus === "idle" && (
            <p className="text-sm leading-6 text-gray-500 dark:text-gray-400">
              {idleText}
            </p>
          )}

          {messages.length > 0 && (
            <div className="space-y-3">
              {messages.map((entry, index) => (
                <div
                  key={index}
                  className={`rounded-lg border p-3 text-sm leading-6 ${
                    entry.role === "user"
                      ? "border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      : "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{entry.content}</p>
                </div>
              ))}
            </div>
          )}

          {children}

          {onNextHint && (
            <button
              type="button"
              onClick={onNextHint}
              disabled={isLoading}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              {isLoading ? "Thinking..." : "Next hint"}
            </button>
          )}

          {message && resolvedStatus !== "idle" && (
            <div>
              <p className="text-sm leading-6 text-gray-700 dark:text-gray-300">
                {message}
              </p>
              {rows.length > 0 && (
                <pre className="mt-3 overflow-x-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-700 dark:bg-gray-950 dark:text-gray-300">
                  {JSON.stringify(rows, null, 2)}
                </pre>
              )}
            </div>
          )}

          {isCorrect && !learningComplete && followUp && (
            <div className="border-t border-gray-200 pt-4 dark:border-gray-800">
              <div className="mb-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                  Follow-up question
                </p>
                <p className="mt-1 text-sm leading-6 text-gray-700 dark:text-gray-300">
                  {followUp}
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
