// frontend/src/pages/LearningList.jsx

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "@tanstack/react-router";
import {
  BookOpen,
  Database,
  Search,
  CheckCircle2,
  Code2,
  HelpCircle,
  ArrowRight,
  Layers,
  Sparkles,
  Terminal,
} from "lucide-react";

import { getTopics } from "../api/topics";
import { getQuestionsByTopic } from "../api/questions";
import BackButton from "../components/common/BackButton";
import CardSkeleton from "../components/common/CardSkeleton";
import { questionDifficulty } from "../data/questionDifficulty";

function LearningList() {
  const [searchTerm, setSearchTerm] = useState("");
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

  const topicsLookup = useQuery({
    queryKey: ["topics"],
    queryFn: getTopics,
    enabled: isTopicPage,
  });

  const rawItems = (isTopicPage ? data?.questions : data?.topics) ?? [];
  const topicName =
    topicsLookup.data?.topics?.find((topic) => topic.id === topicId)?.name || "";
  const showTopicSkeleton = isTopicPage && !topicName && !isError && (isPending || topicsLookup.isPending);

  const filteredItems = rawItems.filter((item) => {
    const nameMatch = (item.name || item.title || "").toLowerCase().includes(searchTerm.toLowerCase());
    const descMatch = (item.description || item.prompt || "").toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || descMatch;
  });

  const getDifficultyBadge = (difficulty) => {
    const d = String(difficulty || "").toLowerCase();
    if (d === "easy") {
      return (
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          Easy
        </span>
      );
    }
    if (d === "medium") {
      return (
        <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
          Medium
        </span>
      );
    }
    if (d === "hard") {
      return (
        <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
          Hard
        </span>
      );
    }
    return (
      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        Unknown
      </span>
    );
  };

  return (
    <div className="min-h-full bg-slate-50/50 p-4 sm:p-8 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Navigation & Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <BackButton
              to={isTopicPage ? "/topics" : "/dashboard"}
              label={isTopicPage ? "All Topics" : "Dashboard"}
            />
            {isTopicPage && topicName && (
              <>
                <span className="text-xs text-slate-300 dark:text-slate-600" aria-hidden="true">
                  /
                </span>
                <span className="text-xs font-semibold text-slate-900 dark:text-white">
                  {topicName}
                </span>
              </>
            )}
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            <Layers className="h-3.5 w-3.5 text-indigo-500" />
            {rawItems.length} {isTopicPage ? "Questions" : "Topics"}
          </span>
        </div>

        {/* Page Header with Search */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                {isTopicPage ? <Code2 className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {isTopicPage ? "Topic Practice" : "Course Curriculum"}
              </p>
            </div>
            {isTopicPage ? (
              <>
                <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                  {showTopicSkeleton ? (
                    <span className="inline-block h-8 w-48 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
                  ) : (
                    topicName || "Practice Questions"
                  )}
                </h1>
                {topicName && (
                  <p className="mt-1 text-sm font-semibold text-slate-800 dark:text-slate-200">
                    Practice Questions
                  </p>
                )}
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                  Select a problem below to solve interactively in the workspace.
                </p>
              </>
            ) : (
              <>
                <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                  Explore SQL Topics
                </h1>
                <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
                  Master relational databases step-by-step with structured modules and guided exercises.
                </p>
              </>
            )}
          </div>

          {/* Search Box */}
          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={isTopicPage ? "Search questions..." : "Search topics..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-2xl border border-slate-200/80 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Loading State */}
        {isPending && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error State */}
        {isError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-center dark:border-rose-950/60 dark:bg-rose-950/20">
            <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
              Unable to load {isTopicPage ? "questions" : "topics"}. Please try again later.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!isPending && !isError && filteredItems.length === 0 && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-slate-800">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-base font-bold text-slate-900 dark:text-white">
              No matching items found
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              {searchTerm ? "Try searching with a different keyword." : "There are no items currently available in this section."}
            </p>
          </div>
        )}

        {/* Items Grid */}
        {!isPending && !isError && filteredItems.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item, idx) => {
              const title = item.name || item.title || `Item ${idx + 1}`;
              const desc = item.description || item.prompt;
              const isSolved = item.solved;

              return (
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
                  className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/10 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/40"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-300 dark:group-hover:bg-indigo-950/60 dark:group-hover:text-indigo-400">
                        {isTopicPage ? (
                          <Terminal className="h-5 w-5" />
                        ) : (
                          <Database className="h-5 w-5" />
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {isTopicPage && getDifficultyBadge(questionDifficulty(item))}
                        {isSolved && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                            <CheckCircle2 className="h-3 w-3" />
                            Solved
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <h2 className="text-base font-bold text-slate-900 transition-colors group-hover:text-indigo-600 dark:text-white dark:group-hover:text-indigo-400">
                        {title}
                      </h2>

                      {desc && (
                        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                          {desc}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500 transition-colors group-hover:text-indigo-600 dark:border-slate-800/80 dark:text-slate-400 dark:group-hover:text-indigo-400">
                    <span>{isTopicPage ? "Solve Challenge" : "Browse Questions"}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default LearningList;