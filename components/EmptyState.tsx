import Link from 'next/link';

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center animate-fade-in">
      <div className="w-24 h-24 bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-700 dark:to-gray-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
        <span className="text-5xl">{icon}</span>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{title}</h2>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-8 leading-relaxed">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
