"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "student-life-study-time";

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export default function StudyTimer() {
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // Load saved study time
  useEffect(() => {
    const savedTime = localStorage.getItem(STORAGE_KEY);

    if (savedTime) {
      const parsedTime = Number(savedTime);

      if (!Number.isNaN(parsedTime)) {
        setTotalSeconds(parsedTime);
      }
    }

    setLoaded(true);
  }, []);

  // Save study time
  useEffect(() => {
    if (!loaded) {
      return;
    }

    localStorage.setItem(
      STORAGE_KEY,
      String(totalSeconds)
    );

    window.dispatchEvent(
      new Event("student-dashboard-updated")
    );
  }, [totalSeconds, loaded]);

  // Timer
  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      setTotalSeconds((currentTime) => currentTime + 1);
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isRunning]);

  function toggleTimer() {
    setIsRunning((currentValue) => !currentValue);
  }

  function resetTimer() {
    setIsRunning(false);
    setTotalSeconds(0);
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

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

      {/* Timer */}

      <div className="mt-6 text-center">

        <div className="text-4xl font-bold tracking-wide text-gray-800">
          {formatTime(totalSeconds)}
        </div>

        <p className="mt-2 text-sm text-gray-400">
          {isRunning ? "Study session running..." : "Timer paused"}
        </p>

      </div>

      {/* Controls */}

      <div className="mt-6 flex justify-center gap-2">

        <button
          onClick={toggleTimer}
          className={`
            rounded-xl
            px-5 py-2.5
            text-sm font-medium
            text-white
            transition-colors
            ${
              isRunning
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-blue-500 hover:bg-blue-600"
            }
          `}
        >
          {isRunning ? "⏸ Pause" : "▶ Start"}
        </button>

        <button
          onClick={resetTimer}
          className="
            rounded-xl
            bg-gray-100
            px-5 py-2.5
            text-sm font-medium
            text-gray-600
            transition-colors
            hover:bg-gray-200
          "
        >
          ↻ Reset
        </button>

      </div>

      {/* Status */}

      <div className="mt-5 rounded-xl bg-gray-50 p-3 text-center">

        <p className="text-xs text-gray-400">
          Saved study time
        </p>

        <p className="mt-1 text-sm font-medium text-gray-700">
          {Math.floor(totalSeconds / 60)} minutes
        </p>

      </div>

    </div>
  );
}