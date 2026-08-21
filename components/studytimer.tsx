"use client";

import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type StudySessions = Record<string, number>;

const STORAGE_KEY = "student-life-study-sessions";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${String(hours).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function StudyTimer() {
  const [sessions, setSessions] = useState<StudySessions>({});
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load saved study sessions
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed: StudySessions = JSON.parse(saved);
        setSessions(parsed);
      }
    } catch {
      console.log("Could not load study sessions.");
    }

    setLoaded(true);
  }, []);

  // Timer uses elapsed time only for the current session
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1);
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isRunning]);

  // Save current session when the user pauses
  function pauseTimer() {
    if (!isRunning) {
      return;
    }

    const today = getTodayKey();

    setSessions((currentSessions) => {
      const updatedSessions = {
        ...currentSessions,
        [today]:
          (currentSessions[today] ?? 0) + elapsedSeconds,
      };

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedSessions)
      );

      return updatedSessions;
    });

    setElapsedSeconds(0);
    setIsRunning(false);

    notifyDashboard();
  }

  // Start timer
  function startTimer() {
    setIsRunning(true);
  }

  // Reset today's total
  function resetToday() {
    const today = getTodayKey();

    setIsRunning(false);
    setElapsedSeconds(0);

    setSessions((currentSessions) => {
      const updatedSessions = {
        ...currentSessions,
      };

      delete updatedSessions[today];

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedSessions)
      );

      return updatedSessions;
    });

    notifyDashboard();
  }

  // Tell dashboard to reload its data
  function notifyDashboard() {
    window.dispatchEvent(
      new Event("student-dashboard-updated")
    );
  }

  const today = getTodayKey();
  const todaySeconds = sessions[today] ?? 0;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            ⏱️ Study Timer
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Track your study time.
          </p>
        </div>

        <span className="text-2xl">
          📚
        </span>
      </div>

      {/* Current Session */}

      <div className="mt-6 text-center">

        <div className="text-4xl font-bold tracking-wide text-gray-800">
          {formatTime(elapsedSeconds)}
        </div>

        <p className="mt-2 text-sm text-gray-400">
          {isRunning
            ? "Study session running..."
            : "Ready to study"}
        </p>

      </div>

      {/* Controls */}

      <div className="mt-6 flex justify-center gap-2">

        {!isRunning ? (
          <button
            onClick={startTimer}
            className="
              rounded-xl
              bg-blue-500
              px-5 py-2.5
              text-sm font-medium
              text-white
              hover:bg-blue-600
              transition-colors
            "
          >
            ▶ Start
          </button>
        ) : (
          <button
            onClick={pauseTimer}
            className="
              rounded-xl
              bg-orange-500
              px-5 py-2.5
              text-sm font-medium
              text-white
              hover:bg-orange-600
              transition-colors
            "
          >
            ⏸ Pause & Save
          </button>
        )}

        <button
          onClick={resetToday}
          className="
            rounded-xl
            bg-gray-100
            px-5 py-2.5
            text-sm font-medium
            text-gray-600
            hover:bg-gray-200
            transition-colors
          "
        >
          ↻ Reset Today
        </button>

      </div>

      {/* Today's Total */}

      <div className="mt-5 rounded-xl bg-gray-50 p-3 text-center">

        <p className="text-xs text-gray-400">
          Today's saved study time
        </p>

        <p className="mt-1 text-sm font-medium text-gray-700">
          {Math.floor(todaySeconds / 60)} minutes
        </p>

      </div>

    </div>
  );
}