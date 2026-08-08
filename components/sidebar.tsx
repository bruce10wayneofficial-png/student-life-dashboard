"use client";

type NavItem = {
  label: string;
  icon: string;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "🏠" },
  { label: "Tasks", icon: "✅" },
  { label: "Notes", icon: "📝" },
  { label: "Calendar", icon: "📅" },
  { label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-screen w-60 border-r border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-6 py-5">
        <h1 className="text-xl font-bold text-gray-800">
          🎓 Student Life
        </h1>
      </div>

      <nav className="px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.label}>
              <button className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-600 hover:bg-gray-100">
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}