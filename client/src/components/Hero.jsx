import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "../context/AuthModalContext";

export default function Hero() {
  const { openModal } = useAuthModal();

  return (
    <section className="w-full bg-gradient-to-br from-blue-50 to-white py-20">
      <div className="container mx-auto px-4 flex flex-col-reverse md:flex-row items-center justify-between gap-10">
        {/* Text */}
        <motion.div
          className="text-center md:text-left max-w-xl"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight">
            Take Control of Your{" "}
            <span className="text-blue-600">Finances</span>
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Track spending, set goals, and save smarter — all in one place.
          </p>

          <Button
            onClick={() => openModal("signup")}
            className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3"
          >
            Get Started
          </Button>
        </motion.div>

        {/* Illustration Block with Image */}
        <motion.div
          className="w-full md:w-1/2 h-64 md:h-80"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Finance tracking illustration"
            className="w-full h-full object-cover rounded-xl shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
}
