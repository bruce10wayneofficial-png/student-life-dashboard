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

  // ── Create Event Form State ───────────────────────────────────────────────

  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newDate, setNewDate] = useState("");
  const [newTime, setNewTime] = useState("");
  const [newType, setNewType] =
    useState<Event["type"]>("academic");

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

    // Don't create an incomplete event
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

    // Add the new event to the beginning of the list
    setEvents((currentEvents) => [
      newEvent,
      ...currentEvents,
    ]);

    // Clear the form
    setNewTitle("");
    setNewDate("");
    setNewTime("");
    setNewType("academic");

    // Close the form
    setShowCreateForm(false);
  }

  // ── Delete Event ──────────────────────────────────────────────────────────

  function deleteEvent(id: number) {
    setEvents((currentEvents) =>
      currentEvents.filter((event) => event.id !== id)
    );
  }

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

      <div className="flex items-center justify-between mb-5">

        <span className="text-xs text-gray-400">
          {events.length} upcoming events
        </span>

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

          {/* Event Title */}

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

          {/* Date */}

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

          {/* Time */}

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

          {/* Event Type */}

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

          {/* Form Buttons */}

          <div className="flex justify-end gap-2">

            <button
              onClick={() =>
                setShowCreateForm(false)
              }
              className="
                px-4 py-2
                text-sm
                rounded-lg
                bg-gray-100
                hover:bg-gray-200
                text-gray-600
                transition-colors
              "
            >
              Cancel
            </button>

            <button
              onClick={createEvent}
              className="
                px-4 py-2
                text-sm
                rounded-lg
                bg-blue-500
                hover:bg-blue-600
                text-white
                font-medium
                transition-colors
              "
            >
              Create Event
            </button>

          </div>

        </div>
      )}

      {/* ── Events ── */}

      <div className="space-y-4">

        {events.length === 0 ? (

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
              No events
            </h2>

            <p className="text-sm text-gray-400 mt-1">
              Your upcoming events will appear here.
            </p>

          </div>

        ) : (

          events.map((event) => {

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

    </div>
  );
}