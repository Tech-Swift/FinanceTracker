import { AuthModalProvider } from "../context/AuthModalContext";
import AuthModal from "../components/AuthModal";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Services from "../components/Services";
import About from "../components/About";
import Testimonials from "../components/Testimonials";
import CallToAction from "../components/CallToAction";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <AuthModalProvider>
      <div className="w-full overflow-x-hidden">
        <Navbar />
        <Hero />
        <Features />
        <Services />
        <About />
        <Testimonials />
        <CallToAction />
        <Footer />
      </div>

      {/* Important: This must be placed here to ensure modal renders */}
      <AuthModal />
    </AuthModalProvider>
  );
}
