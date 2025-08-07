import { NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  CreditCard,
  PiggyBank,
  FileBarChart2,
  User,
  Target,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: <LayoutDashboard /> },
  { to: "/transactions", label: "Transactions", icon: <CreditCard /> },
  { to: "/budgets", label: "Budgets", icon: <PiggyBank /> },
  { to: "/reports", label: "Reports", icon: <FileBarChart2 /> },
  { to: "/goals", label: "Goals", icon: <Target /> },
  { to: "/profile", label: "Profile", icon: <User /> },
];

export default function Sidebar({ isOpen, onClose }) {
  const { setUser, setToken } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    navigate("/");
  };

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`h-screen w-64 bg-white dark:bg-gray-900 shadow-lg p-4 fixed top-0 left-0 flex flex-col justify-between z-40 transition-transform duration-300 transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex`}
      >
        <div>
          <motion.h1
            className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-10 text-center"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
          >
            FinanceTracker
          </motion.h1>

          <nav className="space-y-4">
            {navItems.map(({ to, label, icon }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose} // close menu on mobile click
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`
                }
              >
                {icon}
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm mt-8"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </aside>

      {/* Overlay when sidebar is open (mobile) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={onClose}
        />
      )}
    </>
  );
}
