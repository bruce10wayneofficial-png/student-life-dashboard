"use client";

import { useState } from "react";
import { useAppData } from "@/components/appdataprovider";

// ─── Subject Styles ──────────────────────────────────────────────────────────

const subjectStyles: Record<string, string> = {
  Mathematics: "bg-blue-100 text-blue-700",
  German: "bg-yellow-100 text-yellow-700",
  Programming: "bg-purple-100 text-purple-700",
  Other: "bg-gray-100 text-gray-700",
};

// ─── Subject Colors ──────────────────────────────────────────────────────────

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

// ─── Notes Page ───────────────────────────────────────────────────────────────

export default function NotesPage() {
  // ── Shared Notes Data ─────────────────────────────────────────────────────

  const { notes, setNotes } = useAppData();

  // ── Search ────────────────────────────────────────────────────────────────

  const [searchQuery, setSearchQuery] = useState("");

  // ── Create Form ───────────────────────────────────────────────────────────

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [newSubject, setNewSubject] = useState("Mathematics");

  // ── Edit State ────────────────────────────────────────────────────────────

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editingTitle, setEditingTitle] =
    useState("");

  const [editingContent, setEditingContent] =
    useState("");

  const [editingSubject, setEditingSubject] =
    useState("Mathematics");

  // ── Create Note ───────────────────────────────────────────────────────────

  function createNote() {
    const title = newTitle.trim();
    const content = newContent.trim();

    if (title === "" || content === "") {
      return;
    }

    const newNote = {
      id: Date.now(),
      title,
      content,
      subject: newSubject,
      date: new Date()
        .toISOString()
        .split("T")[0],
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

  // ── Start Editing ─────────────────────────────────────────────────────────

  function startEditing(
    note: (typeof notes)[number]
  ) {
    setEditingId(note.id);
    setEditingTitle(note.title);
    setEditingContent(note.content);
    setEditingSubject(note.subject);
  }

  // ── Save Edit ─────────────────────────────────────────────────────────────

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

  // ── Cancel Edit ───────────────────────────────────────────────────────────

  function cancelEdit() {
    setEditingId(null);
    setEditingTitle("");
    setEditingContent("");
    setEditingSubject("Mathematics");
  }

  // ── Delete Note ───────────────────────────────────────────────────────────

  function deleteNote(id: number) {
    setNotes((currentNotes) =>
      currentNotes.filter(
        (note) => note.id !== id
      )
    );

    if (editingId === id) {
      cancelEdit();
    }
  }

  // ── Search ─────────────────────────────────────────────────────────────────

  const search = searchQuery
    .toLowerCase()
    .trim();

  const filteredNotes = notes.filter((note) => {
    return (
      note.title.toLowerCase().includes(search) ||
      note.content.toLowerCase().includes(search) ||
      note.subject.toLowerCase().includes(search)
    );
  });

  // ── UI ─────────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📝 My Notes
        </h1>

        <p className="text-gray-500 text-sm">
          Keep your study notes organised in one place.
          Write, edit, and review whenever you need.
        </p>
      </div>

      {/* Toolbar */}

      <div className="
        mb-6 flex flex-col gap-3
        sm:flex-row
      ">

        <div className="relative flex-1">

          <span className="
            absolute left-3 top-1/2
            -translate-y-1/2
            text-gray-400
          ">
            🔍
          </span>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(e.target.value)
            }
            placeholder="Search notes..."
            className="
              w-full rounded-xl
              border border-gray-200
              bg-white
              pl-9 pr-4 py-2.5
              text-sm text-gray-800
              placeholder-gray-400
              focus:outline-none
              focus:ring-2 focus:ring-blue-300
            "
          />

        </div>

        <button
          onClick={() =>
            setShowCreateForm(
              !showCreateForm
            )
          }
          className="
            flex items-center
            justify-center gap-2
            rounded-xl
            bg-blue-500
            px-5 py-2.5
            text-sm font-medium
            text-white
            hover:bg-blue-600
          "
        >
          ＋
          {showCreateForm
            ? "Close"
            : "New Note"}
        </button>

      </div>

      {/* Create Form */}

      {showCreateForm && (
        <div className="
          mb-8
          rounded-2xl
          border border-gray-200
          bg-white
          p-6
          shadow-sm
        ">

          <h2 className="
            mb-4
            text-lg font-semibold
            text-gray-800
          ">
            ✨ Create New Note
          </h2>

          <input
            type="text"
            value={newTitle}
            onChange={(e) =>
              setNewTitle(e.target.value)
            }
            placeholder="Note title..."
            className="
              mb-3 w-full
              rounded-xl
              border border-gray-200
              px-4 py-2.5
              text-sm text-gray-800
              focus:outline-none
              focus:ring-2 focus:ring-blue-300
            "
          />

          <textarea
            value={newContent}
            onChange={(e) =>
              setNewContent(e.target.value)
            }
            placeholder="Write your note..."
            rows={5}
            className="
              mb-3 w-full
              resize-none
              rounded-xl
              border border-gray-200
              px-4 py-2.5
              text-sm text-gray-800
              focus:outline-none
              focus:ring-2 focus:ring-blue-300
            "
          />

          <select
            value={newSubject}
            onChange={(e) =>
              setNewSubject(e.target.value)
            }
            className="
              mb-5 w-full
              rounded-xl
              border border-gray-200
              px-4 py-2.5
              text-sm text-gray-800
              focus:outline-none
              focus:ring-2 focus:ring-blue-300
            "
          >
            <option>Mathematics</option>
            <option>German</option>
            <option>Programming</option>
            <option>Other</option>
          </select>

          <div className="flex justify-end gap-2">

            <button
              onClick={() =>
                setShowCreateForm(false)
              }
              className="
                rounded-lg
                bg-gray-100
                px-4 py-2
                text-sm text-gray-600
                hover:bg-gray-200
              "
            >
              Cancel
            </button>

            <button
              onClick={createNote}
              className="
                rounded-lg
                bg-blue-500
                px-4 py-2
                text-sm font-medium
                text-white
                hover:bg-blue-600
              "
            >
              Create Note
            </button>

          </div>

        </div>
      )}

      {/* Count */}

      <p className="
        mb-4 text-xs text-gray-400
      ">
        Showing {filteredNotes.length} of{" "}
        {notes.length} notes
      </p>

      {/* Notes */}

      {filteredNotes.length === 0 ? (

        <div className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-10
          text-center
        ">

          <div className="mb-3 text-4xl">
            📝
          </div>

          <h2 className="
            text-lg font-semibold
            text-gray-700
          ">
            No notes found
          </h2>

          <p className="
            mt-1 text-sm text-gray-400
          ">
            Try a different search or
            create a new note.
          </p>

        </div>

      ) : (

        <div className="
          grid grid-cols-1
          gap-5
          sm:grid-cols-2
          lg:grid-cols-3
        ">

          {filteredNotes.map((note) => (

            <div
              key={note.id}
              className={`
                flex flex-col
                rounded-2xl
                border p-5
                shadow-sm
                hover:shadow-md
                transition-shadow
                ${note.color}
              `}
            >

              {/* Card header */}

              <div className="
                mb-3 flex
                items-center
                justify-between
              ">

                <span
                  className={`
                    rounded-full
                    px-2.5 py-1
                    text-xs font-medium
                    ${
                      subjectStyles[
                        note.subject
                      ] ??
                      "bg-gray-100 text-gray-600"
                    }
                  `}
                >
                  {note.subject}
                </span>

                <span className="
                  text-xs text-gray-400
                ">
                  {formatDate(note.date)}
                </span>

              </div>

              {/* Title */}

              <h2 className="
                mb-2
                text-base font-semibold
                text-gray-800
              ">
                {note.title}
              </h2>

              {/* Content */}

              <p className="
                flex-1
                line-clamp-4
                text-sm
                leading-relaxed
                text-gray-600
              ">
                {note.content}
              </p>

              {/* Buttons */}

              <div className="
                mt-4 flex
                items-center
                justify-end gap-2
                border-t border-black/5
                pt-4
              ">

                <button
                  onClick={() =>
                    startEditing(note)
                  }
                  className="
                    rounded-lg
                    border border-gray-200
                    bg-white
                    px-3 py-1.5
                    text-xs font-medium
                    text-gray-600
                    hover:bg-gray-100
                  "
                >
                  ✏️ Edit
                </button>

                <button
                  onClick={() =>
                    deleteNote(note.id)
                  }
                  className="
                    rounded-lg
                    border border-red-200
                    bg-white
                    px-3 py-1.5
                    text-xs font-medium
                    text-red-500
                    hover:bg-red-50
                  "
                >
                  🗑️ Delete
                </button>

              </div>

            </div>
          ))}

        </div>

      )}

      {/* Edit Modal */}

      {editingId !== null && (

        <div className="
          fixed inset-0 z-50
          flex items-center justify-center
          bg-black/40 p-4
        ">

          <div className="
            w-full max-w-lg
            rounded-2xl
            bg-white
            p-6
            shadow-xl
          ">

            <h2 className="
              mb-5
              text-xl font-semibold
              text-gray-800
            ">
              ✏️ Edit Note
            </h2>

            <input
              type="text"
              value={editingTitle}
              onChange={(e) =>
                setEditingTitle(
                  e.target.value
                )
              }
              placeholder="Note title..."
              className="
                mb-3 w-full
                rounded-xl
                border border-gray-200
                px-4 py-2.5
                text-sm text-gray-800
                focus:outline-none
                focus:ring-2 focus:ring-blue-300
              "
            />

            <textarea
              value={editingContent}
              onChange={(e) =>
                setEditingContent(
                  e.target.value
                )
              }
              rows={6}
              placeholder="Note content..."
              className="
                mb-3 w-full
                resize-none
                rounded-xl
                border border-gray-200
                px-4 py-2.5
                text-sm text-gray-800
                focus:outline-none
                focus:ring-2 focus:ring-blue-300
              "
            />

            <select
              value={editingSubject}
              onChange={(e) =>
                setEditingSubject(
                  e.target.value
                )
              }
              className="
                mb-5 w-full
                rounded-xl
                border border-gray-200
                px-4 py-2.5
                text-sm text-gray-800
                focus:outline-none
                focus:ring-2 focus:ring-blue-300
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
                  rounded-lg
                  bg-gray-100
                  px-4 py-2
                  text-sm text-gray-600
                  hover:bg-gray-200
                "
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                className="
                  rounded-lg
                  bg-blue-500
                  px-4 py-2
                  text-sm font-medium
                  text-white
                  hover:bg-blue-600
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