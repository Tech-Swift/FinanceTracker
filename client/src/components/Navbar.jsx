import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useAuthModal } from "../context/AuthModalContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { openModal } = useAuthModal();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-blue-600 dark:text-blue-400 font-semibold"
      : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition";

  return (
    <header className="w-full sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Animated Logo */}
        <motion.h1
          className="text-xl font-bold text-blue-600 dark:text-blue-400"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          FinanceTracker
        </motion.h1>

        {/* Desktop Nav */}
        <motion.nav
          className="hidden md:flex items-center gap-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <motion.div whileHover={{ scale: 1.1 }}>
            <NavLink to="/" className={linkClass}>Home</NavLink>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }}>
            <NavLink to="/about" className={linkClass}>About</NavLink>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }}>
            <NavLink to="/contact" className={linkClass}>Contact</NavLink>
          </motion.div>

          <motion.div whileHover={{ rotate: 20 }} transition={{ type: "spring", stiffness: 300 }}>
            <ThemeToggle />
          </motion.div>

          {user ? (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white dark:bg-red-500 dark:hover:bg-red-600"
              >
                Logout
              </Button>
            </motion.div>
          ) : (
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => openModal("login")}
                className="bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                Login
              </Button>
            </motion.div>
          )}
        </motion.nav>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-6">
              <nav className="flex flex-col gap-4 mt-4">
                <NavLink to="/" onClick={() => setIsOpen(false)} className={linkClass}>Home</NavLink>
                <NavLink to="/about" onClick={() => setIsOpen(false)} className={linkClass}>About</NavLink>
                <NavLink to="/contact" onClick={() => setIsOpen(false)} className={linkClass}>Contact</NavLink>

                <div className="mt-2">
                  <ThemeToggle />
                </div>

                {user ? (
                  <Button
                    onClick={() => {
                      handleLogout();
                      setIsOpen(false);
                    }}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Logout
                  </Button>
                ) : (
                  <Button
                    onClick={() => {
                      openModal("login");
                      setIsOpen(false);
                    }}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Login
                  </Button>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
