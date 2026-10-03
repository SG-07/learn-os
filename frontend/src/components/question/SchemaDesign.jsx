// frontend/src/components/question/SchemaDesign.jsx

import { useState } from "react";
import Modal from "../common/Modal";

function SchemaDesign({ schema }) {
  const [isSchemaOpen, setIsSchemaOpen] = useState(false);

  if (!schema?.tables?.length) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          No schema available.
        </p>
      </div>
    );
  }

  return (
    <>
      <section className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h2 className="text-[20px]! font-semibold text-gray-900 dark:text-white">
              Schema
            </h2>

            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              Tables and columns available for this question.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsSchemaOpen(true)}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
          >
            View
          </button>
        </div>

        <div className="space-y-3">
          {schema.tables.map((table) => (
            <div
              key={table.name}
              className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="border-b border-gray-200 bg-gray-50 px-3 py-2 dark:border-gray-800 dark:bg-gray-800/50">
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  {table.name}
                </p>
              </div>

              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {table.columns?.map((column) => (
                  <div
                    key={column.name}
                    className="flex items-center justify-between gap-3 px-3 py-2"
                  >
                    <div className="flex min-w-0 items-center gap-2">
                      {column.primaryKey && (
                        <span
                          className="shrink-0 text-[10px] font-semibold uppercase text-amber-600 dark:text-amber-400"
                          title="Primary key"
                        >
                          PK
                        </span>
                      )}

                      <span className="truncate text-sm text-gray-700 dark:text-gray-300">
                        {column.name}
                      </span>
                    </div>

                    <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
                      {column.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <Modal
        isOpen={isSchemaOpen}
        onClose={() => setIsSchemaOpen(false)}
        title="Database Schema"
      >
        <div className="space-y-5">
          {schema.tables.map((table) => (
            <div
              key={table.name}
              className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
            >
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-800/50">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                  {table.name}
                </h3>
              </div>

              <div>
                {table.columns?.map((column) => (
                  <div
                    key={column.name}
                    className="flex items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 last:border-b-0 dark:border-gray-800"
                  >
                    <div className="flex items-center gap-2">
                      {column.primaryKey && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                          PK
                        </span>
                      )}

                      <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {column.name}
                      </span>
                    </div>

                    <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
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