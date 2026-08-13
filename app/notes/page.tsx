"use client";

import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Note = {
  id: number;
  title: string;
  content: string;
  subject: string;
  date: string;
  color: string;
};

// ─── Example Notes ────────────────────────────────────────────────────────────

const initialNotes: Note[] = [
  {
    id: 1,
    title: "Probability Formulas",
    content:
      "P(A or B) = P(A) + P(B) - P(A and B). Independent events: P(A and B) = P(A) × P(B). Complement rule: P(not A) = 1 - P(A).",
    subject: "Mathematics",
    date: "2026-08-06",
    color: "bg-blue-50 border-blue-200",
  },
  {
    id: 2,
    title: "Vocabulary and Grammar",
    content:
      "Der/Die/Das — always learn nouns with their article. Modal verbs: können, müssen, wollen, sollen, dürfen, mögen.",
    subject: "German",
    date: "2026-08-06",
    color: "bg-yellow-50 border-yellow-200",
  },
  {
    id: 3,
    title: "React and Next.js Concepts",
    content:
      "useState stores data that changes over time. Components are functions that return JSX. Next.js App Router uses folders as routes.",
    subject: "Programming",
    date: "2026-08-06",
    color: "bg-purple-50 border-purple-200",
  },
];

// ─── Subject Styles ──────────────────────────────────────────────────────────

const subjectStyles: Record<string, string> = {
  Mathematics: "bg-blue-100 text-blue-700",
  German: "bg-yellow-100 text-yellow-700",
  Programming: "bg-purple-100 text-purple-700",
  Other: "bg-gray-100 text-gray-700",
};

// ─── Note Colors ─────────────────────────────────────────────────────────────

const subjectColors: Record<string, string> = {
  Mathematics: "bg-blue-50 border-blue-200",
  German: "bg-yellow-50 border-yellow-200",
  Programming: "bg-purple-50 border-purple-200",
  Other: "bg-gray-50 border-gray-200",
};

// ─── Date Formatter ──────────────────────────────────────────────────────────

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function NotesPage() {
  // ── Notes State ────────────────────────────────────────────────────────────

  const [notes, setNotes] = useState<Note[]>(initialNotes);

  // This prevents us from saving the initial notes before
  // we have finished checking localStorage.
  const [notesLoaded, setNotesLoaded] = useState(false);

  // ── Search State ───────────────────────────────────────────────────────────

  const [searchQuery, setSearchQuery] = useState("");

  // ── Create Form State ──────────────────────────────────────────────────────

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newSubject, setNewSubject] = useState("Mathematics");

  // ── Edit State ─────────────────────────────────────────────────────────────

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingContent, setEditingContent] = useState("");
  const [editingSubject, setEditingSubject] = useState("");

  // ─── Load Notes From localStorage ─────────────────────────────────────────

  useEffect(() => {
    const savedNotes = localStorage.getItem("student-life-notes");

    if (savedNotes) {
      try {
        const parsedNotes: Note[] = JSON.parse(savedNotes);
        setNotes(parsedNotes);
      } catch {
        console.log("Could not load saved notes.");
      }
    }

    // Loading is finished.
    setNotesLoaded(true);
  }, []);

  // ─── Save Notes To localStorage ───────────────────────────────────────────

  useEffect(() => {
    // Do NOT save until we have finished loading.
    if (!notesLoaded) {
      return;
    }

    localStorage.setItem(
      "student-life-notes",
      JSON.stringify(notes)
    );
  }, [notes, notesLoaded]);

  // ─── Create Note ──────────────────────────────────────────────────────────

  function createNote() {
    const title = newTitle.trim();
    const content = newContent.trim();

    if (title === "" || content === "") {
      return;
    }

    const newNote: Note = {
      id: Date.now(),
      title,
      content,
      subject: newSubject,
      date: new Date().toISOString().split("T")[0],
      color:
        subjectColors[newSubject] ??
        "bg-gray-50 border-gray-200",
    };

    setNotes((currentNotes) => [
      newNote,
      ...currentNotes,
    ]);

    setNewTitle("");
    setNewContent("");
    setNewSubject("Mathematics");
    setShowCreateForm(false);
  }

  // ─── Start Editing ───────────────────────────────────────────────────────

  function startEditing(note: Note) {
    setEditingId(note.id);
    setEditingTitle(note.title);
    setEditingContent(note.content);
    setEditingSubject(note.subject);
  }

  // ─── Save Edit ───────────────────────────────────────────────────────────

  function saveEdit() {
    if (editingId === null) {
      return;
    }

    const title = editingTitle.trim();
    const content = editingContent.trim();

    if (title === "" || content === "") {
      return;
    }

    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === editingId
          ? {
              ...note,
              title,
              content,
              subject: editingSubject,
              color:
                subjectColors[editingSubject] ??
                "bg-gray-50 border-gray-200",
            }
          : note
      )
    );

    cancelEdit();
  }

  // ─── Cancel Edit ─────────────────────────────────────────────────────────

  function cancelEdit() {
    setEditingId(null);
    setEditingTitle("");
    setEditingContent("");
    setEditingSubject("");
  }

  // ─── Delete Note ─────────────────────────────────────────────────────────

  function deleteNote(id: number) {
    setNotes((currentNotes) =>
      currentNotes.filter((note) => note.id !== id)
    );

    if (editingId === id) {
      cancelEdit();
    }
  }

  // ─── Search ───────────────────────────────────────────────────────────────

  const filteredNotes = notes.filter((note) => {
    const query = searchQuery.toLowerCase();

    return (
      note.title.toLowerCase().includes(query) ||
      note.content.toLowerCase().includes(query) ||
      note.subject.toLowerCase().includes(query)
    );
  });

  // ─── UI ──────────────────────────────────────────────────────────────────

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

      <div className="flex flex-col sm:flex-row gap-3 mb-6">

        {/* Search */}

        <div className="relative flex-1">

          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            🔍
          </span>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="
              w-full pl-9 pr-4 py-2.5 text-sm rounded-xl
              border border-gray-200 bg-white text-gray-800
              placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-blue-300
              transition-all duration-200
            "
          />

        </div>

        {/* New Note */}

        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="
            flex items-center justify-center gap-2
            px-5 py-2.5 bg-blue-500 hover:bg-blue-600
            text-white text-sm font-medium rounded-xl
            transition-colors duration-200
          "
        >
          <span>＋</span>
          {showCreateForm ? "Close" : "New Note"}
        </button>

      </div>

      {/* ── Create Note Form ── */}

      {showCreateForm && (
        <div className="mb-8 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            ✨ Create New Note
          </h2>

          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Note title..."
            className="
              w-full mb-3 px-4 py-2.5 rounded-xl
              border border-gray-200 text-sm text-gray-800
              focus:outline-none focus:ring-2 focus:ring-blue-300
            "
          />

          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Write your note..."
            rows={5}
            className="
              w-full mb-3 px-4 py-2.5 rounded-xl
              border border-gray-200 text-sm text-gray-800
              resize-none
              focus:outline-none focus:ring-2 focus:ring-blue-300
            "
          />

          <select
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="
              w-full mb-4 px-4 py-2.5 rounded-xl
              border border-gray-200 text-sm text-gray-800
              focus:outline-none focus:ring-2 focus:ring-blue-300
            "
          >
            <option>Mathematics</option>
            <option>German</option>
            <option>Programming</option>
            <option>Other</option>
          </select>

          <div className="flex justify-end gap-2">

            <button
              onClick={() => setShowCreateForm(false)}
              className="
                px-4 py-2 text-sm rounded-lg
                bg-gray-100 hover:bg-gray-200
                text-gray-600
              "
            >
              Cancel
            </button>

            <button
              onClick={createNote}
              className="
                px-4 py-2 text-sm rounded-lg
                bg-blue-500 hover:bg-blue-600
                text-white font-medium
              "
            >
              Create Note
            </button>

          </div>

        </div>
      )}

      {/* ── Notes Count ── */}

      <p className="text-xs text-gray-400 mb-4">
        Showing {filteredNotes.length} of {notes.length} notes
      </p>

      {/* ── Notes Grid ── */}

      {filteredNotes.length === 0 ? (

        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

          <div className="text-4xl mb-3">
            📝
          </div>

          <h2 className="text-lg font-semibold text-gray-700">
            No notes found
          </h2>

          <p className="text-sm text-gray-400 mt-1">
            Try a different search or create a new note.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

          {filteredNotes.map((note) => (

            <div
              key={note.id}
              className={`
                flex flex-col rounded-2xl border p-5
                shadow-sm hover:shadow-md
                transition-shadow duration-200
                ${note.color}
              `}
            >

              {/* ── Card Header ── */}

              <div className="flex items-center justify-between mb-3">

                <span
                  className={`
                    text-xs font-medium px-2.5 py-1
                    rounded-full
                    ${
                      subjectStyles[note.subject] ??
                      "bg-gray-100 text-gray-600"
                    }
                  `}
                >
                  {note.subject}
                </span>

                <span className="text-xs text-gray-400">
                  {formatDate(note.date)}
                </span>

              </div>

              {/* ── Title ── */}

              <h2 className="text-base font-semibold text-gray-800 mb-2">
                {note.title}
              </h2>

              {/* ── Content ── */}

              <p className="text-sm text-gray-600 leading-relaxed flex-1 line-clamp-4">
                {note.content}
              </p>

              {/* ── Buttons ── */}

              <div className="flex items-center justify-end gap-2 mt-4 pt-4 border-t border-black/5">

                <button
                  onClick={() => startEditing(note)}
                  className="
                    flex items-center gap-1.5
                    px-3 py-1.5 text-xs font-medium
                    text-gray-600 bg-white rounded-lg
                    border border-gray-200
                    hover:bg-gray-100
                    transition-colors duration-200
                  "
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() => deleteNote(note.id)}
                  className="
                    flex items-center gap-1.5
                    px-3 py-1.5 text-xs font-medium
                    text-red-500 bg-white rounded-lg
                    border border-red-200
                    hover:bg-red-50
                    transition-colors duration-200
                  "
                >
                  🗑️ Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

      {/* ── Edit Modal ── */}

      {editingId !== null && (

        <div className="
          fixed inset-0 z-50
          flex items-center justify-center
          bg-black/40 p-4
        ">

          <div className="
            w-full max-w-lg
            bg-white rounded-2xl
            p-6 shadow-xl
          ">

            <h2 className="text-xl font-semibold text-gray-800 mb-5">
              ✏️ Edit Note
            </h2>

            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              placeholder="Note title..."
              className="
                w-full mb-3 px-4 py-2.5
                rounded-xl border border-gray-200
                text-sm text-gray-800
                focus:outline-none focus:ring-2 focus:ring-blue-300
              "
            />

            <textarea
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              placeholder="Note content..."
              rows={6}
              className="
                w-full mb-3 px-4 py-2.5
                rounded-xl border border-gray-200
                text-sm text-gray-800
                resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-300
              "
            />

            <select
              value={editingSubject}
              onChange={(e) => setEditingSubject(e.target.value)}
              className="
                w-full mb-5 px-4 py-2.5
                rounded-xl border border-gray-200
                text-sm text-gray-800
                focus:outline-none focus:ring-2 focus:ring-blue-300
              "
            >
              <option>Mathematics</option>
              <option>German</option>
              <option>Programming</option>
              <option>Other</option>
            </select>

            <div className="flex justify-end gap-2">

              <button
                onClick={cancelEdit}
                className="
                  px-4 py-2 text-sm rounded-lg
                  bg-gray-100 hover:bg-gray-200
                  text-gray-600
                "
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                className="
                  px-4 py-2 text-sm rounded-lg
                  bg-blue-500 hover:bg-blue-600
                  text-white font-medium
                "
              >
                Save Changes
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}