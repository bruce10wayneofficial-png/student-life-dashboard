// app/notes/page.tsx

// ─── Types ────────────────────────────────────────────────────────────────────

type Note = {
  id: number;
  title: string;
  content: string;
  subject: string;
  date: string;
  color: string;
};

// ─── Example Notes Data ───────────────────────────────────────────────────────

const exampleNotes: Note[] = [
  {
    id: 1,
    title: "Probability Formulas",
    content:
      "P(A or B) = P(A) + P(B) - P(A and B). Independent events: P(A and B) = P(A) × P(B). Complement rule: P(not A) = 1 - P(A). Always check if events are mutually exclusive before applying formulas.",
    subject: "Mathematics",
    date: "2024-03-12",
    color: "bg-blue-50 border-blue-200",
  },
  {
    id: 2,
    title: "Vocabulary and Grammar",
    content:
      "Der/Die/Das — always learn nouns with their article. Key phrases: Wie geht es Ihnen? (formal) vs Wie geht's? (informal). Modal verbs: können, müssen, wollen, sollen, dürfen, mögen. Word order: verb always second in main clause.",
    subject: "German",
    date: "2024-03-14",
    color: "bg-yellow-50 border-yellow-200",
  },
  {
    id: 3,
    title: "React and Next.js Concepts",
    content:
      "useState stores data that changes over time. useEffect runs code after render. Components are just functions that return JSX. Next.js App Router uses folders as routes. 'use client' is needed for interactivity. Props pass data from parent to child.",
    subject: "Programming",
    date: "2024-03-15",
    color: "bg-purple-50 border-purple-200",
  },
];

// ─── Subject Badge Styles ─────────────────────────────────────────────────────

const subjectStyles: Record<string, string> = {
  Mathematics: "bg-blue-100 text-blue-700",
  German:      "bg-yellow-100 text-yellow-700",
  Programming: "bg-purple-100 text-purple-700",
};

// ─── Helper: Format date string into readable format ─────────────────────────

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year:  "numeric",
    month: "long",
    day:   "numeric",
  });
}

// ─── Page Component ───────────────────────────────────────────────────────────

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">

      {/* ── Page Wrapper ── */}
      <div className="max-w-5xl mx-auto">

        {/* ── Page Header ── */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            📝 My Notes
          </h1>
          <p className="text-gray-500 text-sm">
            Keep your study notes organised in one place.
            Write, edit, and review whenever you need.
          </p>
        </div>

        {/* ── Toolbar: Search + New Note Button ── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">

          {/* Search Input (visual only for now) */}
          <div className="relative flex-1">

            {/* Search Icon inside the input */}
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
              🔍
            </span>

            <input
              type="text"
              placeholder="Search notes..."
              disabled
              className="
                w-full pl-9 pr-4 py-2.5 text-sm rounded-xl
                border border-gray-200 bg-white text-gray-800
                placeholder-gray-400 cursor-not-allowed
                focus:outline-none focus:ring-2 focus:ring-blue-300
                transition-all duration-200
              "
            />
          </div>

          {/* New Note Button (visual only for now) */}
          <button
            disabled
            className="
              flex items-center justify-center gap-2
              px-5 py-2.5 bg-blue-400 text-white text-sm font-medium
              rounded-xl opacity-60 cursor-not-allowed
              transition-colors duration-200
            "
          >
            <span className="text-base leading-none">＋</span>
            New Note
          </button>

        </div>

        {/* ── Notes Count ── */}
        <p className="text-xs text-gray-400 mb-4">
          Showing {exampleNotes.length} notes
        </p>

        {/* ── Notes Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {exampleNotes.map((note) => (

            <div
              key={note.id}
              className={`
                flex flex-col rounded-2xl border p-5
                shadow-sm hover:shadow-md transition-shadow duration-200
                ${note.color}
              `}
            >

              {/* ── Card Top: Subject Badge + Date ── */}
              <div className="flex items-center justify-between mb-3">

                {/* Subject Badge */}
                <span
                  className={`
                    text-xs font-medium px-2.5 py-1 rounded-full
                    ${subjectStyles[note.subject] ?? "bg-gray-100 text-gray-600"}
                  `}
                >
                  {note.subject}
                </span>

                {/* Date */}
                <span className="text-xs text-gray-400">
                  {formatDate(note.date)}
                </span>

              </div>

              {/* ── Card Title ── */}
              <h2 className="text-base font-semibold text-gray-800 mb-2">
                {note.title}
              </h2>

              {/* ── Card Content ── */}
              <p className="text-sm text-gray-600 leading-relaxed flex-1 line-clamp-4">
                {note.content}
              </p>

              {/* ── Card Footer: Edit + Delete Buttons ── */}
              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-black/5">

                {/* Edit Button (visual only) */}
                <button
                  disabled
                  aria-label={`Edit note: ${note.title}`}
                  className="
                    flex items-center gap-1.5 px-3 py-1.5
                    text-xs font-medium text-gray-500
                    bg-white rounded-lg border border-gray-200
                    opacity-70 cursor-not-allowed
                    transition-colors duration-200
                  "
                >
                  ✏️ Edit
                </button>

                {/* Delete Button (visual only) */}
                <button
                  disabled
                  aria-label={`Delete note: ${note.title}`}
                  className="
                    flex items-center gap-1.5 px-3 py-1.5
                    text-xs font-medium text-red-400
                    bg-white rounded-lg border border-red-200
                    opacity-70 cursor-not-allowed
                    transition-colors duration-200
                  "
                >
                  🗑️ Delete
                </button>

              </div>

            </div>

          ))}
        </div>

      </div>
    </div>
  );
}