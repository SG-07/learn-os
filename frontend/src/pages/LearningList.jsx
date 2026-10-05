// frontend/src/pages/LearningList.jsx

import { useQuery } from "@tanstack/react-query";
import {
  Link,
  useLocation,
  useParams,
} from "@tanstack/react-router";

import { getTopics } from "../api/topics";
import { getQuestionsByTopic } from "../api/questions";
import BackButton from "../components/common/BackButton";
import CardSkeleton from "../components/common/CardSkeleton";

function LearningList() {
  const location = useLocation();
  const { topicId } = useParams({
    strict: false,
  });

  const isTopicPage = location.pathname.startsWith("/topics/");

  const { data, isPending, isError } = useQuery({
    queryKey: isTopicPage ? ["questions", topicId] : ["topics"],
    queryFn: () =>
      isTopicPage ? getQuestionsByTopic(topicId) : getTopics(),
    enabled: !isTopicPage || !!topicId,
  });

  const items = (isTopicPage ? data?.questions : data?.topics) ?? [];

  return (
    <div className="min-h-full bg-gray-100 p-8 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4">
          <BackButton
            to={isTopicPage ? "/topics" : "/dashboard"}
            label={isTopicPage ? "Topics" : "Dashboard"}
          />
        </div>
        <h1 className="text-[30px]! font-bold text-gray-900 dark:text-white">
          {isTopicPage ? "Questions" : "Topics"}
        </h1>

        {isPending && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {isError && (
          <p className="mt-6 text-red-600 dark:text-red-400">
            Unable to load data.
          </p>
        )}

        {!isPending && !isError && items.length === 0 && (
          <p className="mt-6 text-gray-600 dark:text-gray-400">
            Nothing here yet.
          </p>
        )}

        {!isPending && !isError && items.length > 0 && (
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