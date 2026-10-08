// frontend/src/components/question/FeedbackPanel.jsx

import { useState } from "react";
import {
  CheckCircle2,
  XCircle,
  Sparkles,
  HelpCircle,
  RotateCcw,
  Send,
  ArrowRight,
  Terminal,
  Award,
} from "lucide-react";

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
  idleText = "Execute or submit your SQL query above to test your answer against the problem criteria.",
  children,
}) {
  const [followUpAnswer, setFollowUpAnswer] = useState("");

  const feedbackObject = feedback && typeof feedback === "object" ? feedback : null;
  const feedbackText = typeof feedback === "string" ? feedback : "";
  const resolvedStatus =
    status ??
    (feedbackObject ? (feedbackObject.correct ? "correct" : "incorrect") : "idle");

  const isCorrect = resolvedStatus === "correct";
  const isIncorrect = resolvedStatus === "incorrect";
  const learningComplete = resolvedStatus === "completed";
  const message =
    feedbackText || feedbackObject?.message || feedbackObject?.error || "";
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
    <section className="relative flex h-full flex-col overflow-hidden bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-slate-200/80 bg-slate-50/70 px-4 py-2.5 dark:border-slate-800 dark:bg-slate-900/70">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h2 className="text-xs font-bold text-slate-900 dark:text-white">
            Execution & Evaluation Feedback
          </h2>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center gap-2">
          {isIncorrect && canRetry && (
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Retry</span>
            </button>
          )}

          {isCorrect && (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-500/30">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Passed
            </span>
          )}

          {isIncorrect && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-500/30">
              <XCircle className="h-3.5 w-3.5 text-rose-600" />
              Query Mismatch
            </span>
          )}

          {learningComplete && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700 ring-1 ring-inset ring-indigo-600/20 dark:bg-indigo-950/40 dark:text-indigo-300 dark:ring-indigo-500/30">
              <Award className="h-3.5 w-3.5 text-indigo-600" />
              Concept Mastered!
            </span>
          )}
        </div>
      </div>

      {/* Scrollable feedback body */}
      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
        <div className="space-y-4">
          {/* Idle State */}
          {resolvedStatus === "idle" && (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
                <Terminal className="h-5 w-5" />
              </div>
              <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-500 dark:text-slate-400">
                {idleText}
              </p>
            </div>
          )}

          {/* Messages Feed */}
          {messages.length > 0 && (
            <div className="space-y-2.5">
              {messages.map((entry, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-4 text-xs leading-relaxed ${
                    entry.role === "user"
                      ? "border border-slate-200/80 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-200"
                      : "border border-indigo-100 bg-indigo-50/70 text-indigo-950 dark:border-indigo-950/60 dark:bg-indigo-950/30 dark:text-indigo-200"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{entry.content}</p>
                </div>
              ))}
            </div>
          )}

          {children}

          {/* Next Hint action */}
          {onNextHint && (
            <button
              type="button"
              onClick={onNextHint}
              disabled={isLoading}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <HelpCircle className="h-3.5 w-3.5 text-indigo-500" />
              <span>{isLoading ? "Generating Next Step..." : "Need Next Hint?"}</span>
            </button>
          )}

          {/* Feedback Message Result */}
          {message && resolvedStatus !== "idle" && (
            <div
              className={`rounded-2xl border p-4 ${
                isCorrect
                  ? "border-emerald-200/80 bg-emerald-50/60 text-emerald-950 dark:border-emerald-950/60 dark:bg-emerald-950/20 dark:text-emerald-200"
                  : isIncorrect
                    ? "border-rose-200/80 bg-rose-50/60 text-rose-950 dark:border-rose-950/60 dark:bg-rose-950/20 dark:text-rose-200"
                    : "border-slate-200/80 bg-slate-50 text-slate-800 dark:border-slate-800 dark:bg-slate-800/40 dark:text-slate-200"
              }`}
            >
              <p className="text-xs font-medium leading-relaxed whitespace-pre-wrap">
                {message}
              </p>

              {/* Rows Output Table */}
              {rows.length > 0 && (
                <div className="mt-3 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
                  <div className="max-h-48 overflow-x-auto">
                    <table className="min-w-full text-left text-[11px] font-mono">
                      <thead className="sticky top-0 bg-slate-50 border-b border-slate-100 dark:bg-slate-800 dark:border-slate-800">
                        <tr>
                          {Object.keys(rows[0] || {}).map((k) => (
                            <th key={k} className="px-3 py-1.5 font-bold text-slate-900 dark:text-white">
                              {k}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                        {rows.slice(0, 10).map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                            {Object.values(r).map((val, j) => (
                              <td key={j} className="px-3 py-1.5 text-slate-700 dark:text-slate-300">
                                {String(val ?? "")}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="border-t border-slate-100 bg-slate-50/60 px-3 py-1 text-[10px] text-slate-500 dark:border-slate-800 dark:bg-slate-900">
                    {rows.length} {rows.length === 1 ? "row" : "rows"} returned
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Socratic Follow-up Question for College Students */}
          {isCorrect && !learningComplete && followUp && (
            <div className="rounded-2xl border border-indigo-200/80 bg-indigo-50/40 p-4 dark:border-indigo-950/60 dark:bg-indigo-950/20">
              <div className="mb-2.5">
                <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-300">
                  <Sparkles className="h-3 w-3" />
                  Conceptual Follow-up
                </div>
                <p className="mt-2 text-xs font-semibold leading-relaxed text-indigo-950 dark:text-indigo-100">
                  {followUp}
                </p>
              </div>

              <textarea
                value={followUpAnswer}
                onChange={(event) => setFollowUpAnswer(event.target.value)}
                placeholder="Explain why this approach works or what alternative clause you could use..."
                rows={2}
                className="w-full resize-none rounded-xl border border-indigo-200/90 bg-white px-3 py-2 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-indigo-900/80 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
              />

              <div className="mt-2.5 flex justify-end">
                <button
                  type="button"
                  onClick={handleFollowUpSubmit}
                  disabled={!followUpAnswer.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-indigo-500/20 transition hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span>Submit Explanation</span>
                  <Send className="h-3 w-3" />
                </button>
              </div>
            </div>
          )}

          {/* Concept Complete Celebration */}
          {learningComplete && (
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/70 p-5 dark:border-emerald-950/60 dark:bg-emerald-950/30">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-md">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-900 dark:text-emerald-200">
                    Outstanding Job!
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400">
                    You've solved the SQL challenge and mastered the underlying relational concepts.
                  </p>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleNextQuestion}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition hover:from-emerald-500 hover:to-emerald-600 active:scale-95"
                >
                  <span>Next Challenge</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default FeedbackPanel;

