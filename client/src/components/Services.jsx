//eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import {
  FileBarChart2,
  Banknote,
  BellRing,
  Settings2,
  PieChart,
  CreditCard,
} from "lucide-react";

const leftServices = [
  {
    icon: <FileBarChart2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    title: "Detailed Reports",
    description: "Track your spending patterns monthly and weekly.",
  },
  {
    icon: <BellRing className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    title: "Bill Reminders",
    description: "Get notified before your bills are due.",
  },
  {
    icon: <CreditCard className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    title: "Smart Payments",
    description: "Link and manage multiple payment sources easily.",
  },
];

const rightServices = [
  {
    icon: <Banknote className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    title: "Account Syncing",
    description: "View all your bank accounts in one dashboard.",
  },
  {
    icon: <Settings2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    title: "Smart Categories",
    description: "Organize expenses automatically by type.",
  },
  {
    icon: <PieChart className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
    title: "Spending Insights",
    description: "Visualize your income and expenses clearly.",
  },
];

export default function Services() {
  return (
    <section className="w-full bg-white dark:bg-gray-950 py-20">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-center text-gray-800 dark:text-white mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Services Built to Support You
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Left Grid */}
          <div className="space-y-6">
            {leftServices.map((service, index) => (
              <motion.div
                key={index}
                className="p-5 bg-blue-50 dark:bg-gray-900 rounded-xl shadow hover:shadow-md transition"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-2">{service.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Center Image Block */}
          <motion.div
            className="w-full h-64 md:h-80 mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <img
              src="" // You can add an image here
              alt="Financial dashboard"
              className="w-full h-full object-cover rounded-xl shadow-lg"
            />
          </motion.div>

          {/* Right Grid */}
          <div className="space-y-6">
            {rightServices.map((service, index) => (
              <motion.div
                key={index}
                className="p-5 bg-blue-50 dark:bg-gray-900 rounded-xl shadow hover:shadow-md transition"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="mb-2">{service.icon}</div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {service.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
