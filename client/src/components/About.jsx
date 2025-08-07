//eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function About() {
  return (
    <section className="w-full bg-gray-50 dark:bg-gray-950 py-20">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-10">
        {/* Text */}
        <motion.div
          className="md:w-1/2"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            Why Choose FinanceTracker?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            We built FinanceTracker with one goal in mind — to make personal
            finance simple, visual, and effective. No more spreadsheets, no more
            guessing.
          </p>
          <p className="text-gray-600 dark:text-gray-300">
            From setting budgets to tracking every shilling you spend, our tools
            are made for real people who want real results. Join thousands who are
            taking back control of their money.
          </p>
        </motion.div>

        {/* Finance Dashboard Image */}
        <motion.div
          className="md:w-1/2 h-64 md:h-80"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <img
            src="https://images.pexels.com/photos/4386371/pexels-photo-4386371.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="Finance tracker dashboard UI"
            className="w-full h-full object-cover rounded-xl shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
}
