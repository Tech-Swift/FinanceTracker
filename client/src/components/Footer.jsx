import { Facebook, Twitter, Instagram, Linkedin, Github } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-gray-300">
      <motion.div
        className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        {/* Column 1: Logo & Description */}
        <div>
          <h2 className="text-2xl font-bold text-white">FinanceTracker</h2>
          <p className="mt-3 text-sm text-gray-400">
            Take full control of your money with insights, budgets, and real-time tracking.
          </p>
          <div className="flex mt-4 space-x-3">
            <a href="#" aria-label="Facebook">
              <Facebook className="h-5 w-5 hover:text-blue-500" />
            </a>
            <a href="#" aria-label="Twitter">
              <Twitter className="h-5 w-5 hover:text-sky-400" />
            </a>
            <a href="#" aria-label="Instagram">
              <Instagram className="h-5 w-5 hover:text-pink-500" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <Linkedin className="h-5 w-5 hover:text-blue-300" />
            </a>
            <a href="#" aria-label="GitHub">
              <Github className="h-5 w-5 hover:text-gray-400" />
            </a>
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div>
          <h3 className="text-white font-semibold mb-4">Navigate</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/features" className="hover:text-white">Features</Link></li>
            <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link to="/about" className="hover:text-white">About</Link></li>
          </ul>
        </div>

        {/* Column 3: Legal */}
        <div>
          <h3 className="text-white font-semibold mb-4">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
            <li><Link to="/security" className="hover:text-white">Security</Link></li>
            <li><Link to="/cookies" className="hover:text-white">Cookies</Link></li>
          </ul>
        </div>

        {/* Column 4: Newsletter */}
        <div>
          <h3 className="text-white font-semibold mb-4">Subscribe to Newsletter</h3>
          <p className="text-sm text-gray-400 mb-4">
            Get the latest updates and budgeting tips delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row items-center gap-3">
            <Input
              type="email"
              placeholder="Your email"
              className="w-full text-black"
              required
            />
            <Button type="submit" className="w-full sm:w-auto">
              Subscribe
            </Button>
          </form>
        </div>
      </motion.div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 text-center py-4 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} FinanceTracker. All rights reserved.
      </div>
    </footer>
  );
}
