type Event = {
  id: number;
  title: string;
  date: string;
  type: string;
};

const upcomingEvents: Event[] = [
  {
    id: 1,
    title: "Mathematics Lecture",
    date: "August 10, 2026",
    type: "Academic",
  },
  {
    id: 2,
    title: "German Practice",
    date: "August 12, 2026",
    type: "Study",
  },
  {
    id: 3,
    title: "Project Deadline",
    date: "August 15, 2026",
    type: "Deadline",
  },
];

export default function UpcomingEvents() {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">
          📅 Upcoming Events
        </h2>

        <span className="text-sm text-gray-400">
          {upcomingEvents.length} events
        </span>
      </div>

      <ul className="mt-4 space-y-3">
        {upcomingEvents.map((event) => (
          <li
            key={event.id}
            className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3"
          >
            <div>
              <p className="text-sm font-medium text-gray-800">
                {event.title}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                📅 {event.date}
              </p>
            </div>

            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
              {event.type}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}