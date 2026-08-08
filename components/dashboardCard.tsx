type DashboardCardProps = {
  title: string;
  value: string;
  icon: string;
};

export default function DashboardCard({
  title,
  value,
  icon,
}: DashboardCardProps) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-xl">
          {icon}
        </div>

        <p className="text-sm font-medium text-gray-600">
          {title}
        </p>
      </div>

      <p className="mt-4 text-3xl font-bold text-gray-800">
        {value}
      </p>
    </div>
  );
}