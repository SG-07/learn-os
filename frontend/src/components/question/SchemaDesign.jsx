// frontend/src/components/question/SchemaDesign.jsx

import { useState } from "react";
import { Database, Key, Maximize2, Copy, Check } from "lucide-react";
import Modal from "../common/Modal";

function SchemaDesign({ schema }) {
  const [isSchemaOpen, setIsSchemaOpen] = useState(false);
  const [copiedTable, setCopiedTable] = useState(null);

  if (!schema?.tables?.length) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-4 text-center dark:border-slate-800 dark:bg-slate-900/50">
        <p className="text-xs text-slate-500 dark:text-slate-400">
          No schema specification available for this problem.
        </p>
      </div>
    );
  }

  const handleCopy = (tableName) => {
    navigator.clipboard.writeText(tableName);
    setCopiedTable(tableName);
    setTimeout(() => setCopiedTable(null), 1500);
  };

  return (
    <>
      <section className="mt-8">
        <div className="mb-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
              <Database className="h-3.5 w-3.5" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Database Schema
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Tables & column definitions
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsSchemaOpen(true)}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 active:scale-95 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800"
          >
            <Maximize2 className="h-3 w-3 text-slate-500" />
            <span>Full View</span>
          </button>
        </div>

        <div className="space-y-3">
          {schema.tables.map((table) => (
            <div
              key={table.name}
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition-all dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-3.5 py-2 dark:border-slate-800/80 dark:bg-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                    {table.name}
                  </span>
                  <span className="rounded-full bg-slate-200/60 px-1.5 py-0.2 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                    {table.columns?.length || 0} cols
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(table.name)}
                  title="Copy table name"
                  className="flex h-6 w-6 items-center justify-center rounded text-slate-400 hover:bg-slate-200/60 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                >
                  {copiedTable === table.name ? (
                    <Check className="h-3 w-3 text-emerald-500" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </button>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800/50">
                {table.columns?.map((column) => (
                  <div
                    key={column.name}
                    className="flex items-center justify-between gap-3 px-3.5 py-2 text-xs transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      {column.primaryKey && (
                        <span
                          className="inline-flex items-center gap-0.5 rounded-md bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/40 dark:text-amber-300 dark:ring-amber-500/30"
                          title="Primary Key"
                        >
                          <Key className="h-2.5 w-2.5" />
                          PK
                        </span>
                      )}

                      <span className="truncate font-mono font-medium text-slate-700 dark:text-slate-300">
                        {column.name}
                      </span>
                    </div>

                    <span className="shrink-0 font-mono text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      {column.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Full Screen Schema View Modal */}
      <Modal
        isOpen={isSchemaOpen}
        onClose={() => setIsSchemaOpen(false)}
        title="Complete Database Schema"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {schema.tables.map((table) => (
            <div
              key={table.name}
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="border-b border-slate-200/80 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-800/60">
                <h3 className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                  {table.name}
                </h3>
              </div>

              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {table.columns?.map((column) => (
                  <div
                    key={column.name}
                    className="flex items-center justify-between gap-4 px-4 py-2.5"
                  >
                    <div className="flex items-center gap-2">
                      {column.primaryKey && (
                        <span className="inline-flex items-center gap-0.5 rounded bg-amber-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                          <Key className="h-2.5 w-2.5" />
                          PK
                        </span>
                      )}

                      <span className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {column.name}
                      </span>
                    </div>

                    <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
                      {column.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}

export default SchemaDesign;