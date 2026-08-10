type NoteCardProps = {
  title: string;
  content: string;
  subject: string;
  date: string;
  color: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

const subjectStyles: Record<string, string> = {
  Mathematics: "bg-blue-100 text-blue-700",
  German: "bg-yellow-100 text-yellow-700",
  Programming: "bg-purple-100 text-purple-700",
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function NoteCard({
  title,
  content,
  subject,
  date,
  color,
  onEdit,
  onDelete,
}: NoteCardProps) {
  return (
    <div
      className={`flex flex-col rounded-2xl border p-5 shadow-sm hover:shadow-md transition-shadow duration-200 ${color}`}
    >
      {/* Subject + Date */}
      <div className="mb-3 flex items-center justify-between">
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            subjectStyles[subject] ?? "bg-gray-100 text-gray-600"
          }`}
        >
          {subject}
        </span>

        <span className="text-xs text-gray-400">
          {formatDate(date)}
        </span>
      </div>

      {/* Title */}
      <h2 className="mb-2 text-base font-semibold text-gray-800">
        {title}
      </h2>

      {/* Content */}
      <p className="flex-1 line-clamp-4 text-sm leading-relaxed text-gray-600">
        {content}
      </p>

      {/* Buttons */}
      <div className="mt-4 flex items-center justify-end gap-2 border-t border-black/5 pt-4">
        <button
          onClick={onEdit}
          aria-label={`Edit note: ${title}`}
          className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
        >
          ✏️ Edit 
        </button>

        <button
          onClick={onDelete}
          aria-label={`Delete note: ${title}`}
          className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-500 transition-colors hover:bg-red-50"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
}