// frontend/src/pages/LearningList.jsx

import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useParams,
} from "@tanstack/react-router";

import { getTopics } from "../api/topics";
// import { getQuestions } from "../api/questions";

function LearningList() {
  const location = useLocation();
  const { topicId } = useParams({
    strict: false,
  });

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const isTopicPage = location.pathname.startsWith("/topics/");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");

        if (isTopicPage) {
          const data = await getQuestionsByTopic(topicId);
          setItems(data.questions);
        } else {
          const data = await getTopics();
          setItems(data.topics);
        }
      } catch (error) {
        console.error("Failed to load data:", error);
        setError("Unable to load data.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [isTopicPage, topicId]);

  return (
    <div className="min-h-screen bg-gray-100 p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {isTopicPage ? "Questions" : "Topics"}
        </h1>

        {/* loading/error/empty states */}

        {!loading && !error && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <Link
                key={item.id}
                to={
                  isTopicPage
                    ? "/questions/$questionId"
                    : "/topics/$topicId"
                }
                params={
                  isTopicPage
                    ? { questionId: item.id }
                    : { topicId: item.id }
                }
                className="block rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {item.name}
                </h2>

                {item.description && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default LearningList;