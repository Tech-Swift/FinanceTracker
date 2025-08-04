import { useState } from "react";
import API from "../lib/utils";

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
  );
}
