import { useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
        message: "Write a SQL query before running it.",
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
        message: err.message || "The query could not be run.",
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
    return <StatusMessage text="Question id is missing." />;
  }

  if (loading) {
    return <StatusMessage text="Loading question..." />;
  }

  if (error || !question) {
    return <StatusMessage text={error || "Question not found."} />;
  }

  return (
    <div className="flex h-full gap-0 overflow-hidden bg-gray-50 dark:bg-gray-950">
      <section className="w-[30%] overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <QuestionPanel question={question} />
      </section>

      <section className="flex w-[70%] flex-col overflow-hidden">
        <div className="h-[60%] overflow-y-auto border-b border-gray-200 dark:border-gray-800">
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
          />
        </div>
        <div className="h-[40%] overflow-y-auto">
          <FeedbackPanel feedback={feedback} onRetry={() => setFeedback(null)} />
        </div>
      </section>
    </div>
  );
}

function StatusMessage({ text }) {
  return (
    <div className="flex h-full items-center justify-center bg-white dark:bg-gray-900">
      <p className="text-sm text-gray-500 dark:text-gray-400">{text}</p>
    </div>
  );
}

export default QuestionPage;
