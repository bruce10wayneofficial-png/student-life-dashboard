"use client";

import { useEffect, useState } from "react";

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  type: "academic" | "social" | "sports" | "other";
};

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
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function UpcomingEvents() {
  const [events, setEvents] = useState<Event[]>([]);

  function loadEvents() {
    const savedEvents = localStorage.getItem(
      "student-life-events"
    );

    if (savedEvents) {
      try {
        const parsedEvents: Event[] = JSON.parse(savedEvents);

        const today =
          new Date().toISOString().split("T")[0];

        const upcoming = parsedEvents
          .filter((event) => event.date >= today)
          .sort((a, b) => {
            const first = `${a.date} ${a.time}`;
            const second = `${b.date} ${b.time}`;

            return first.localeCompare(second);
          });

        setEvents(upcoming);
      } catch {
        console.log("Could not load upcoming events.");
        setEvents([]);
      }
    } else {
      setEvents([]);
    }
  }

  useEffect(() => {
    loadEvents();

    function handleDashboardUpdate() {
      loadEvents();
    }

    window.addEventListener(
      "student-dashboard-updated",
      handleDashboardUpdate
    );

    window.addEventListener(
      "storage",
      handleDashboardUpdate
    );

    return () => {
      window.removeEventListener(
        "student-dashboard-updated",
        handleDashboardUpdate
      );

      window.removeEventListener(
        "storage",
        handleDashboardUpdate
      );
    };
  }, []);

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">

      <div className="flex items-center justify-between">

        <h2 className="text-lg font-semibold text-gray-800">
          📅 Upcoming Events
        </h2>

        <span className="text-sm text-gray-400">
          {events.length} events
        </span>

      </div>

      {events.length === 0 ? (

        <div className="mt-4 rounded-lg bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-400">
            No upcoming events.
          </p>
        </div>

      ) : (

        <ul className="mt-4 space-y-3">

          {events.map((event) => {

            const { emoji, badge } =
              eventTypeStyles[event.type];

            return (
              <li
                key={event.id}
                className="
                  flex items-center justify-between
                  rounded-lg border border-gray-100
                  bg-gray-50 p-3
                "
              >

                <div className="flex items-start gap-3">

                  <span className="text-xl">
                    {emoji}
                  </span>

                  <div>

                    <p className="text-sm font-medium text-gray-800">
                      {event.title}
                    </p>

                    <p className="mt-1 text-xs text-gray-500">
                      📅 {formatDate(event.date)}
                    </p>

                    <p className="text-xs text-gray-500">
                      🕐 {event.time}
                    </p>

                  </div>

                </div>

                <span
                  className={`
                    rounded-full
                    px-3 py-1
                    text-xs font-medium
                    capitalize
                    ${badge}
                  `}
                >
                  {event.type}
                </span>

              </li>
            );
          })}

        </ul>

      )}

    </section>
  );
}