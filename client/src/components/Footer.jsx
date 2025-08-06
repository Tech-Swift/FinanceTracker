import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  const location = useLocation();
  const navigate = useNavigate();

  // Smooth scroll to section if already on Home page
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handles both internal scroll and route to Home then scroll
  const handleNavigate = (id) => {
    if (location.pathname === "/") {
      scrollToSection(id);
    } else {
      navigate(`/#${id}`);
    }
  };

  return (
    <footer className="w-full bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300">
      {/* Main Footer Content */}
      <motion.div
        className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* Column 1: Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold text-blue-600 dark:text-blue-400">FinanceTracker</h2>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
            Take full control of your money with insights, budgets, and real-time tracking.
          </p>
          <div className="flex mt-4 space-x-3">
            <a href="#" aria-label="Facebook">
              <Facebook className="h-5 w-5 hover:text-blue-600 dark:hover:text-blue-400" />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter className="h-5 w-5 hover:text-sky-500 dark:hover:text-sky-400" />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram className="h-5 w-5 hover:text-pink-500" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5 hover:text-blue-700 dark:hover:text-blue-300" />
            </a>
            <a href="#" aria-label="GitHub">
              <Github className="h-5 w-5 hover:text-gray-700 dark:hover:text-gray-300" />
            </a>
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Navigate</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400">Home</Link>
            </li>
            <li>
              <button
                onClick={() => handleNavigate("features")}
                className="hover:text-blue-600 dark:hover:text-blue-400 text-left"
              >
                Features
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigate("pricing")}
                className="hover:text-blue-600 dark:hover:text-blue-400 text-left"
              >
                Pricing
              </button>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-600 dark:hover:text-blue-400">
                About
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Legal */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:text-blue-600 dark:hover:text-blue-400">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-blue-600 dark:hover:text-blue-400">Terms of Service</Link></li>
            <li><Link to="/security" className="hover:text-blue-600 dark:hover:text-blue-400">Security</Link></li>
            <li><Link to="/cookies" className="hover:text-blue-600 dark:hover:text-blue-400">Cookies</Link></li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subscribe to Newsletter</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Get the latest updates and budgeting tips delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row items-center gap-3">
            <Input
              type="email"
              placeholder="Your email"
              className="w-full bg-white dark:bg-gray-800 text-black dark:text-white"
              required
            />
            <Button type="submit" className="w-full sm:w-auto">
              Subscribe
            </Button>
          </form>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 dark:border-gray-700 text-center py-4 text-sm text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} FinanceTracker. All rights reserved.
      </div>
    </footer>
  );
}
