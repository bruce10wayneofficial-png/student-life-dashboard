"use client";

import { useEffect, useState } from "react";

import DashboardCard from "@/components/dashboardCard";
import StudyTimer from "@/components/studytimer";
import TaskList from "@/components/tasklist";
import UpcomingEvents from "@/components/upcomingevents";

// ─── Types ────────────────────────────────────────────────────────────────────

type Task = {
  id: number;
  title: string;
  completed: boolean;
};

type Note = {
  id: number;
  title: string;
  content: string;
  subject: string;
  date: string;
  color: string;
};

type Event = {
  id: number;
  title: string;
  date: string;
  time: string;
  type: "academic" | "social" | "sports" | "other";
};

type StudySessions = Record<string, number>;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

function getWeekStartKey(): string {
  const today = new Date();

  const day = today.getDay();

  // Monday = start of week
  const daysFromMonday = day === 0 ? 6 : day - 1;

  const monday = new Date(today);

  monday.setDate(
    today.getDate() - daysFromMonday
  );

  return monday.toISOString().split("T")[0];
}

function formatStudyTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  return `${minutes}m`;
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [studySessions, setStudySessions] =
    useState<StudySessions>({});

  // ── Load all dashboard data ───────────────────────────────────────────────

  function loadDashboardData() {
    // Tasks

    const savedTasks =
      localStorage.getItem("student-life-tasks");

    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch {
        setTasks([]);
      }
    } else {
      setTasks([]);
    }

    // Notes

    const savedNotes =
      localStorage.getItem("student-life-notes");

    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch {
        setNotes([]);
      }
    } else {
      setNotes([]);
    }

    // Events

    const savedEvents =
      localStorage.getItem("student-life-events");

    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch {
        setEvents([]);
      }
    } else {
      setEvents([]);
    }

    // Study sessions

    const savedSessions =
      localStorage.getItem(
        "student-life-study-sessions"
      );

    if (savedSessions) {
      try {
        setStudySessions(
          JSON.parse(savedSessions)
        );
      } catch {
        setStudySessions({});
      }
    } else {
      setStudySessions({});
    }
  }

  // ── Load on page open + listen for updates ─────────────────────────────────

  useEffect(() => {
    loadDashboardData();

    function handleDashboardUpdate() {
      loadDashboardData();
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

  // ── Task statistics ───────────────────────────────────────────────────────

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = tasks.length;

  const incompleteTasks =
    totalTasks - completedTasks;

  // ── Event statistics ──────────────────────────────────────────────────────

  const today = getTodayKey();

  const upcomingEvents = events.filter(
    (event) => event.date >= today
  );

  // ── Study statistics ───────────────────────────────────────────────────────

  const weekStart = getWeekStartKey();

  const todayStudySeconds =
    studySessions[today] ?? 0;

  const thisWeekStudySeconds =
    Object.entries(studySessions)
      .filter(([date]) => date >= weekStart)
      .reduce(
        (total, [, seconds]) =>
          total + seconds,
        0
      );

  const totalStudySeconds =
    Object.values(studySessions).reduce(
      (total, seconds) =>
        total + seconds,
      0
    );

  // ── UI ─────────────────────────────────────────────────────────────────────

  return (
    <div>

      {/* ── Welcome ── */}

      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome back, Raju! 👋
        </h1>

        <p className="mt-2 text-gray-600">
          Here is an overview of your student life.
        </p>
      </div>

      {/* ── Statistics Cards ── */}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <DashboardCard
          title="Tasks"
          value={`${completedTasks}/${totalTasks}`}
          icon="📋"
        />

        <DashboardCard
          title="Notes"
          value={String(notes.length)}
          icon="📝"
        />

        <DashboardCard
          title="Upcoming Events"
          value={String(upcomingEvents.length)}
          icon="📅"
        />

        <DashboardCard
          title="Study Time"
          value={formatStudyTime(todayStudySeconds)}
          icon="⏱️"
        />

      </div>

      {/* ── Study Statistics ── */}

      <div className="mt-8 grid gap-5 sm:grid-cols-3">

        <div className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-6
          shadow-sm
        ">
          <p className="text-sm text-gray-500">
            📅 Today
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-800">
            {formatStudyTime(todayStudySeconds)}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Study time today
          </p>
        </div>

        <div className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-6
          shadow-sm
        ">
          <p className="text-sm text-gray-500">
            📊 This Week
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-800">
            {formatStudyTime(thisWeekStudySeconds)}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Monday to today
          </p>
        </div>

        <div className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-6
          shadow-sm
        ">
          <p className="text-sm text-gray-500">
            🏆 Total
          </p>

          <p className="mt-2 text-2xl font-bold text-gray-800">
            {formatStudyTime(totalStudySeconds)}
          </p>

          <p className="mt-1 text-xs text-gray-400">
            All recorded study time
          </p>
        </div>

      </div>

      {/* ── Study Timer ── */}

      <div className="mt-8">
        <StudyTimer />
      </div>

      {/* ── Quick Summary ── */}

      <div className="mt-8 grid gap-5 sm:grid-cols-2">

        <div className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-6
          shadow-sm
        ">

          <h2 className="text-lg font-semibold text-gray-800">
            ✅ Task Progress
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            You have {completedTasks} completed and{" "}
            {incompleteTasks} remaining.
          </p>

          <div className="mt-4 h-2 w-full rounded-full bg-gray-100">

            <div
              className="
                h-2 rounded-full
                bg-green-400
                transition-all duration-500
              "
              style={{
                width:
                  totalTasks === 0
                    ? "0%"
                    : `${(completedTasks / totalTasks) * 100}%`,
              }}
            />

          </div>

        </div>

        <div className="
          rounded-2xl
          border border-gray-200
          bg-white
          p-6
          shadow-sm
        ">

          <h2 className="text-lg font-semibold text-gray-800">
            📚 Study Overview
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            You currently have {notes.length} notes and{" "}
            {upcomingEvents.length} upcoming events.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Today:{" "}
            <span className="font-medium text-gray-700">
              {formatStudyTime(todayStudySeconds)}
            </span>
          </p>

          <p className="mt-2 text-sm text-gray-500">
            This week:{" "}
            <span className="font-medium text-gray-700">
              {formatStudyTime(thisWeekStudySeconds)}
            </span>
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Total:{" "}
            <span className="font-medium text-gray-700">
              {formatStudyTime(totalStudySeconds)}
            </span>
          </p>

        </div>

      </div>

      {/* ── Main Sections ── */}

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <TaskList />
        <UpcomingEvents />
      </div>

    </div>
  );
}