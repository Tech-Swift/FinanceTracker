import { Menu } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle"; // adjust the path if needed

export default function Topbar({ onToggleSidebar }) {

  return (
    <header className="fixed top-0 left-0 w-full z-30 h-16 bg-white dark:bg-gray-900 shadow px-4 md:px-8">
      <div className="flex items-center justify-between h-full">
        {/* Left Side: Logo + Hamburger (for small screens) */}
        <div className="flex items-center gap-4">
          {/* Hamburger */}
          <button
            onClick={onToggleSidebar}
            className="md:hidden bg-gray-800 text-white p-2 rounded-full"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <span className="text-xl font-bold text-blue-600">
            FinanceTracker
          </span>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white">
            D
          </div>
        </div>
      </div>
    </header>
  );
}
