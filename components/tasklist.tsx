type Task = {
  id: number;
  title: string;
  completed: boolean;
};

const tasks: Task[] = [
  { id: 1, title: "Finish math homework", completed: true },
  { id: 2, title: "Read chapter 4 of Biology", completed: false },
  { id: 3, title: "Prepare English presentation", completed: false },
  { id: 4, title: "Review lecture notes", completed: true },
];

export default function TaskList() {
  const completedCount = tasks.filter((task) => task.completed).length;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Today's Tasks
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {completedCount} of {tasks.length} done
          </p>
        </div>

        <span className="text-2xl">📋</span>
      </div>

      <ul className="mt-4 space-y-1">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50"
          >
            <span
              className={`flex h-5 w-5 items-center justify-center rounded-md border text-xs ${
                task.completed
                  ? "border-green-500 bg-green-500 text-white"
                  : "border-gray-300 bg-white"
              }`}
            >
              {task.completed && "✓"}
            </span>

            <span
              className={`text-sm ${
                task.completed
                  ? "text-gray-400 line-through"
                  : "text-gray-700"
              }`}
            >
              {task.title}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}