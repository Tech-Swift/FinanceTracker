// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "../context/AuthModalContext";

export default function CallToAction() {
  const { openModal } = useAuthModal();

  return (
    <section className="w-full py-20 bg-gray-50 dark:bg-gray-900">
      <motion.div
        className="container mx-auto px-4 text-center bg-white dark:bg-gray-800 rounded-2xl shadow-md py-12 px-6"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          Ready to Take Control of Your Finances?
        </h2>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
          Start tracking your spending, saving, and growing your money today.
        </p>
        <Button
          onClick={() => openModal("signup")}
          className="bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition text-lg px-6 py-3 font-semibold"
        >
          Get Started Now
        </Button>
      </motion.div>
    </section>
  );
}
