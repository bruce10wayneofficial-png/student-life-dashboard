// app/notes/page.tsx

"use client";

import { useState } from "react";
import NoteCard from "@/components/notecard";

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

// ─── Page Component ───────────────────────────────────────────────────────────

export default function NotesPage() {

  // ── Search State ────────────────────────────────────────────────────────────

  // Stores whatever the user is currently typing
  const [searchTerm, setSearchTerm] = useState("");

  // ── Filter Notes ────────────────────────────────────────────────────────────

  // Convert the search text to lowercase so searching is not case-sensitive
  const search = searchTerm.toLowerCase().trim();

  // Keep notes that match the search text
  const filteredNotes = exampleNotes.filter((note) => {
    return (
      note.title.toLowerCase().includes(search) ||
      note.content.toLowerCase().includes(search) ||
      note.subject.toLowerCase().includes(search)
    );
  });

  // ─── UI ─────────────────────────────────────────────────────────────────────

  return (
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

      {/* ── Toolbar ── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">

        {/* Search Input */}
        <div className="relative flex-1">

          {/* Search Icon */}
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
            🔍
          </span>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes..."
            className="
              w-full pl-9 pr-4 py-2.5 text-sm rounded-xl
              border border-gray-200 bg-white text-gray-800
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-300
              focus:border-transparent
              transition-all duration-200
            "
          />

        </div>

        {/* New Note Button — we'll make this work later */}
        <button
          disabled
          className="
            flex items-center justify-center gap-2
            px-5 py-2.5 bg-blue-400 text-white text-sm font-medium
            rounded-xl opacity-60 cursor-not-allowed
          "
        >
          <span className="text-base leading-none">＋</span>
          New Note
        </button>

      </div>

      {/* ── Notes Count ── */}
      <p className="text-xs text-gray-400 mb-4">
        Showing {filteredNotes.length} of {exampleNotes.length} notes
      </p>

      {/* ── Notes Grid / Empty State ── */}

      {filteredNotes.length === 0 ? (

        // Nothing matched the search
        <div className="
          flex flex-col items-center justify-center
          py-16 text-center
          bg-gray-50 border border-gray-100 rounded-2xl
        ">
          <span className="text-4xl mb-3">
            🔍
          </span>

          <h2 className="text-lg font-semibold text-gray-700">
            No notes found
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Try searching for something else.
          </p>
        </div>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              title={note.title}
              content={note.content}
              subject={note.subject}
              date={note.date}
              color={note.color}
            />
          ))}

        </div>

      )}

    </div>
  );
}