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

// ─── Dashboard ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [studyTime, setStudyTime] = useState(0);

  // ── Load dashboard data ───────────────────────────────────────────────────

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

    // Study time

    const savedStudyTime =
      localStorage.getItem(
        "student-life-study-time"
      );

    if (savedStudyTime) {
      const parsedStudyTime = Number(savedStudyTime);

      if (!Number.isNaN(parsedStudyTime)) {
        setStudyTime(parsedStudyTime);
      }
    } else {
      setStudyTime(0);
    }
  }

  // ── Load on start + listen for updates ────────────────────────────────────

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

  // ── Statistics ────────────────────────────────────────────────────────────

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = tasks.length;

  const incompleteTasks =
    totalTasks - completedTasks;

  const today =
    new Date().toISOString().split("T")[0];

  const upcomingEvents = events.filter(
    (event) => event.date >= today
  );

  // Study time in a readable format

  const studyHours = Math.floor(
    studyTime / 3600
  );

  const studyMinutes = Math.floor(
    (studyTime % 3600) / 60
  );

  let studyTimeLabel = "0m";

  if (studyHours > 0) {
    studyTimeLabel = `${studyHours}h ${studyMinutes}m`;
  } else {
    studyTimeLabel = `${studyMinutes}m`;
  }

  // ── UI ────────────────────────────────────────────────────────────────────

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
          value={studyTimeLabel}
          icon="⏱️"
        />

      </div>

      {/* ── Study Timer ── */}

      <div className="mt-8">
        <StudyTimer />
      </div>

      {/* ── Quick Summary ── */}

      <div className="mt-8 grid gap-5 sm:grid-cols-2">

        {/* Task Progress */}

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
              className="h-2 rounded-full bg-green-400 transition-all duration-500"
              style={{
                width:
                  totalTasks === 0
                    ? "0%"
                    : `${(completedTasks / totalTasks) * 100}%`,
              }}
            />

          </div>

        </div>

        {/* Study Overview */}

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
            Total study time:{" "}
            <span className="font-medium text-gray-700">
              {studyTimeLabel}
            </span>
          </p>

        </div>

      </div>

      {/* ── Main Dashboard Sections ── */}

      <div className="mt-8 grid gap-5 lg:grid-cols-2">

        <TaskList />

        <UpcomingEvents />

      </div>

    </div>
  );
}