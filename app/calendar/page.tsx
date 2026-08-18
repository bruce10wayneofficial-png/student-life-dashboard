"use client";

import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  type: "academic" | "social" | "sports" | "other";
};

// ─── Initial Events ───────────────────────────────────────────────────────────

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

// ─── Event Styles ────────────────────────────────────────────────────────────

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

// ─── Date Formatter ─────────────────────────────────────────────────────────

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// ─── Calendar Page ───────────────────────────────────────────────────────────

export default function CalendarPage() {
  // ── Events State ──────────────────────────────────────────────────────────

  const [events, setEvents] = useState<Event[]>(initialEvents);

  // ── Loading State ─────────────────────────────────────────────────────────

  const [isLoaded, setIsLoaded] = useState(false);

  // ── Create Event State ────────────────────────────────────────────────────

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newType, setNewType] =
    useState<Event["type"]>("academic");

  // ── Edit Event State ─────────────────────────────────────────────────────

  const [editingId, setEditingId] = useState<number | null>(null);

  const [editingTitle, setEditingTitle] = useState("");
  const [editingDate, setEditingDate] = useState("");
  const [editingTime, setEditingTime] = useState("");
  const [editingType, setEditingType] =
    useState<Event["type"]>("academic");

  // ── Filter State ─────────────────────────────────────────────────────────

  const [filterType, setFilterType] =
    useState<"all" | Event["type"]>("all");

  // ── Load Events From localStorage ─────────────────────────────────────────

  useEffect(() => {
    const savedEvents = localStorage.getItem("student-life-events");

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

  // ── Save Events To localStorage ───────────────────────────────────────────

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    localStorage.setItem(
      "student-life-events",
      JSON.stringify(events)
    );
  }, [events, isLoaded]);

  // ── Create Event ──────────────────────────────────────────────────────────

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
  }

  // ── Start Editing Event ───────────────────────────────────────────────────

  function startEditing(event: Event) {
    setEditingId(event.id);

    setEditingTitle(event.title);
    setEditingDate(event.date);
    setEditingTime(event.time);
    setEditingType(event.type);
  }

  // ── Save Edited Event ─────────────────────────────────────────────────────

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
  }

  // ── Cancel Editing ───────────────────────────────────────────────────────

  function cancelEdit() {
    setEditingId(null);

    setEditingTitle("");
    setEditingDate("");
    setEditingTime("");
    setEditingType("academic");
  }

  // ── Delete Event ──────────────────────────────────────────────────────────

  function deleteEvent(id: number) {
    setEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== id)
    );

    if (editingId === id) {
      cancelEdit();
    }
  }

  // ── Filter Events ─────────────────────────────────────────────────────────

  const filteredEvents =
    filterType === "all"
      ? events
      : events.filter((event) => event.type === filterType);

  // ── UI ────────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto">

      {/* ── Header ── */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          📅 Calendar
        </h1>

        <p className="text-gray-500 text-sm">
          Keep track of your lectures, exams, activities and
          important events.
        </p>
      </div>

      {/* ── Toolbar ── */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

        {/* Event Count */}

        <span className="text-xs text-gray-400">
          Showing {filteredEvents.length} of {events.length} events
        </span>

        <div className="flex gap-2">

          {/* Filter */}

          <select
            value={filterType}
            onChange={(e) =>
              setFilterType(
                e.target.value as "all" | Event["type"]
              )
            }
            className="
              px-3 py-2.5
              rounded-xl
              border border-gray-200
              bg-white
              text-sm text-gray-700
              focus:outline-none
              focus:ring-2
              focus:ring-blue-300
            "
          >
            <option value="all">
              All Types
            </option>

            <option value="academic">
              📚 Academic
            </option>

            <option value="social">
              🎉 Social
            </option>

            <option value="sports">
              ⚽ Sports
            </option>

            <option value="other">
              📌 Other
            </option>
          </select>

          {/* New Event */}

          <button
            onClick={() =>
              setShowCreateForm(!showCreateForm)
            }
            className="
              flex items-center gap-2
              px-4 py-2.5
              bg-blue-500 hover:bg-blue-600
              text-white text-sm font-medium
              rounded-xl
              transition-colors duration-200
            "
          >
            <span className="text-base">
              ＋
            </span>

            {showCreateForm
              ? "Close"
              : "New Event"}
          </button>

        </div>

      </div>

      {/* ── Create Event Form ── */}

      {showCreateForm && (
        <div className="
          mb-6
          bg-white
          border border-gray-200
          rounded-2xl
          p-6
          shadow-sm
        ">

          <h2 className="text-lg font-semibold text-gray-800 mb-5">
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
              w-full mb-3
              px-4 py-2.5
              rounded-xl
              border border-gray-200
              text-sm text-gray-800
              placeholder-gray-400
              focus:outline-none
              focus:ring-2
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
              w-full mb-3
              px-4 py-2.5
              rounded-xl
              border border-gray-200
              text-sm text-gray-800
              focus:outline-none
              focus:ring-2
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
              w-full mb-3
              px-4 py-2.5
              rounded-xl
              border border-gray-200
              text-sm text-gray-800
              focus:outline-none
              focus:ring-2
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
              w-full mb-5
              px-4 py-2.5
              rounded-xl
              border border-gray-200
              text-sm text-gray-800
              focus:outline-none
              focus:ring-2
              focus:ring-blue-300
            "
          >
            <option value="academic">
              📚 Academic
            </option>

            <option value="social">
              🎉 Social
            </option>

            <option value="sports">
              ⚽ Sports
            </option>

            <option value="other">
              📌 Other
            </option>
          </select>

          <div className="flex justify-end gap-2">

            <button
              onClick={() =>
                setShowCreateForm(false)
              }
              className="
                px-4 py-2
                text-sm rounded-lg
                bg-gray-100
                hover:bg-gray-200
                text-gray-600
              "
            >
              Cancel
            </button>

            <button
              onClick={createEvent}
              className="
                px-4 py-2
                text-sm rounded-lg
                bg-blue-500
                hover:bg-blue-600
                text-white
                font-medium
              "
            >
              Create Event
            </button>

          </div>

        </div>
      )}

      {/* ── Events ── */}

      <div className="space-y-4">

        {filteredEvents.length === 0 ? (

          <div className="
            bg-white
            border border-gray-200
            rounded-2xl
            p-10
            text-center
          ">

            <div className="text-4xl mb-3">
              📅
            </div>

            <h2 className="text-lg font-semibold text-gray-700">
              No events found
            </h2>

            <p className="text-sm text-gray-400 mt-1">
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
                  bg-white
                  border border-gray-200
                  rounded-2xl
                  p-5
                  shadow-sm
                  hover:shadow-md
                  transition-shadow duration-200
                "
              >

                {/* Icon */}

                <div className="text-3xl">
                  {emoji}
                </div>

                {/* Event Information */}

                <div className="flex-1">

                  <h2 className="text-base font-semibold text-gray-800">
                    {event.title}
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    📅 {formatDate(event.date)}
                  </p>

                  <p className="text-sm text-gray-500">
                    🕐 {event.time}
                  </p>

                </div>

                {/* Type */}

                <span
                  className={`
                    hidden sm:block
                    text-xs font-medium
                    px-3 py-1.5
                    rounded-full
                    capitalize
                    ${badge}
                  `}
                >
                  {event.type}
                </span>

                {/* Edit */}

                <button
                  onClick={() => startEditing(event)}
                  aria-label={`Edit event: ${event.title}`}
                  className="
                    p-2 rounded-lg
                    text-gray-300
                    hover:text-blue-500
                    hover:bg-blue-50
                    transition-colors
                  "
                >
                  ✏️
                </button>

                {/* Delete */}

                <button
                  onClick={() =>
                    deleteEvent(event.id)
                  }
                  aria-label={`Delete event: ${event.title}`}
                  className="
                    p-2 rounded-lg
                    text-gray-300
                    hover:text-red-500
                    hover:bg-red-50
                    transition-colors
                  "
                >
                  🗑️
                </button>

              </div>
            );
          })

        )}

      </div>

      {/* ── Edit Event Modal ── */}

      {editingId !== null && (

        <div className="
          fixed inset-0 z-50
          flex items-center justify-center
          bg-black/40
          p-4
        ">

          <div className="
            w-full max-w-lg
            bg-white
            rounded-2xl
            p-6
            shadow-xl
          ">

            <h2 className="text-xl font-semibold text-gray-800 mb-5">
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
                w-full mb-3
                px-4 py-2.5
                rounded-xl
                border border-gray-200
                text-sm text-gray-800
                focus:outline-none
                focus:ring-2
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
                w-full mb-3
                px-4 py-2.5
                rounded-xl
                border border-gray-200
                text-sm text-gray-800
                focus:outline-none
                focus:ring-2
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
                w-full mb-3
                px-4 py-2.5
                rounded-xl
                border border-gray-200
                text-sm text-gray-800
                focus:outline-none
                focus:ring-2
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
                w-full mb-5
                px-4 py-2.5
                rounded-xl
                border border-gray-200
                text-sm text-gray-800
                focus:outline-none
                focus:ring-2
                focus:ring-blue-300
              "
            >
              <option value="academic">
                📚 Academic
              </option>

              <option value="social">
                🎉 Social
              </option>

              <option value="sports">
                ⚽ Sports
              </option>

              <option value="other">
                📌 Other
              </option>
            </select>

            <div className="flex justify-end gap-2">

              <button
                onClick={cancelEdit}
                className="
                  px-4 py-2
                  text-sm rounded-lg
                  bg-gray-100
                  hover:bg-gray-200
                  text-gray-600
                "
              >
                Cancel
              </button>

              <button
                onClick={saveEdit}
                className="
                  px-4 py-2
                  text-sm rounded-lg
                  bg-blue-500
                  hover:bg-blue-600
                  text-white
                  font-medium
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