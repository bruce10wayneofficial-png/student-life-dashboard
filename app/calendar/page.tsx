"use client";

import { useEffect, useState } from "react";

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  type: "academic" | "social" | "sports" | "other";
};

const initialEvents: Event[] = [
  {
    id: 1,
    title: "Mathematics Lecture",
    date: "2026-08-14",
    time: "10:00",
    type: "academic",
  },
  {
    id: 2,
    title: "Programming Study Group",
    date: "2026-08-16",
    time: "15:00",
    type: "academic",
  },
  {
    id: 3,
    title: "Football Game",
    date: "2026-08-18",
    time: "18:30",
    type: "sports",
  },
];

const eventTypeStyles: Record<
  Event["type"],
  { emoji: string; badge: string }
> = {
  academic: {
    emoji: "📚",
    badge: "bg-blue-100 text-blue-700",
  },
  social: {
    emoji: "🎉",
    badge: "bg-purple-100 text-purple-700",
  },
  sports: {
    emoji: "⚽",
    badge: "bg-green-100 text-green-700",
  },
  other: {
    emoji: "📌",
    badge: "bg-gray-100 text-gray-700",
  },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function CalendarPage() {
  // ── Events ────────────────────────────────────────────────────────────────

  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [isLoaded, setIsLoaded] = useState(false);

  // ── Create Form ───────────────────────────────────────────────────────────

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newType, setNewType] =
    useState<Event["type"]>("academic");

  // ── Edit Form ─────────────────────────────────────────────────────────────

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDate, setEditingDate] = useState("");
  const [editingTime, setEditingTime] = useState("");
  const [editingType, setEditingType] =
    useState<Event["type"]>("academic");

  // ── Filter ─────────────────────────────────────────────────────────────────

  const [filterType, setFilterType] =
    useState<"all" | Event["type"]>("all");

  // ── Load events ───────────────────────────────────────────────────────────

  useEffect(() => {
    const savedEvents = localStorage.getItem(
      "student-life-events"
    );

    if (savedEvents) {
      try {
        const parsedEvents: Event[] = JSON.parse(savedEvents);
        setEvents(parsedEvents);
      } catch {
        console.log("Could not load saved events.");
      }
    }

    setIsLoaded(true);
  }, []);

  // ── Save events ───────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    localStorage.setItem(
      "student-life-events",
      JSON.stringify(events)
    );
  }, [events, isLoaded]);

  // ── Tell Dashboard that data changed ──────────────────────────────────────

  function notifyDashboard() {
    window.dispatchEvent(
      new Event("student-dashboard-updated")
    );
  }

  // ── Create event ──────────────────────────────────────────────────────────

  function createEvent() {
    const title = newTitle.trim();

    if (
      title === "" ||
      newDate === "" ||
      newTime === ""
    ) {
      return;
    }

    const newEvent: Event = {
      id: Date.now(),
      title,
      date: newDate,
      time: newTime,
      type: newType,
    };

    setEvents((currentEvents) => [
      newEvent,
      ...currentEvents,
    ]);

    setNewTitle("");
    setNewDate("");
    setNewTime("");
    setNewType("academic");
    setShowCreateForm(false);

    notifyDashboard();
  }

  // ── Start editing ─────────────────────────────────────────────────────────

  function startEditing(event: Event) {
    setEditingId(event.id);
    setEditingTitle(event.title);
    setEditingDate(event.date);
    setEditingTime(event.time);
    setEditingType(event.type);
  }

  // ── Save edit ─────────────────────────────────────────────────────────────

  function saveEdit() {
    if (editingId === null) {
      return;
    }

    const title = editingTitle.trim();

    if (
      title === "" ||
      editingDate === "" ||
      editingTime === ""
    ) {
      return;
    }

    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.id === editingId
          ? {
              ...event,
              title,
              date: editingDate,
              time: editingTime,
              type: editingType,
            }
          : event
      )
    );

    cancelEdit();
    notifyDashboard();
  }

  // ── Cancel edit ───────────────────────────────────────────────────────────

  function cancelEdit() {
    setEditingId(null);
    setEditingTitle("");
    setEditingDate("");
    setEditingTime("");
    setEditingType("academic");
  }

  // ── Delete event ──────────────────────────────────────────────────────────

  function deleteEvent(id: number) {
    setEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== id)
    );

    if (editingId === id) {
      cancelEdit();
    }

    notifyDashboard();
  }

  // ── Filter events ──────────────────────────────────────────────────────────

  const filteredEvents =
    filterType === "all"
      ? events
      : events.filter(
          (event) => event.type === filterType
        );

  // ── UI ─────────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto">

      {/* Header */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📅 Calendar
        </h1>

        <p className="text-gray-500 text-sm">
          Keep track of your lectures, exams, activities and
          important events.
        </p>
      </div>

      {/* Toolbar */}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <span className="text-xs text-gray-400">
          Showing {filteredEvents.length} of {events.length} events
        </span>

        <div className="flex gap-2">

          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(
                e.target.value as "all" | Event["type"]
              )
            }
            className="
              rounded-xl border border-gray-200
              bg-white px-3 py-2.5
              text-sm text-gray-700
              focus:outline-none
              focus:ring-2 focus:ring-blue-300
            "
          >
            <option value="all">All Types</option>
            <option value="academic">📚 Academic</option>
            <option value="social">🎉 Social</option>
            <option value="sports">⚽ Sports</option>
            <option value="other">📌 Other</option>
          </select>

          <button
            onClick={() =>
              setShowCreateForm(!showCreateForm)
            }
            className="
              flex items-center gap-2 rounded-xl
              bg-blue-500 px-4 py-2.5
              text-sm font-medium text-white
              transition-colors hover:bg-blue-600
            "
          >
            ＋
            {showCreateForm ? "Close" : "New Event"}
          </button>

        </div>
      </div>

      {/* Create Event Form */}

      {showCreateForm && (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

          <h2 className="mb-5 text-lg font-semibold text-gray-800">
            ✨ Create New Event
          </h2>

          <input
            type="text"
            value={newTitle}
            onChange={(e) =>
              setNewTitle(e.target.value)
            }
            placeholder="Event title..."
            className="
              mb-3 w-full rounded-xl
              border border-gray-200
              px-4 py-2.5 text-sm text-gray-800
              placeholder-gray-400
              focus:outline-none focus:ring-2
              focus:ring-blue-300
            "
          />

          <input
            type="date"
            value={newDate}
            onChange={(e) =>
              setNewDate(e.target.value)
            }
            className="
              mb-3 w-full rounded-xl
              border border-gray-200
              px-4 py-2.5 text-sm text-gray-800
              focus:outline-none focus:ring-2
              focus:ring-blue-300
            "
          />

          <input
            type="time"
            value={newTime}
            onChange={(e) =>
              setNewTime(e.target.value)
            }
            className="
              mb-3 w-full rounded-xl
              border border-gray-200
              px-4 py-2.5 text-sm text-gray-800
              focus:outline-none focus:ring-2
              focus:ring-blue-300
            "
          />

          <select
            value={newType}
            onChange={(e) =>
              setNewType(
                e.target.value as Event["type"]
              )
            }
            className="
              mb-5 w-full rounded-xl
              border border-gray-200
              px-4 py-2.5 text-sm text-gray-800
              focus:outline-none focus:ring-2
              focus:ring-blue-300
            "
          >
            <option value="academic">📚 Academic</option>
            <option value="social">🎉 Social</option>
            <option value="sports">⚽ Sports</option>
            <option value="other">📌 Other</option>
          </select>

          <div className="flex justify-end gap-2">

            <button
              onClick={() =>
                setShowCreateForm(false)
              }
              className="
                rounded-lg bg-gray-100
                px-4 py-2 text-sm text-gray-600
                hover:bg-gray-200
              "
            >
              Cancel
            </button>

            <button
              onClick={createEvent}
              className="
                rounded-lg bg-blue-500
                px-4 py-2 text-sm font-medium text-white
                hover:bg-blue-600
              "
            >
              Create Event
            </button>

          </div>
        </div>
      )}

      {/* Events */}

      <div className="space-y-4">

        {filteredEvents.length === 0 ? (

          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center">

            <div className="mb-3 text-4xl">📅</div>

            <h2 className="text-lg font-semibold text-gray-700">
              No events found
            </h2>

            <p className="mt-1 text-sm text-gray-400">
              Try changing the filter or create a new event.
            </p>

          </div>

        ) : (

          filteredEvents.map((event) => {

            const { emoji, badge } =
              eventTypeStyles[event.type];

            return (
              <div
                key={event.id}
                className="
                  flex items-center gap-4
                  rounded-2xl border border-gray-200
                  bg-white p-5 shadow-sm
                  transition-shadow hover:shadow-md
                "
              >

                <div className="text-3xl">
                  {emoji}
                </div>

                <div className="flex-1">

                  <h2 className="text-base font-semibold text-gray-800">
                    {event.title}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    📅 {formatDate(event.date)}
                  </p>

                  <p className="text-sm text-gray-500">
                    🕐 {event.time}
                  </p>

                </div>

                <span
                  className={`
                    hidden rounded-full
                    px-3 py-1.5
                    text-xs font-medium capitalize
                    sm:block
                    ${badge}
                  `}
                >
                  {event.type}
                </span>

                <button
                  onClick={() =>
                    startEditing(event)
                  }
                  aria-label={`Edit event: ${event.title}`}
                  className="
                    rounded-lg p-2
                    text-gray-300
                    hover:bg-blue-50
                    hover:text-blue-500
                  "
                >
                  ✏️
                </button>

                <button
                  onClick={() =>
                    deleteEvent(event.id)
                  }
                  aria-label={`Delete event: ${event.title}`}
                  className="
                    rounded-lg p-2
                    text-gray-300
                    hover:bg-red-50
                    hover:text-red-500
                  "
                >
                  🗑️
                </button>

              </div>
            );
          })
        )}

      </div>

      {/* Edit Modal */}

      {editingId !== null && (
        <div className="
          fixed inset-0 z-50
          flex items-center justify-center
          bg-black/40 p-4
        ">

          <div className="
            w-full max-w-lg
            rounded-2xl bg-white
            p-6 shadow-xl
          ">

            <h2 className="mb-5 text-xl font-semibold text-gray-800">
              ✏️ Edit Event
            </h2>

            <input
              type="text"
              value={editingTitle}
              onChange={(e) =>
                setEditingTitle(e.target.value)
              }
              placeholder="Event title..."
              className="
                mb-3 w-full rounded-xl
                border border-gray-200
                px-4 py-2.5 text-sm text-gray-800
                focus:outline-none focus:ring-2
                focus:ring-blue-300
              "
            />

            <input
              type="date"
              value={editingDate}
              onChange={(e) =>
                setEditingDate(e.target.value)
              }
              className="
                mb-3 w-full rounded-xl
                border border-gray-200
                px-4 py-2.5 text-sm text-gray-800
                focus:outline-none focus:ring-2
                focus:ring-blue-300
              "
            />

            <input
              type="time"
              value={editingTime}
              onChange={(e) =>
                setEditingTime(e.target.value)
              }
              className="
                mb-3 w-full rounded-xl
                border border-gray-200
                px-4 py-2.5 text-sm text-gray-800
                focus:outline-none focus:ring-2
                focus:ring-blue-300
              "
            />

            <select
              value={editingType}
              onChange={(e) =>
                setEditingType(
                  e.target.value as Event["type"]
                )
              }
              className="
                mb-5 w-full rounded-xl
                border border-gray-200
                px-4 py-2.5 text-sm text-gray-800
                focus:outline-none focus:ring-2
                focus:ring-blue-300
              "
            >
              <option value="academic">📚 Academic</option>
              <option value="social">🎉 Social</option>
              <option value="sports">⚽ Sports</option>
              <option value="other">📌 Other</option>
            </select>

            <div className="flex justify-end gap-2">

              <button
                onClick={cancelEdit}
                className="
                  rounded-lg bg-gray-100
                  px-4 py-2 text-sm text-gray-600
                  hover:bg-gray-200
                "
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                className="
                  rounded-lg bg-blue-500
                  px-4 py-2 text-sm font-medium text-white
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