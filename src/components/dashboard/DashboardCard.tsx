import type { LucideIcon } from 'lucide-react';

type DashboardCardProps = {
  title: string;
  desc: string;
  icon: LucideIcon;
  iconWrapperClassName: string;
  iconClassName: string;
  onClick?: () => void;
};

export default function DashboardCard({
  title,
  desc,
  icon: Icon,
  iconWrapperClassName,
  iconClassName,
  onClick,
}: DashboardCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-left bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-3xl p-8 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer w-full"
    >
      <div className={`inline-flex p-4 rounded-2xl mb-6 ${iconWrapperClassName}`}>
        <Icon className={`w-10 h-10 ${iconClassName}`} />
      </div>

      <h3 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{desc}</p>
    </button>
  );
}