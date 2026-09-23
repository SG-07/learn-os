// frontend/src/pages/Dashboard.jsx

import { useEffect, useState } from "react";
import { getTopics } from "../api/topics";

function Dashboard() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTopics() {
      try {
        setLoading(true);
        setError("");

        const data = await getTopics();

        setTopics(data.topics);
      } catch (error) {
        console.error("Failed to load topics:", error);
        setError("Unable to load topics.");
      } finally {
        setLoading(false);
      }
    }

    fetchTopics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Topics
        </h1>

        {loading && (
          <p className="mt-6 text-gray-600 dark:text-gray-400">
            Loading topics...
          </p>
        )}

        {error && (
          <p className="mt-6 text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {!loading && !error && topics.length === 0 && (
          <p className="mt-6 text-gray-600 dark:text-gray-400">
            No topics available.
          </p>
        )}

        {!loading && !error && topics.length > 0 && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <div
                key={topic.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {topic.name}
                </h2>

                {topic.description && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {topic.description}
                  </p>
                )}

                {topic.level && (
                  <span className="mt-4 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    {topic.level}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;