// frontend/src/components/sql-assistant/AnswerPanel.jsx

import { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import { Check, Copy, Sparkles, BookOpen } from "lucide-react";

function AnswerPanel({ answer }) {
  const [copied, setCopied] = useState(false);

  if (!answer) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(answer.query || "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4 p-4 sm:p-5">
      {/* Generated Query Box */}
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-4 py-2 dark:border-slate-800 dark:bg-slate-800/50">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Sparkles className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
            <span>AI Generated Solution</span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span>Copy SQL</span>
              </>
            )}
          </button>
        </div>

        <div className="bg-slate-950 p-1">
          <CodeMirror
            value={answer.query}
            extensions={[sql()]}
            editable={false}
            theme="dark"
            basicSetup={{ lineNumbers: true, foldGutter: false }}
            className="font-mono text-xs"
          />
        </div>
      </div>

      {/* Explanation Box */}
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 dark:border-slate-800/80 dark:bg-slate-900/40">
        <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
          <BookOpen className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
          <span>Step-by-Step Logic Breakdown</span>
        </div>
        <p className="whitespace-pre-wrap text-xs leading-relaxed text-slate-600 dark:text-slate-300">
          {answer.explanation}
        </p>
      </div>
    </div>
  );
}

export default AnswerPanel;

