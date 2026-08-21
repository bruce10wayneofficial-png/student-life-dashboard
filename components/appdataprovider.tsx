"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type Task = {
  id: number;
  title: string;
  completed: boolean;
};

export type Note = {
  id: number;
  title: string;
  content: string;
  subject: string;
  date: string;
  color: string;
};

export type CalendarEvent = {
  id: number;
  title: string;
  date: string;
  time: string;
  type: "academic" | "social" | "sports" | "other";
};

export type StudySessions = Record<string, number>;

type AppDataContextType = {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;

  notes: Note[];
  setNotes: React.Dispatch<React.SetStateAction<Note[]>>;

  events: CalendarEvent[];
  setEvents: React.Dispatch<
    React.SetStateAction<CalendarEvent[]>
  >;

  studySessions: StudySessions;
  setStudySessions: React.Dispatch<
    React.SetStateAction<StudySessions>
  >;
};

// ─── Initial Data ─────────────────────────────────────────────────────────────

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Finish math homework",
    completed: true,
  },
  {
    id: 2,
    title: "Read chapter 4 of Biology",
    completed: false,
  },
  {
    id: 3,
    title: "Prepare English presentation",
    completed: false,
  },
  {
    id: 4,
    title: "Review lecture notes",
    completed: true,
  },
];

const initialNotes: Note[] = [
  {
    id: 1,
    title: "Probability Formulas",
    content:
      "P(A or B) = P(A) + P(B) - P(A and B). Independent events: P(A and B) = P(A) × P(B). Complement rule: P(not A) = 1 - P(A).",
    subject: "Mathematics",
    date: "2026-08-06",
    color: "bg-blue-50 border-blue-200",
  },
  {
    id: 2,
    title: "Vocabulary and Grammar",
    content:
      "Der/Die/Das — always learn nouns with their article. Modal verbs: können, müssen, wollen, sollen, dürfen, mögen.",
    subject: "German",
    date: "2026-08-06",
    color: "bg-yellow-50 border-yellow-200",
  },
  {
    id: 3,
    title: "React and Next.js Concepts",
    content:
      "useState stores data that changes over time. Components are functions that return JSX. Next.js App Router uses folders as routes.",
    subject: "Programming",
    date: "2026-08-06",
    color: "bg-purple-50 border-purple-200",
  },
];

const initialEvents: CalendarEvent[] = [
  {
    id: 1,
    title: "Mathematics Lecture",
    date: "2026-08-14",
    time: "10:00",
    type: "academic",
  },
  {
    id: 2,
    title: "Programming Study Group",
    date: "2026-08-16",
    time: "15:00",
    type: "academic",
  },
  {
    id: 3,
    title: "Football Game",
    date: "2026-08-18",
    time: "18:30",
    type: "sports",
  },
];

// ─── Context ──────────────────────────────────────────────────────────────────

const AppDataContext =
  createContext<AppDataContextType | null>(null);

// ─── Provider ─────────────────────────────────────────────────────────────────

export default function AppDataProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [tasks, setTasks] =
    useState<Task[]>(initialTasks);

  const [notes, setNotes] =
    useState<Note[]>(initialNotes);

  const [events, setEvents] =
    useState<CalendarEvent[]>(initialEvents);

  const [studySessions, setStudySessions] =
    useState<StudySessions>({});

  const [loaded, setLoaded] = useState(false);

  // ── Load everything from localStorage ─────────────────────────────────────

  useEffect(() => {
    try {
      const savedTasks =
        localStorage.getItem("student-life-tasks");

      const savedNotes =
        localStorage.getItem("student-life-notes");

      const savedEvents =
        localStorage.getItem("student-life-events");

      const savedStudySessions =
        localStorage.getItem(
          "student-life-study-sessions"
        );

      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }

      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }

      if (savedEvents) {
        setEvents(JSON.parse(savedEvents));
      }

      if (savedStudySessions) {
        setStudySessions(
          JSON.parse(savedStudySessions)
        );
      }
    } catch {
      console.log(
        "Could not load saved application data."
      );
    }

    setLoaded(true);
  }, []);

  // ── Save tasks ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(
      "student-life-tasks",
      JSON.stringify(tasks)
    );
  }, [tasks, loaded]);

  // ── Save notes ─────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(
      "student-life-notes",
      JSON.stringify(notes)
    );
  }, [notes, loaded]);

  // ── Save events ────────────────────────────────────────────────────────────

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(
      "student-life-events",
      JSON.stringify(events)
    );
  }, [events, loaded]);

  // ── Save study sessions ───────────────────────────────────────────────────

  useEffect(() => {
    if (!loaded) return;

    localStorage.setItem(
      "student-life-study-sessions",
      JSON.stringify(studySessions)
    );
  }, [studySessions, loaded]);

  return (
    <AppDataContext.Provider
      value={{
        tasks,
        setTasks,
        notes,
        setNotes,
        events,
        setEvents,
        studySessions,
        setStudySessions,
      }}
    >
      {children}
    </AppDataContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAppData() {
  const context = useContext(AppDataContext);

  if (!context) {
    throw new Error(
      "useAppData must be used inside AppDataProvider"
    );
  }

  return context;
}