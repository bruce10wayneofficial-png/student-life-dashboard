"use client";

import { useEffect, useState } from "react";
import { useAppData } from "@/components/appdataprovider";

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return [hours, minutes, seconds]
    .map((value) => String(value).padStart(2, "0"))
    .join(":");
}

export default function StudyTimer() {
  // ── Shared study data ─────────────────────────────────────────────────────

  const {
    studySessions,
    setStudySessions,
  } = useAppData();

  // ── Local timer state ─────────────────────────────────────────────────────

  const [elapsedSeconds, setElapsedSeconds] =
    useState(0);

  const [isRunning, setIsRunning] =
    useState(false);

  // ── Timer ─────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const interval = window.setInterval(() => {
      setElapsedSeconds(
        (currentSeconds) => currentSeconds + 1
      );
    }, 1000);

    return () => {
      window.clearInterval(interval);
    };
  }, [isRunning]);

  // ── Start timer ───────────────────────────────────────────────────────────

  function startTimer() {
    setIsRunning(true);
  }

  // ── Pause + save timer ────────────────────────────────────────────────────

  function pauseTimer() {
    if (!isRunning) {
      return;
    }

    const today = getTodayKey();

    setStudySessions((currentSessions) => ({
      ...currentSessions,
      [today]:
        (currentSessions[today] ?? 0) +
        elapsedSeconds,
    }));

    setElapsedSeconds(0);
    setIsRunning(false);
  }

  // ── Reset today's study time ──────────────────────────────────────────────

  function resetToday() {
    const today = getTodayKey();

    setIsRunning(false);
    setElapsedSeconds(0);

    setStudySessions((currentSessions) => {
      const updatedSessions = {
        ...currentSessions,
      };

      delete updatedSessions[today];

      return updatedSessions;
    });
  }

  // ── Today's saved time ────────────────────────────────────────────────────

  const today = getTodayKey();

  const todaySeconds =
    studySessions[today] ?? 0;

  // ── UI ─────────────────────────────────────────────────────────────────────

  return (
    <div className="
      rounded-2xl
      border border-gray-200
      bg-white
      p-6
      shadow-sm
    ">

      {/* Header */}

      <div className="flex items-center justify-between">

        <div>
          <h2 className="
            text-lg font-semibold
            text-gray-800
          ">
            ⏱️ Study Timer
          </h2>

          <p className="
            mt-1 text-sm text-gray-500
          ">
            Track your study time.
          </p>
        </div>

        <span className="text-2xl">
          📚
        </span>

      </div>

      {/* Current Session */}

      <div className="mt-6 text-center">

        <div className="
          text-4xl font-bold
          tracking-wide
          text-gray-800
        ">
          {formatTime(elapsedSeconds)}
        </div>

        <p className="
          mt-2 text-sm text-gray-400
        ">
          {isRunning
            ? "Study session running..."
            : "Ready to study"}
        </p>

      </div>

      {/* Controls */}

      <div className="
        mt-6 flex
        justify-center gap-2
      ">

        {!isRunning ? (

          <button
            onClick={startTimer}
            className="
              rounded-xl
              bg-blue-500
              px-5 py-2.5
              text-sm font-medium
              text-white
              transition-colors
              hover:bg-blue-600
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
              transition-colors
              hover:bg-orange-600
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
            transition-colors
            hover:bg-gray-200
          "
        >
          ↻ Reset Today
        </button>

      </div>

      {/* Today's Saved Time */}

      <div className="
        mt-5
        rounded-xl
        bg-gray-50
        p-3
        text-center
      ">

        <p className="text-xs text-gray-400">
          Today's saved study time
        </p>

        <p className="
          mt-1
          text-sm font-medium
          text-gray-700
        ">
          {Math.floor(todaySeconds / 60)} minutes
        </p>

      </div>

    </div>
  );
}