// frontend/src/components/sql-assistant/SchemaDiagram.jsx

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

let mermaidInitialized = false;

function SchemaDiagram({ mermaidSource }) {
  const containerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mermaidSource) return;

    if (!mermaidInitialized) {
      mermaid.initialize({ startOnLoad: false, theme: "neutral" });
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
        if (!cancelled) setError("Could not render schema diagram.");
      });

    return () => {
      cancelled = true;
    };
  }, [mermaidSource]);

  if (!mermaidSource) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
      <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
        Schema Diagram
      </h3>
      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <div ref={containerRef} className="overflow-x-auto" />
      )}
    </div>
  );
}

export default SchemaDiagram;
