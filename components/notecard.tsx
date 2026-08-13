"use client";

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
      className={`
        flex flex-col rounded-2xl border p-5
        shadow-sm hover:shadow-md transition-shadow duration-200
        ${color}
      `}
    >
      {/* Top: Subject + Date */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`
            text-xs font-medium px-2.5 py-1 rounded-full
            ${subjectStyles[subject] ?? "bg-gray-100 text-gray-600"}
          `}
        >
          {subject}
        </span>

        <span className="text-xs text-gray-400">
          {formatDate(date)}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-base font-semibold text-gray-800 mb-2">
        {title}
      </h2>

      {/* Content */}
      <p className="text-sm text-gray-600 leading-relaxed flex-1 line-clamp-4">
        {content}
      </p>

      {/* Buttons */}
      <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-black/5">

        {/* Edit */}
        <button
          onClick={onEdit}
          aria-label={`Edit note: ${title}`}
          className="
            flex items-center gap-1.5 px-3 py-1.5
            text-xs font-medium text-gray-600
            bg-white rounded-lg border border-gray-200
            hover:bg-blue-50 hover:text-blue-600
            transition-colors duration-200
          "
        >
          ✏️ Edit
        </button>

        {/* Delete */}
        <button
          onClick={onDelete}
          aria-label={`Delete note: ${title}`}
          className="
            flex items-center gap-1.5 px-3 py-1.5
            text-xs font-medium text-red-500
            bg-white rounded-lg border border-red-200
            hover:bg-red-50
            transition-colors duration-200
          "
        >
          🗑️ Delete
        </button>

      </div>
    </div>
  );
}