"use client";

import { useEffect, useState } from "react";

import DashboardCard from "@/components/dashboardCard";
import TaskList from "@/components/tasklist";
import UpcomingEvents from "@/components/upcomingevents";

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

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  function loadDashboardData() {
    // Tasks
    const savedTasks = localStorage.getItem(
      "student-life-tasks"
    );

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
    const savedNotes = localStorage.getItem(
      "student-life-notes"
    );

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
    const savedEvents = localStorage.getItem(
      "student-life-events"
    );

    if (savedEvents) {
      try {
        setEvents(JSON.parse(savedEvents));
      } catch {
        setEvents([]);
      }
    } else {
      setEvents([]);
    }
  }

  useEffect(() => {
    // Load when Dashboard first opens
    loadDashboardData();

    // Update when another tab changes localStorage
    function handleStorageChange() {
      loadDashboardData();
    }

    // Update when our own app changes data
    function handleDashboardUpdate() {
      loadDashboardData();
    }

    window.addEventListener(
      "storage",
      handleStorageChange
    );

    window.addEventListener(
      "student-dashboard-updated",
      handleDashboardUpdate
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorageChange
      );

      window.removeEventListener(
        "student-dashboard-updated",
        handleDashboardUpdate
      );
    };
  }, []);

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  // Only count events that are today or in the future.
  const today = new Date().toISOString().split("T")[0];

  const upcomingEvents = events.filter(
    (event) => event.date >= today
  );

  return (
    <div>
      {/* Welcome */}

      <h1 className="text-2xl font-bold text-gray-800">
        Welcome back, Raju! 👋
      </h1>

      <p className="mt-2 text-gray-600">
        Here is an overview of your student life.
      </p>

      {/* Dashboard Cards */}

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

        <DashboardCard
          title="Tasks"
          value={`${completedTasks}/${tasks.length}`}
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
          value="Coming soon"
          icon="⏱️"
        />

      </div>

      {/* Dashboard Sections */}

      <div className="mt-8 grid gap-5 lg:grid-cols-2">

        <TaskList />

        <UpcomingEvents />

      </div>
    </div>
  );
}