"use client";

import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Settings = {
  studentName: string;
  email: string;
  notifications: boolean;
  darkMode: boolean;
};

// ─── Default Settings ─────────────────────────────────────────────────────────

const defaultSettings: Settings = {
  studentName: "Student",
  email: "student@example.com",
  notifications: true,
  darkMode: false,
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SettingsPage() {
  // ── Settings State ─────────────────────────────────────────────────────────

  const [settings, setSettings] =
    useState<Settings>(defaultSettings);

  const [saved, setSaved] = useState(false);

  // ── Load Settings ──────────────────────────────────────────────────────────

  useEffect(() => {
    const savedSettings = localStorage.getItem(
      "student-life-settings"
    );

    if (savedSettings) {
      try {
        const parsedSettings: Settings =
          JSON.parse(savedSettings);

        setSettings(parsedSettings);
      } catch {
        console.log("Could not load saved settings.");
      }
    }
  }, []);

  // ── Update Setting ─────────────────────────────────────────────────────────

  function updateSetting<K extends keyof Settings>(
    key: K,
    value: Settings[K]
  ) {
    setSettings((currentSettings) => ({
      ...currentSettings,
      [key]: value,
    }));

    setSaved(false);
  }

  // ── Save Settings ─────────────────────────────────────────────────────────

  function saveSettings() {
    localStorage.setItem(
      "student-life-settings",
      JSON.stringify(settings)
    );

    // Tell ThemeProvider that settings changed
    window.dispatchEvent(
      new Event("student-settings-changed")
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  // ── Reset Settings ─────────────────────────────────────────────────────────

  function resetSettings() {
    setSettings(defaultSettings);

    localStorage.setItem(
      "student-life-settings",
      JSON.stringify(defaultSettings)
    );

    // Tell ThemeProvider that settings changed
    window.dispatchEvent(
      new Event("student-settings-changed")
    );

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  }

  // ── UI ─────────────────────────────────────────────────────────────────────

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── Header ── */}

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ⚙️ Settings
        </h1>

        <p className="text-gray-500 text-sm">
          Manage your student dashboard preferences.
        </p>
      </div>

      {/* ── Profile Section ── */}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">

        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          👤 Profile
        </h2>

        <p className="text-sm text-gray-400 mb-5">
          Update your basic student information.
        </p>

        {/* Student Name */}

        <div className="mb-4">

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Student Name
          </label>

          <input
            type="text"
            value={settings.studentName}
            onChange={(e) =>
              updateSetting("studentName", e.target.value)
            }
            placeholder="Enter your name"
            className="
              w-full px-4 py-2.5 rounded-xl
              border border-gray-200
              bg-gray-50 text-gray-800
              text-sm
              focus:outline-none
              focus:ring-2 focus:ring-blue-300
              transition-all duration-200
            "
          />

        </div>

        {/* Email */}

        <div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>

          <input
            type="email"
            value={settings.email}
            onChange={(e) =>
              updateSetting("email", e.target.value)
            }
            placeholder="Enter your email"
            className="
              w-full px-4 py-2.5 rounded-xl
              border border-gray-200
              bg-gray-50 text-gray-800
              text-sm
              focus:outline-none
              focus:ring-2 focus:ring-blue-300
              transition-all duration-200
            "
          />

        </div>

      </div>

      {/* ── Preferences Section ── */}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mb-6">

        <h2 className="text-lg font-semibold text-gray-800 mb-1">
          🎛️ Preferences
        </h2>

        <p className="text-sm text-gray-400 mb-5">
          Customize how your dashboard behaves.
        </p>

        {/* Notifications */}

        <div className="flex items-center justify-between py-4 border-b border-gray-100">

          <div>

            <h3 className="text-sm font-medium text-gray-700">
              🔔 Notifications
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              Receive reminders about your tasks and events.
            </p>

          </div>

          <button
            onClick={() =>
              updateSetting(
                "notifications",
                !settings.notifications
              )
            }
            className={`
              relative w-12 h-6 rounded-full
              transition-colors duration-200
              ${
                settings.notifications
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }
            `}
            aria-label="Toggle notifications"
          >

            <span
              className={`
                absolute top-1 w-4 h-4
                bg-white rounded-full
                shadow-sm
                transition-transform duration-200
                ${
                  settings.notifications
                    ? "translate-x-7"
                    : "translate-x-1"
                }
              `}
            />

          </button>

        </div>

        {/* Dark Mode */}

        <div className="flex items-center justify-between py-4">

          <div>

            <h3 className="text-sm font-medium text-gray-700">
              🌙 Dark Mode
            </h3>

            <p className="text-xs text-gray-400 mt-1">
              Switch between light and dark appearance.
            </p>

          </div>

          <button
            onClick={() =>
              updateSetting(
                "darkMode",
                !settings.darkMode
              )
            }
            className={`
              relative w-12 h-6 rounded-full
              transition-colors duration-200
              ${
                settings.darkMode
                  ? "bg-blue-500"
                  : "bg-gray-300"
              }
            `}
            aria-label="Toggle dark mode"
          >

            <span
              className={`
                absolute top-1 w-4 h-4
                bg-white rounded-full
                shadow-sm
                transition-transform duration-200
                ${
                  settings.darkMode
                    ? "translate-x-7"
                    : "translate-x-1"
                }
              `}
            />

          </button>

        </div>

      </div>

      {/* ── Save Section ── */}

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

          <div>

            <h2 className="text-sm font-semibold text-gray-700">
              Save your changes
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Your settings will be stored in this browser.
            </p>

          </div>

          <div className="flex items-center gap-2">

            {/* Reset */}

            <button
              onClick={resetSettings}
              className="
                px-4 py-2.5
                text-sm font-medium
                rounded-xl
                bg-gray-100
                hover:bg-gray-200
                text-gray-600
                transition-colors duration-200
              "
            >
              Reset
            </button>

            {/* Save */}

            <button
              onClick={saveSettings}
              className="
                px-5 py-2.5
                text-sm font-medium
                rounded-xl
                bg-blue-500
                hover:bg-blue-600
                text-white
                transition-colors duration-200
              "
            >
              Save Changes
            </button>

          </div>

        </div>

        {/* Saved Message */}

        {saved && (
          <div className="
            mt-4
            px-4 py-3
            rounded-xl
            bg-green-50
            border border-green-200
            text-sm text-green-700
          ">
            ✅ Settings saved successfully!
          </div>
        )}

      </div>

    </div>
  );
}