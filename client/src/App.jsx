import { Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import AuthModal from "./components/AuthModal"; // ✅ make sure the path is correct

export default function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <AuthModal /> {/* ✅ Required for login/signup modal to appear */}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Route>
      </Routes>
    </>
  );
}
