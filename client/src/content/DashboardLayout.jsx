import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        {/* Topbar */}
        <Topbar onToggleSidebar={() => setSidebarOpen(true)} />

        {/* Main Content */}
        <main className="mt-16 p-6 overflow-y-auto flex-grow">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
