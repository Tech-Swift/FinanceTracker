// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { TrendingUp, Wallet, Target, CalendarCheck } from "lucide-react";

const features = [
  {
    icon: <TrendingUp className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    title: "Smart Budgeting",
    description: "Create custom budgets and track your spending in real-time.",
  },
  {
    icon: <Wallet className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    title: "Expense Tracking",
    description: "Categorize your expenses and see where your money goes.",
  },
  {
    icon: <Target className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    title: "Goal Setting",
    description: "Set financial goals and monitor your progress easily.",
  },
  {
    icon: <CalendarCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />,
    title: "Reminders & Alerts",
    description: "Never miss a bill payment or savings target again.",
  },
];

export default function Features() {
  return (
    <section className="w-full py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Powerful Features to Help You Thrive
        </motion.h2>
        <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-xl mx-auto">
          Everything you need to take control of your money — simplified.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 rounded-lg bg-blue-50 dark:bg-gray-900 shadow-sm hover:shadow-md transition"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
