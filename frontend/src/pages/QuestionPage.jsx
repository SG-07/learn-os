// frontend/src/components/question/QuestionPage.jsx

import { useRouter } from "@tanstack/react-router";
import { useState } from "react";
import SchemaDesign from "../components/question/SchemaDesign";
import SqlEditor from "../components/question/SqlEditor";
import McqOptions from "../components/question/McqOptions";
import FeedbackPanel from "../components/question/FeedbackPanel";
import QuestionPanel from "../components/question/QuestionPanel";


const mockQuestion = {
  id: "q_103",
  topicName: "ORDER BY",
  type: "fix_query",
  difficulty: "Beginner",
  title: "Fix the SQL query",
  prompt:
    "The following query contains an error. Identify the problem, correct the query, and submit your answer.",
  incorrectQuery: `SELECT name
  FROM employees
  WHERE salary > 50000
  ORDER BY;`,
  schema: {
    tables: [
      {
        name: "employees",
        columns: [
          {
            name: "id",
            type: "INTEGER",
            primaryKey: true,
          },
          {
            name: "name",
            type: "VARCHAR",
          },
          {
            name: "salary",
            type: "INTEGER",
          },
          {
            name: "department_id",
            type: "INTEGER",
          },
        ],
      },
    ],
    mermaid: `erDiagram
    EMPLOYEES {
        INTEGER id PK
        VARCHAR name
        INTEGER salary
        INTEGER department_id
    }`,
  },
};

function QuestionPage() {
  const [query, setQuery] = useState(
    mockQuestion.type === "fix_query" ? mockQuestion.incorrectQuery : ""
  );

  const handleRunQuery = () => {
    console.log("Run query:", query);
  };

  const handleSubmitQuery = () => {
    console.log("Submit answer:", query);
  };

  const handleSubmitMcq = (selectedOptionId) => {
    console.log("Submit MCQ:", selectedOptionId);
  };

  const renderAnswerArea = () => {
    switch (mockQuestion.type) {
      case "mcq":
        return (
          <McqOptions
            options={mockQuestion.options}
            onSubmit={handleSubmitMcq}
          />
        );

      case "write_query":
        return (
          <SqlEditor
            value={query}
            onChange={setQuery}
            onRun={handleRunQuery}
            onSubmit={handleSubmitQuery}
          />
        );

      case "fix_query":
        return (
          <SqlEditor
            value={query}
            onChange={setQuery}
            onRun={handleRunQuery}
            onSubmit={handleSubmitQuery}
          />
        );

      default:
        return (
          <div className="flex h-full items-center justify-center bg-white dark:bg-gray-900">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Unsupported question type.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-full gap-0 overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Left: 30% - Independent Scroll */}
      <section className="w-[30%] overflow-y-auto border-r border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <QuestionPanel question={mockQuestion} />
      </section>

      {/* Right: 70% */}
      <section className="flex w-[70%] flex-col overflow-hidden">
        {/* Top: 60% - Independent Scroll */}
        <div className="h-[60%] overflow-y-auto border-b border-gray-200 dark:border-gray-800">
          {renderAnswerArea()}
        </div>

        {/* Bottom: 40% - Independent Scroll */}
        <div className="h-[40%] overflow-y-auto">
          <FeedbackPanel />
        </div>
      </section>
    </div>
  );
}

export default QuestionPage;