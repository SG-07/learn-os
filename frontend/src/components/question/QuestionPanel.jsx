// frontend/src/components/question/QuestionPanel.jsx

import { useRouter } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, CheckCircle, HelpCircle, Sparkles } from "lucide-react";
import SchemaDesign from "./SchemaDesign";

function QuestionPanel({ question }) {
  const router = useRouter();

  const handleBack = () => {
    router.history.back();
  };

  if (!question) {
    return (
      <section className="h-full bg-white p-6 dark:bg-slate-900">
        <div className="space-y-4 animate-pulse">
          <div className="h-4 w-24 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-8 w-3/4 rounded bg-slate-200 dark:bg-slate-800" />
          <div className="h-20 w-full rounded bg-slate-100 dark:bg-slate-800/60" />
        </div>
      </section>
    );
  }

  const getDifficultyBadge = (diff) => {
    const d = (diff || "medium").toLowerCase();
    if (d === "easy") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/40 dark:text-emerald-300 dark:ring-emerald-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Easy
        </span>
      );
    }
    if (d === "hard") {
      return (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20 dark:bg-rose-950/40 dark:text-rose-300 dark:ring-rose-500/30">
          <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
          Hard
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-500/30">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
        Medium
      </span>
    );
  };

  return (
    <section className="h-full overflow-y-auto bg-white p-6 dark:bg-slate-900">
      {/* Back button */}
      <button
        type="button"
        onClick={handleBack}
        className="group mb-6 inline-flex items-center gap-2 rounded-xl border border-slate-200/80 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
        <span>Back to Questions</span>
      </button>

      {/* Badges & Tags */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {question.topicName && (
          <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
            <BookOpen className="h-3 w-3" />
            {question.topicName}
          </span>
        )}

        {question.difficulty && getDifficultyBadge(question.difficulty)}

        {question.solved && (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <CheckCircle className="h-3.5 w-3.5" />
            Solved
          </span>
        )}
      </div>

      {/* Question title */}
      <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-2xl">
        {question.title}
      </h1>

      {/* Problem Prompt */}
      <div className="mt-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4.5 dark:border-slate-800/80 dark:bg-slate-950/40">
        <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Problem Description
        </h2>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700 dark:text-slate-300">
          {question.prompt}
        </p>
      </div>

      {/* Schema */}
      <SchemaDesign schema={question.schema} />
    </section>
  );
}

export default QuestionPanel;