import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="w-full py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
      <motion.div
        className="container mx-auto px-4 text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Take Control of Your Finances?
        </h2>
        <p className="text-lg md:text-xl mb-8">
          Start tracking your spending, saving, and growing your money today.
        </p>
        <Button className="bg-white text-yellow-700 font-semibold px-6 py-3 text-lg hover:bg-gray-100 transition">
          Get Started Now
        </Button>
      </motion.div>
    </section>
  );
}
