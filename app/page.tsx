import DashboardCard from "@/components/dashboardCard";
import TaskList from "@/components/tasklist";
import UpcomingEvents from "@/components/upcomingevents";


export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800">
        Welcome back, Raju! 👋
      </h1>

      <p className="mt-2 text-gray-600">
        Here is an overview of your student life.
      </p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Tasks"
          value="5"
          icon="📋"
        />

        <DashboardCard
          title="Upcoming Events"
          value="3"
          icon="📅"
        />

        <DashboardCard
          title="Study Time"
          value="12.5h"
          icon="⏱️"
        />

        <DashboardCard
          title="Expenses"
          value="€245"
          icon="💰"
        />
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <TaskList />
        <UpcomingEvents />
      </div>
    </div>
  );
}