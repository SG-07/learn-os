// frontend/src/pages/TopicQuestions.jsx

import { useParams } from "@tanstack/react-router";

function TopicQuestions() {
  const { topicId } = useParams({
    from: "/_authenticated/topics/$topicId",
  });

  return (
    <div className="min-h-screen bg-gray-100 p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Questions
        </h1>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Topic ID: {topicId}
        </p>

        {/* Fetch and display questions here */}
      </div>
    </div>
  );
}

export default TopicQuestions;