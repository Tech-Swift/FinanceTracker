import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle  from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <motion.h1
          className="text-xl font-bold text-blue-600"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          FinanceTracker
        </motion.h1>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-gray-700 hover:text-blue-600 transition">Home</Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 transition">About</Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600 transition">Contact</Link>

          <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white">
            <Link to="/login">Login</Link>
          </Button>
        </nav>

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
                <Link to="/" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">Home</Link>
                <Link to="/about" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">About</Link>
                <Link to="/contact" onClick={() => setIsOpen(false)} className="text-gray-700 hover:text-blue-600">Contact</Link>
                <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700 text-white">
                  <Link to="/login" onClick={() => setIsOpen(false)}>Login</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
