export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Page title */}
      <h2 className="text-lg font-semibold text-gray-800">
        Dashboard
      </h2>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <button
          aria-label="Notifications"
          className="rounded-full p-2 text-lg hover:bg-gray-100"
        >
          🔔
        </button>

        {/* User */}
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
            R
          </div>

          <span className="text-sm font-medium text-gray-700">
            Raazu
          </span>
        </div>
      </div>
    </header>
  );
}