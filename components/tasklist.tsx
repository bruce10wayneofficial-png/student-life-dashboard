"use client";

import { useState } from "react";
import { useAppData } from "@/components/appdataprovider";

export default function TaskList() {
  // ── Shared task data ──────────────────────────────────────────────────────

  const { tasks, setTasks } = useAppData();

  // ── Local UI state ────────────────────────────────────────────────────────

  const [inputValue, setInputValue] = useState("");

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [editingTitle, setEditingTitle] = useState("");

  // ── Toggle task ───────────────────────────────────────────────────────────

  function toggleTask(id: number) {
    if (editingId !== null) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
            }
          : task
      )
    );
  }

  // ── Add task ──────────────────────────────────────────────────────────────

  function addTask() {
    const trimmed = inputValue.trim();

    if (trimmed === "") {
      return;
    }

    const newTask = {
      id: Date.now(),
      title: trimmed,
      completed: false,
    };

    setTasks((currentTasks) => [
      ...currentTasks,
      newTask,
    ]);

    setInputValue("");
  }

  // ── Delete task ───────────────────────────────────────────────────────────

  function deleteTask(
    e: React.MouseEvent<HTMLButtonElement>,
    id: number
  ) {
    e.stopPropagation();

    setTasks((currentTasks) =>
      currentTasks.filter(
        (task) => task.id !== id
      )
    );

    if (editingId === id) {
      cancelEdit();
    }
  }

  // ── Start editing ─────────────────────────────────────────────────────────

  function startEditing(
    e: React.MouseEvent<HTMLButtonElement>,
    task: typeof tasks[number]
  ) {
    e.stopPropagation();

    setEditingId(task.id);
    setEditingTitle(task.title);
  }

  // ── Save editing ──────────────────────────────────────────────────────────

  function saveEdit(id: number) {
    const trimmed = editingTitle.trim();

    if (trimmed === "") {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              title: trimmed,
            }
          : task
      )
    );

    cancelEdit();
  }

  // ── Cancel editing ────────────────────────────────────────────────────────

  function cancelEdit() {
    setEditingId(null);
    setEditingTitle("");
  }

  // ── Keyboard handlers ─────────────────────────────────────────────────────

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      addTask();
    }
  }

  function handleEditKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>,
    id: number
  ) {
    if (e.key === "Enter") {
      saveEdit(id);
    }

    if (e.key === "Escape") {
      cancelEdit();
    }
  }

  // ── Derived data ──────────────────────────────────────────────────────────

  const completedCount = tasks.filter(
    (task) => task.completed
  ).length;

  const progress =
    tasks.length === 0
      ? 0
      : (completedCount / tasks.length) * 100;

  // ── UI ────────────────────────────────────────────────────────────────────

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="mb-5 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-semibold text-gray-800">
            ✅ Task List
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {completedCount} of {tasks.length} completed
          </p>
        </div>

        <span className="text-2xl">
          📋
        </span>

      </div>

      {/* Progress */}

      <div className="mb-5 h-2 w-full rounded-full bg-gray-100">

        <div
          className="
            h-2 rounded-full
            bg-green-400
            transition-all duration-500
          "
          style={{
            width: `${progress}%`,
          }}
        />

      </div>

      {/* Tasks */}

      <ul className="mb-5 space-y-3">

        {tasks.length === 0 ? (

          <li className="py-6 text-center text-sm text-gray-400">
            No tasks yet. Add one below! 👇
          </li>

        ) : (

          tasks.map((task) => {

            const isEditing =
              editingId === task.id;

            return (
              <li
                key={task.id}
                onClick={() =>
                  toggleTask(task.id)
                }
                className={`
                  flex items-center gap-3
                  rounded-xl border p-4
                  transition-colors
                  ${
                    isEditing
                      ? "cursor-default border-blue-200 bg-blue-50"
                      : task.completed
                        ? "cursor-pointer border-green-200 bg-green-50"
                        : "cursor-pointer border-gray-100 bg-gray-50 hover:bg-gray-100"
                  }
                `}
              >

                {/* Checkbox */}

                <div
                  className={`
                    flex h-5 w-5 flex-shrink-0
                    items-center justify-center
                    rounded-full border-2
                    ${
                      task.completed
                        ? "border-green-400 bg-green-400 text-white"
                        : "border-gray-300"
                    }
                  `}
                >
                  {task.completed && "✓"}
                </div>

                {/* View mode */}

                {!isEditing ? (

                  <>
                    <span
                      className={`
                        flex-1 text-sm
                        ${
                          task.completed
                            ? "text-gray-400 line-through"
                            : "text-gray-700"
                        }
                      `}
                    >
                      {task.title}
                    </span>

                    {/* Edit */}

                    <button
                      onClick={(e) =>
                        startEditing(e, task)
                      }
                      aria-label={`Edit task: ${task.title}`}
                      className="
                        rounded-lg p-1.5
                        text-gray-300
                        hover:bg-blue-50
                        hover:text-blue-500
                      "
                    >
                      ✏️
                    </button>

                    {/* Delete */}

                    <button
                      onClick={(e) =>
                        deleteTask(e, task.id)
                      }
                      aria-label={`Delete task: ${task.title}`}
                      className="
                        rounded-lg p-1.5
                        text-gray-300
                        hover:bg-red-50
                        hover:text-red-500
                      "
                    >
                      🗑️
                    </button>
                  </>

                ) : (

                  /* Edit mode */

                  <div
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                    className="
                      flex flex-1
                      items-center gap-2
                    "
                  >

                    <input
                      autoFocus
                      type="text"
                      value={editingTitle}
                      onChange={(e) =>
                        setEditingTitle(
                          e.target.value
                        )
                      }
                      onKeyDown={(e) =>
                        handleEditKeyDown(
                          e,
                          task.id
                        )
                      }
                      className="
                        flex-1 rounded-lg
                        border border-blue-300
                        bg-white px-3 py-2
                        text-sm text-gray-800
                        outline-none
                        focus:ring-2
                        focus:ring-blue-300
                      "
                    />

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        saveEdit(task.id);
                      }}
                      className="
                        rounded-lg
                        bg-blue-500
                        px-3 py-2
                        text-xs font-medium
                        text-white
                        hover:bg-blue-600
                      "
                    >
                      Save
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        cancelEdit();
                      }}
                      className="
                        rounded-lg
                        bg-gray-100
                        px-3 py-2
                        text-xs font-medium
                        text-gray-600
                        hover:bg-gray-200
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

      {/* Add task */}

      <div className="
        flex gap-2
        border-t border-gray-100
        pt-4
      ">

        <input
          type="text"
          value={inputValue}
          onChange={(e) =>
            setInputValue(e.target.value)
          }
          onKeyDown={handleKeyDown}
          placeholder="Add a new task..."
          className="
            flex-1 rounded-xl
            border border-gray-200
            bg-gray-50
            px-4 py-2.5
            text-sm text-gray-800
            outline-none
            focus:ring-2 focus:ring-blue-300
          "
        />

        <button
          onClick={addTask}
          className="
            rounded-xl
            bg-blue-500
            px-4 py-2.5
            text-sm font-medium
            text-white
            hover:bg-blue-600
          "
        >
          Add
        </button>

      </div>

    </div>
  );
}