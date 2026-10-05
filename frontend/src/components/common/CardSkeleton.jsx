// frontend/src/components/common/CardSkeleton.jsx

function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <div className="h-6 w-2/3 rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-4 h-3 w-full rounded bg-gray-200 dark:bg-gray-700" />
      <div className="mt-2 h-3 w-4/5 rounded bg-gray-200 dark:bg-gray-700" />
    </div>
  );
}

export default CardSkeleton;
