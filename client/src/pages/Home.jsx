import { useEffect, useState } from "react";
import { AuthModalProvider } from "../context/AuthModalContext";
import AuthModal from "../components/AuthModal";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Services from "../components/Services";
import About from "../components/About";
import Testimonials from "../components/Testimonials";
import CallToAction from "../components/CallToAction";
import Pricing from "../components/Pricing";

export default function Home() {
  const [, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setTheme("dark");
    } else {
      document.documentElement.classList.remove("dark");
      setTheme("light");
    }
  }, []);

  return (
    <AuthModalProvider>
      <div className="w-full overflow-x-hidden bg-white text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-300">
        <section id="hero"><Hero /></section>
        <section id="features"><Features /></section>
        <section id="services"><Services /></section>
        <section id="about"><About /></section>
        <section id="testimonials"><Testimonials /></section>
        <section id="cta"><CallToAction /></section>
        <section id="pricing"><Pricing /></section>
      </div>

      {/* Important: This must be placed here to ensure modal renders */}
      <AuthModal />
    </AuthModalProvider>
  );
}
