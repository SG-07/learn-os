// frontend/src/components/sql-assistant/AnswerPanel.jsx

import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";

function AnswerPanel({ answer }) {
  if (!answer) return null;

  return (
    <div className="flex flex-col gap-4 p-6">
      <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <CodeMirror
          value={answer.query}
          extensions={[sql()]}
          editable={false}
          theme="dark"
          basicSetup={{ lineNumbers: true, foldGutter: true }}
        />
      </div>
      <div>
        <h3 className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
          Explanation
        </h3>
        <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600 dark:text-gray-400">
          {answer.explanation}
        </p>
      </div>
    </div>
  );
}

export default AnswerPanel;
