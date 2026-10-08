// frontend/src/pages/QuestionPage.jsx

import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import SqlEditor from "../components/question/SqlEditor";
import FeedbackPanel from "../components/question/FeedbackPanel";
import QuestionPanel from "../components/question/QuestionPanel";
import { executeQuestion, getQuestionById, requestHint } from "../api/questions";

function QuestionPage() {
  const { questionId } = useParams({ strict: false });
  const [question, setQuestion] = useState(null);
  const [loadedId, setLoadedId] = useState(null);
  const [query, setQuery] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [hintText, setHintText] = useState("");
  const [hintLoading, setHintLoading] = useState(false);
  const [expectedRows, setExpectedRows] = useState(null);
  const [error, setError] = useState("");
  const [running, setRunning] = useState(false);
  const loading = Boolean(questionId) && loadedId !== questionId;

  useEffect(() => {
    if (!questionId) {
      return undefined;
    }

    let cancelled = false;

    getQuestionById(questionId)
      .then((data) => {
        if (cancelled) return;
        setQuestion(data);
        setError("");
        setFeedback(null);
        setHintText("");
        setExpectedRows(null);
        setQuery("");
        setLoadedId(questionId);
      })
      .catch((err) => {
        if (cancelled) return;
        setQuestion(null);
        setError(err.message || "Could not load this question.");
        setLoadedId(questionId);
      });

    return () => {
      cancelled = true;
    };
  }, [questionId]);

  const runSql = async () => {
    if (!questionId || !query.trim()) {
      setFeedback({
        correct: false,
        message: "Please write a SQL query before running it.",
        rows: [],
      });
      return;
    }

    setRunning(true);
    try {
      const result = await executeQuestion(questionId, query);
      setFeedback(result);
      if (Array.isArray(result.expectedRows)) {
        setExpectedRows(result.expectedRows);
      }
      if (result.solved) {
        setQuestion((current) => (current ? { ...current, solved: true } : current));
      }
    } catch (err) {
      setFeedback({
        correct: false,
        message: err.message || "The query could not be executed.",
        error: err.message,
        rows: err.data?.rows || [],
      });
    } finally {
      setRunning(false);
    }
  };

  const loadHint = async () => {
    if (!questionId || hintLoading) return;
    setHintLoading(true);
    try {
      const result = await requestHint(questionId);
      setHintText(result.hint?.text || "No more hints are available.");
    } catch (err) {
      setHintText(err.message || "Could not load a hint.");
    } finally {
      setHintLoading(false);
    }
  };

  if (!questionId) {
    return <StatusMessage text="Question ID is missing." isError />;
  }

  if (loading) {
    return <StatusMessage text="Loading problem workspace..." isLoading />;
  }

  if (error || !question) {
    return <StatusMessage text={error || "Question not found."} isError />;
  }

  return (
    <div className="flex h-full flex-col lg:flex-row overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Left Workspace Pane: Question & Schema */}
      <section className="w-full lg:w-[35%] xl:w-[32%] overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900">
        <QuestionPanel question={question} />
      </section>

      {/* Right Workspace Pane: Code Editor + Feedback Output */}
      <section className="flex w-full lg:w-[65%] xl:w-[68%] flex-col overflow-hidden bg-slate-100 dark:bg-slate-950">
        {/* Editor (58% height) */}
        <div className="h-[58%] overflow-hidden border-b border-slate-200/80 dark:border-slate-800">
          <SqlEditor
            value={query}
            onChange={setQuery}
            onRun={runSql}
            onSubmit={runSql}
            runDisabled={running}
            submitDisabled={running}
            hintText={hintText}
            hintLoading={hintLoading}
            onHint={loadHint}
            expectedRows={expectedRows}
            submitLabel={running ? "Evaluating..." : "Submit Solution"}
          />
        </div>

        {/* Feedback Area (42% height) */}
        <div className="h-[42%] overflow-hidden">
          <FeedbackPanel feedback={feedback} onRetry={() => setFeedback(null)} />
        </div>
      </section>
    </div>
  );
}

function StatusMessage({ text, isLoading, isError }) {
  return (
    <div className="flex h-full items-center justify-center p-8 bg-slate-50 dark:bg-slate-950">
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-200/80 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        {isLoading && <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />}
        {isError && <AlertCircle className="h-6 w-6 text-rose-500" />}
        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">{text}</p>
      </div>
    </div>
  );
}

export default QuestionPage;

