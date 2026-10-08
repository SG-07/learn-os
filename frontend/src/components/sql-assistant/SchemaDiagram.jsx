// frontend/src/components/sql-assistant/SchemaDiagram.jsx

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { Database, AlertCircle } from "lucide-react";

let mermaidInitialized = false;

function SchemaDiagram({ mermaidSource }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mermaidSource) return;

    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        fontFamily: "Plus Jakarta Sans, sans-serif",
      });
      mermaidInitialized = true;
    }

    const id = `mermaid-${Math.random().toString(36).slice(2)}`;
    let cancelled = false;

    mermaid
      .render(id, mermaidSource)
      .then(({ svg }) => {
        if (!cancelled && containerRef.current) {
          containerRef.current.innerHTML = svg;
          setError(null);
        }
      })
      .catch(() => {
        if (!cancelled) setError("Could not render ER diagram from schema.");
      });

    return () => {
      cancelled = true;
    };
  }, [mermaidSource]);

  if (!mermaidSource) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center gap-2 border-b border-slate-100 bg-slate-50/70 px-4 py-2 dark:border-slate-800 dark:bg-slate-800/50">
        <Database className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
        <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">
          Visual Relational ER Diagram
        </h3>
      </div>

      <div className="p-4">
        {error ? (
          <div className="flex items-center gap-2 text-xs text-rose-500">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        ) : (
          <div ref={containerRef} className="overflow-x-auto flex justify-center py-2" />
        )}
      </div>
    </div>
  );
}

export default SchemaDiagram;

