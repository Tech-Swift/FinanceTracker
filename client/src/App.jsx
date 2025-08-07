import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AuthModal from "./components/AuthModal";
import ProtectedRoute from "./components/ProtectedtRoute";

// Dashboard pages
import DashboardLayout from "./content/DashboardLayout";
import Dashboard from "./content/Dashboard";
import Transactions from "./content/Transactions";
import Budgets from "./content/Budgets";
import Goals from "./content/Goals";
import Reports from "./content/Reports";
import Profile from "./content/Profile";

export default function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <AuthModal />

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Protected dashboard routes */}
        <Route
          element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </>
  );
}
