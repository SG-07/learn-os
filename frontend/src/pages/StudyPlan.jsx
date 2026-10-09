import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BookOpen, CheckCircle2, ChevronDown, Circle, Search } from "lucide-react";

import { getProgress } from "../api/progress";
import { getQuestionById, getQuestionsByTopic } from "../api/questions";
import { getTopics } from "../api/topics";
import BackButton from "../components/common/BackButton";
import { auditQuestionDifficulties, orderQuestions, questionDifficulty } from "../data/questionDifficulty";

const CURRICULUM = [
  "SELECT basics",
  "WHERE conditions",
  "ORDER BY",
  "GROUP BY",
  "HAVING",
  "LIMIT & OFFSET",
  "Basic JOINs",
  "Complex JOINs",
  "Subqueries",
  "CTEs",
];

const TOPIC_DESCRIPTIONS = {
  "SELECT basics": "Retrieve and shape columns from a table.",
  "WHERE conditions": "Keep only the rows that match a condition.",
  "ORDER BY": "Sort results so the sequence is part of the answer.",
  "GROUP BY": "Collapse rows into one summary per group.",
  "HAVING": "Filter groups after they have been aggregated.",
  "LIMIT & OFFSET": "Return a slice of a sorted result.",
  "Basic JOINs": "Combine related tables through a shared key.",
  "Complex JOINs": "Use outer joins and multi-table matches.",
  Subqueries: "Answer a question with a query nested inside another.",
  CTEs: "Name an intermediate result, then query that result.",
};

function StudyPlan() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState(undefined);

  const topicsQuery = useQuery({
    queryKey: ["topics"],
    queryFn: getTopics,
  });

  const progressQuery = useQuery({
    queryKey: ["progress"],
    queryFn: async () => {
      try {
        return await getProgress();
      } catch {
        return { progress: [] };
      }
    },
  });

  const topics = orderTopics(topicsQuery.data?.topics);
  const solvedByTopic = new Map(
    (progressQuery.data?.progress || []).map((row) => [row.topicId, Number(row.problemsSolved) || 0]),
  );
  const openTopicId = selectedTopicId === undefined ? topics[0]?.id ?? null : selectedTopicId;
  const query = searchTerm.trim().toLowerCase();
  const visibleTopics = topics.filter((topic) => {
    if (!query) return true;
    const description = topicDescription(topic.name).toLowerCase();
    return topic.name.toLowerCase().includes(query) || description.includes(query);
  });

  const totalQuestions = topics.reduce((sum, topic) => sum + topicCount(topic), 0);
  const totalSolved = topics.reduce(
    (sum, topic) => sum + Math.min(solvedByTopic.get(topic.id) || 0, topicCount(topic)),
    0,
  );

  return (
    <div className="min-h-full bg-slate-50/50 p-4 sm:p-8 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <BackButton to="/dashboard" label="Dashboard" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200/80 bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
            {totalSolved}/{totalQuestions || 0} solved
          </span>
        </div>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                <BookOpen className="h-4 w-4" />
              </span>
              <p className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                SQL Coach
              </p>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
              SQL Study Plan
            </h1>
            <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">
              Master SQL step by step through structured practice.
            </p>
          </div>

          <div className="relative w-full max-w-xs">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search topics..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-2xl border border-slate-200/80 bg-white py-2 pl-9 pr-4 text-xs text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-800 dark:bg-slate-900 dark:text-white dark:placeholder:text-slate-500"
            />
          </div>
        </div>

        {topicsQuery.isPending && (
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, index) => (
              <div
                key={index}
                className="h-24 animate-pulse rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900"
              />
            ))}
          </div>
        )}

        {topicsQuery.isError && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-center dark:border-rose-950/60 dark:bg-rose-950/20">
            <p className="text-sm font-semibold text-rose-700 dark:text-rose-400">
              Unable to load topics. Please try again later.
            </p>
          </div>
        )}

        {!topicsQuery.isPending && !topicsQuery.isError && visibleTopics.length === 0 && (
          <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No matching topics</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Try searching with a different topic name.
            </p>
          </div>
        )}

        {!topicsQuery.isPending && !topicsQuery.isError && visibleTopics.length > 0 && (
          <div className="space-y-3">
            {visibleTopics.map((topic) => (
              <TopicSection
                key={topic.id}
                topic={topic}
                number={topic.curriculumIndex}
                solvedCount={solvedByTopic.get(topic.id) || 0}
                expanded={openTopicId === topic.id}
                onToggle={() => setSelectedTopicId((current) => {
                  const openId = current === undefined ? topics[0]?.id ?? null : current;
                  return openId === topic.id ? null : topic.id;
                })}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TopicSection({ topic, number, solvedCount, expanded, onToggle }) {
  const questionsQuery = useQuery({
    queryKey: ["study-plan-questions", topic.id],
    queryFn: () => loadTopicQuestions(topic.id),
    enabled: expanded,
  });

  const total = topicCount(topic);
  const questions = orderQuestions(questionsQuery.data?.questions || []);
  const knownSolved = questions.filter((question) => question.solved).length;

  useEffect(() => {
    if (!import.meta.env.DEV || !questionsQuery.isSuccess) return;
    const issues = auditQuestionDifficulties(questionsQuery.data?.questions || []);
    if (issues.length > 0) {
      console.warn("Study plan questions are missing a difficulty mapping", issues);
    }
  }, [questionsQuery.isSuccess, questionsQuery.data]);

  const progressTotal = questionsQuery.isSuccess && questions.length > 0 ? questions.length : total;
  const solved = Math.min(Math.max(solvedCount, knownSolved), progressTotal || 0);
  const percent = progressTotal > 0 ? Math.round((solved / progressTotal) * 100) : 0;

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="flex w-full items-start gap-4 px-4 py-4 text-left sm:px-5"
      >
        <span className="mt-0.5 w-8 shrink-0 font-mono text-sm font-semibold text-indigo-600 dark:text-indigo-400">
          {String(number).padStart(2, "0")}
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-base font-bold text-slate-900 dark:text-white">{topic.name}</span>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {solved}/{progressTotal}
            </span>
          </span>
          <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
            {topicDescription(topic.name)}
          </span>
          <span className="mt-3 block h-1.5 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <span
              className="block h-full rounded-full bg-indigo-600 dark:bg-indigo-400"
              style={{ width: `${percent}%` }}
            />
          </span>
        </span>
        <ChevronDown
          className={`mt-1 h-4 w-4 shrink-0 text-slate-400 transition-transform ${expanded ? "rotate-180" : ""}`}
        />
      </button>

      {expanded && (
        <div className="border-t border-slate-100 px-4 py-2 dark:border-slate-800 sm:px-5">
          {questionsQuery.isPending && (
            <p className="py-4 text-xs text-slate-500 dark:text-slate-400">Loading questions...</p>
          )}
          {questionsQuery.isError && (
            <p className="py-4 text-xs font-semibold text-rose-700 dark:text-rose-400">
              Unable to load questions for this topic.
            </p>
          )}
          {questionsQuery.isSuccess && questions.length === 0 && (
            <p className="py-4 text-xs text-slate-500 dark:text-slate-400">No questions in this topic yet.</p>
          )}
          {questionsQuery.isSuccess && questions.length > 0 && (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {questions.map((question) => (
                <QuestionRow key={question.id} question={question} />
              ))}
            </ul>
          )}
          <div className="flex justify-end py-3">
            <Link
              to="/topics/$topicId"
              params={{ topicId: topic.id }}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              Open topic page
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}

function QuestionRow({ question }) {
  const title = question.prompt || question.title || question.name || "Practice question";
  const difficulty = questionDifficulty(question) || "unknown";

  return (
    <li className="flex items-center gap-3 py-3">
      {question.solved ? (
        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" aria-label="Solved" />
      ) : (
        <Circle className="h-4 w-4 shrink-0 text-slate-300 dark:text-slate-600" aria-label="Not solved" />
      )}
      <p className="min-w-0 flex-1 text-sm text-slate-800 dark:text-slate-200">{title}</p>
      <DifficultyBadge difficulty={difficulty} />
      <Link
        to="/questions/$questionId"
        params={{ questionId: question.id }}
        className="shrink-0 rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-slate-700 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
      >
        Solve
      </Link>
    </li>
  );
}

function DifficultyBadge({ difficulty }) {
  const styles = {
    easy: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
    medium: "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300",
    hard: "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300",
    unknown: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
  };
  const label = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

  return (
    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${styles[difficulty]}`}>
      {label}
    </span>
  );
}

async function loadTopicQuestions(topicId) {
  const list = await getQuestionsByTopic(topicId);
  const questions = Array.isArray(list?.questions) ? list.questions : [];
  const detailed = await Promise.all(
    questions.map(async (question) => {
      try {
        const detail = await getQuestionById(question.id);
        return {
          ...question,
          prompt: detail?.prompt || detail?.title || question.name || question.title,
          solved: Boolean(detail?.solved),
        };
      } catch {
        return { ...question, solved: Boolean(question.solved) };
      }
    }),
  );

  return { questions: detailed };
}

function orderTopics(topics) {
  const rows = Array.isArray(topics) ? topics.filter((topic) => topic?.id && topic?.name) : [];
  return rows
    .map((topic, index) => ({ topic, index }))
    .sort((left, right) => {
      const leftOrder = curriculumOrder(left.topic.name);
      const rightOrder = curriculumOrder(right.topic.name);
      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      return left.index - right.index;
    })
    .map((entry, index) => ({ ...entry.topic, curriculumIndex: index + 1 }));
}

function curriculumOrder(name) {
  const index = CURRICULUM.indexOf(name);
  return index === -1 ? CURRICULUM.length : index;
}

function topicDescription(name) {
  return TOPIC_DESCRIPTIONS[name] || "Practice the questions in this topic.";
}

function topicCount(topic) {
  const count = Number(topic?.questionCount);
  return Number.isFinite(count) && count > 0 ? count : 0;
}

export default StudyPlan;