import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Faith M.",
    role: "Freelancer",
    feedback:
      "FinanceTracker helped me finally stick to a budget. The visuals and alerts make it easy to stay on track.",
  },
  {
    name: "Brian K.",
    role: "Small Business Owner",
    feedback:
      "I can now separate business and personal finances clearly. This app is a game changer!",
  },
  {
    name: "Aisha N.",
    role: "University Student",
    feedback:
      "Simple, clean, and exactly what I needed to monitor my campus spending habits.",
  },
];

export default function Testimonials() {
  return (
    <section className="w-full bg-white py-20">
      <div className="container mx-auto px-4 text-center">
        <motion.h2
          className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          What Our Users Say
        </motion.h2>
        <p className="text-gray-600 mb-12 max-w-xl mx-auto">
          Real feedback from real people who have transformed their financial lives.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((item, index) => (
            <motion.div
              key={index}
              className="bg-blue-50 p-6 rounded-xl shadow-md"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-700 italic mb-4">"{item.feedback}"</p>
              <div className="text-left">
                <p className="font-semibold text-blue-600">{item.name}</p>
                <p className="text-sm text-gray-500">{item.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
