// components/TaskList.tsx

"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

// ─── Initial Data ─────────────────────────────────────────────────────────────

const initialTasks: Task[] = [
  { id: 1, title: "Finish math homework",         completed: true  },
  { id: 2, title: "Read chapter 4 of Biology",    completed: false },
  { id: 3, title: "Prepare English presentation", completed: false },
  { id: 4, title: "Review lecture notes",         completed: true  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function TaskList() {

  // ── State ───────────────────────────────────────────────────────────────────

  const [tasks,      setTasks     ] = useState<Task[]>(initialTasks);
  const [inputValue, setInputValue] = useState<string>("");

  // Tracks WHICH task is currently being edited (null = no task is being edited)
  const [editingId,    setEditingId   ] = useState<number | null>(null);

  // Tracks the live text inside the edit input field
  const [editingTitle, setEditingTitle] = useState<string>("");

  // ── Toggle Task ─────────────────────────────────────────────────────────────

  function toggleTask(id: number) {
    // Do not allow toggling while a task is being edited
    if (editingId !== null) return;

    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  }

  // ── Add Task ────────────────────────────────────────────────────────────────

  function addTask() {
    const trimmed = inputValue.trim();
    if (trimmed === "") return;

    const newTask: Task = {
      id: Date.now(),
      title: trimmed,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setInputValue("");
  }

  // ── Delete Task ─────────────────────────────────────────────────────────────

  function deleteTask(e: React.MouseEvent<HTMLButtonElement>, id: number) {
    e.stopPropagation();
    setTasks(tasks.filter((task) => task.id !== id));
  }

  // ── Edit Task — Step 1: Start editing ───────────────────────────────────────

  function startEditing(e: React.MouseEvent<HTMLButtonElement>, task: Task) {
    e.stopPropagation(); // Prevent the click from toggling the task

    setEditingId(task.id);       // Remember WHICH task is being edited
    setEditingTitle(task.title); // Pre-fill the edit input with the current title
  }

  // ── Edit Task — Step 2: Save the new title ──────────────────────────────────

  function saveEdit(id: number) {
    const trimmed = editingTitle.trim();
    if (trimmed === "") return; // Do not save an empty title

    setTasks(
      tasks.map((task) =>
        task.id === id
          ? { ...task, title: trimmed } // Update title, keep everything else
          : task
      )
    );

    cancelEdit(); // Clean up editing state after saving
  }

  // ── Edit Task — Step 3: Cancel without saving ───────────────────────────────

  function cancelEdit() {
    setEditingId(null);    // No task is being edited anymore
    setEditingTitle("");   // Clear the temporary edit text
  }

  // ── Handle Enter and Escape keys in the edit input ──────────────────────────

  function handleEditKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) {
    if (e.key === "Enter")  saveEdit(id);
    if (e.key === "Escape") cancelEdit();
  }

  // ── Handle Enter key in the add input ───────────────────────────────────────

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") addTask();
  }

  // ── Completed Count ─────────────────────────────────────────────────────────

  const completedCount = tasks.filter((task) => task.completed).length;

  // ─── UI ───────────────────────────────────────────────────────────────────

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xl font-semibold text-gray-800">
          ✅ Task List
        </h2>
        <span className="text-sm text-gray-500">
          {completedCount} / {tasks.length} completed
        </span>
      </div>

      {/* ── Progress Bar ── */}
      <div className="w-full bg-gray-100 rounded-full h-2 mb-5">
        <div
          className="bg-green-400 h-2 rounded-full transition-all duration-500"
          style={{
            width: tasks.length === 0
              ? "0%"
              : `${(completedCount / tasks.length) * 100}%`,
          }}
        />
      </div>

      {/* ── Task Items ── */}
      <ul className="space-y-3 mb-5">
        {tasks.length === 0 ? (

          <li className="text-center text-sm text-gray-400 py-6">
            No tasks yet. Add one below! 👇
          </li>

        ) : (

          tasks.map((task) => {

            // Is THIS specific task currently being edited?
            const isEditing = editingId === task.id;

            return (
              <li
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`
                  flex items-center gap-3 p-4 rounded-xl border
                  transition-colors duration-200
                  ${isEditing
                    ? "bg-blue-50 border-blue-200 cursor-default"
                    : task.completed
                      ? "bg-green-50 border-green-200 cursor-pointer"
                      : "bg-gray-50 border-gray-100 cursor-pointer hover:bg-gray-100"
                  }
                `}
              >

                {/* ── Checkbox Circle ── */}
                <div
                  className={`
                    w-5 h-5 rounded-full border-2 flex items-center
                    justify-center flex-shrink-0 transition-colors duration-200
                    ${task.completed && !isEditing
                      ? "bg-green-400 border-green-400"
                      : "border-gray-300"
                    }
                  `}
                >
                  {task.completed && !isEditing && (
                    <svg
                      className="w-3 h-3 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </div>

                {/* ── View Mode: show title + edit + delete buttons ── */}
                {!isEditing ? (
                  <>
                    {/* Task Title */}
                    <span
                      className={`
                        flex-1 text-sm transition-all duration-200
                        ${task.completed
                          ? "line-through text-gray-400"
                          : "text-gray-700"
                        }
                      `}
                    >
                      {task.title}
                    </span>

                    {/* Edit Button */}
                    <button
                      onClick={(e) => startEditing(e, task)}
                      aria-label={`Edit task: ${task.title}`}
                      className="
                        p-1.5 rounded-lg text-gray-300
                        hover:text-blue-400 hover:bg-blue-50
                        transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-blue-300
                      "
                    >
                      ✏️
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => deleteTask(e, task.id)}
                      aria-label={`Delete task: ${task.title}`}
                      className="
                        p-1.5 rounded-lg text-gray-300
                        hover:text-red-400 hover:bg-red-50
                        transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-red-300
                      "
                    >
                      🗑️
                    </button>
                  </>

                ) : (

                  /* ── Edit Mode: show input + Save + Cancel ── */
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="flex flex-1 items-center gap-2"
                  >

                    {/* Edit Input */}
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onKeyDown={(e) => handleEditKeyDown(e, task.id)}
                      autoFocus
                      className="
                        flex-1 text-sm px-3 py-1.5 rounded-lg border
                        border-blue-300 bg-white text-gray-800
                        focus:outline-none focus:ring-2 focus:ring-blue-300
                        transition-all duration-200
                      "
                    />

                    {/* Save Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); saveEdit(task.id); }}
                      aria-label="Save changes"
                      className="
                        px-3 py-1.5 text-xs font-medium rounded-lg
                        bg-blue-400 hover:bg-blue-500 text-white
                        transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-blue-300
                      "
                    >
                      Save
                    </button>

                    {/* Cancel Button */}
                    <button
                      onClick={(e) => { e.stopPropagation(); cancelEdit(); }}
                      aria-label="Cancel editing"
                      className="
                        px-3 py-1.5 text-xs font-medium rounded-lg
                        bg-gray-100 hover:bg-gray-200 text-gray-600
                        transition-colors duration-200
                        focus:outline-none focus:ring-2 focus:ring-gray-300
                      "
                    >
                      Cancel
                    </button>

                  </div>
                )}

              </li>
            );
          })
        )}
      </ul>

      {/* ── Add Task Input ── */}
      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
          className="
            flex-1 text-sm px-4 py-2.5 rounded-xl border border-gray-200
            bg-gray-50 text-gray-800 placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-green-300
            focus:border-transparent transition-all duration-200
          "
        />
        <button
          onClick={addTask}
          className="
            px-4 py-2.5 bg-green-400 hover:bg-green-500 text-white
            text-sm font-medium rounded-xl transition-colors duration-200
            focus:outline-none focus:ring-2 focus:ring-green-300
          "
        >
          Add
        </button>
      </div>

    </div>
  );
}