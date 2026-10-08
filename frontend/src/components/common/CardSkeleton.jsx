// frontend/src/components/common/CardSkeleton.jsx

function CardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="h-5 w-1/3 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-5 w-14 animate-pulse rounded-full bg-slate-100 dark:bg-slate-800/80" />
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3.5 w-full animate-pulse rounded bg-slate-100 dark:bg-slate-800/60" />
        <div className="h-3.5 w-4/5 animate-pulse rounded bg-slate-100 dark:bg-slate-800/60" />
      </div>
      <div className="mt-6 flex items-center justify-between pt-2">
        <div className="h-4 w-20 animate-pulse rounded bg-slate-100 dark:bg-slate-800/60" />
        <div className="h-4 w-4 animate-pulse rounded-full bg-slate-200 dark:bg-slate-800" />
      </div>
    </div>
  );
}

export default CardSkeleton;

